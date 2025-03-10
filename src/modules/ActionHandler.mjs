import {defaults, settings, tah} from "./constants.mjs";
import {getSetting} from "./utility/Utility.mjs";

export let ActionHandlerBlackFlag = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
  /**
   * Extends Token Action HUD Core's ActionHandler class and builds system-defined actions for the HUD
   * @extends ActionHandler
   */
  ActionHandlerBlackFlag = class ActionHandlerBlackFlag extends coreModule.api.ActionHandler {
    #maxCharacters = defaults.maxCharacters;
    #groupGear = defaults.groupGear;
    #displayUnequipped = defaults.displayUnequipped;
    #displayActivityIcon = defaults.displayActivityIcon;
    #showOnlyPrepared = defaults.showOnlyPrepared;
    #showPreparedness = defaults.showPreparedness;
    #tooltipsSetting;

    #findGroup(data = {}) {
      if (data?.nestId) {
        return this.groupHandler.groups[data.nestId]
      } else {
        return Object.values(this.groupHandler.groups).find(
          group =>
            (!data.id || group.id === data.id) &&
            (!data.type || group.type === data.type) &&
            (!data.level || group.level === data.level)
        )
      }
    }

    /**
     * Build system actions
     * Called by Token Action HUD Core
     * @override
     * @param {array} groupIds
     */
    async buildSystemActions(groupIds) {
      this.#maxCharacters = getSetting(settings.maxCharacters);
      this.#groupGear = getSetting(settings.groupGear);
      this.#displayUnequipped = getSetting(settings.displayUnequipped);
      this.#displayActivityIcon = getSetting(settings.displayActivityIcon);
      this.#showOnlyPrepared = getSetting(settings.showOnlyPrepared);
      this.#showPreparedness = getSetting(settings.showPreparedness);
      this.#tooltipsSetting = game.settings.get("token-action-hud-core", "tooltips");

      if (this.actor) {
        const physicalItems = this.actor.items.filter(i => i.system.isPhysical);
        const inventory = physicalItems.filter(i => !i.system.container && (this.#displayUnequipped ? true : i.system.equipped));
        const itemsInContainers = physicalItems.filter(i => !!i.system.container);
        const features = this.actor.items.filter(i => i.type === 'feature' || i.type === 'talent');
        const spells = this.actor.items.filter(i => i.type === 'spell');

        this.inventory = coreModule.api.Utils.sortItemsByName(inventory);
        this.itemsInContainers = coreModule.api.Utils.sortItemsByName(itemsInContainers)
        this.features = coreModule.api.Utils.sortItemsByName(features);
        this.spells = coreModule.api.Utils.sortItemsByName(spells);
      }

      if (this.actor) {
        await this.#buildCharacterActions();
      } else if (!this.actor) {
        await this.#buildMultipleTokenActions();
      }
    }

    //#region Build Actions

    /**
     * Build character actions
     * @private
     */
    async #buildCharacterActions() {
      await this.#buildAbilities();
      await this.#buildSkills();
      await this.#buildToolChecks();
      await this.#buildVehicleChecks();
      await this.#buildFeatures();
      await this.#buildSpells();
      await this.#buildEffects();
      await this.#buildConditions();
      await this.#buildInventory();
      await this.#buildUtility();
    }

    /**
     * Build multiple token actions
     * @private
     * @returns {object}
     */
    async #buildMultipleTokenActions() {
      await this.#buildAbilities();
      await this.#buildSkills();
      await this.#buildUtility();
    }

    //#region Checks & Saves
    async #buildAbilities() {
      await this.#buildAbilitiesGroup("ability", "checks");
      await this.#buildAbilitiesGroup("save", "saves");
    }

    async #buildAbilitiesGroup(actionType, groupId) {
      const abilities = this.actor?.system.abilities || CONFIG.BlackFlag.abilities;

      const isCheck = groupId === "checks";
      const isSave = groupId === "saves";

      const actions = Object.entries(abilities)
        .filter(([key, ability]) => ability.value !== 0)
        .map(([abilityId, ability]) => {
          const labels = CONFIG.BlackFlag.abilities[abilityId].labels;
          const name = game.i18n.localize(isCheck ? labels.full : labels.abbreviation);
          const label = isSave
            ? game.i18n.format("BF.Ability.Action.SaveSpecificShort", {ability: name})
            : name;
          const mod = isSave ? ability?.save?.mod : ability?.check?.mod;
          const proficiency = isSave ? ability?.save?.proficiency : ability?.check?.proficiency

          return {
            id: `${actionType}-${abilityId}`,
            name: label,
            icon1: this.#getProficiencyIcon(proficiency),
            info1: (this.actor && mod) ? {
              text: coreModule.api.Utils.getModifier(mod),
              title: `${game.i18n.localize("BF.Armor.Modifier.Label")}: ${coreModule.api.Utils.getModifier(mod)}`
            } : null,
            info2: (this.actor && ability.value) ? {
              text: `(${ability.value})`,
              title: `${game.i18n.localize("BF.Ability.Score.Label[one]")}: ${ability.value}`
            } : null,
            listName: this.#getListName(actionType, name),
            tooltip: isSave
              ? game.i18n.format("BF.Ability.Action.SaveSpecificShort", {ability: name})
              : game.i18n.format("BF.Ability.Action.CheckSpecific", {ability: name}),
            system: {actionType, actionId: abilityId}
          };
        });

      // Add actions to action list
      this.addActions(actions, {id: groupId});
    }

    async #buildSkills() {
      const skills = this.actor?.system.proficiencies.skills || CONFIG.BlackFlag.skills;

      const actions = Object.entries(skills)
        .map(([skillId, skill]) => {
          const name = game.i18n.localize(CONFIG.BlackFlag.skills[skillId].label);

          return {
            id: `skill-${skillId}`,
            name: name,
            icon1: this.#getProficiencyIcon(skill.proficiency),
            info1: (this.actor) ? {
              text: coreModule.api.Utils.getModifier(skill.mod),
              title: `${game.i18n.localize("BF.Armor.Modifier.Label")}: ${coreModule.api.Utils.getModifier(skill.mod)}`
            } : null,
            listName: this.#getListName("skill", name),
            tooltip: game.i18n.format("BF.Skill.Action.CheckSpecific", {skill: name}),
            system: {actionType: "skill", actionId: skillId}
          };
        });

      this.addActions(actions, {id: "skills"});
    }

    async #buildToolChecks() {
      const tools = this.actor?.system.proficiencies?.tools;

      if (!tools) return;

      const actions = Object.entries(tools)
        .map(([toolId, tool]) => {
          const name = game.i18n.localize(tool.label);

          return {
            id: `tool-${toolId}`,
            name: name,
            icon1: this.#getProficiencyIcon(tool.proficiency),
            info1: (this.actor) ? {
              text: coreModule.api.Utils.getModifier(tool.mod),
              title: `${game.i18n.localize("BF.Armor.Modifier.Label")}: ${coreModule.api.Utils.getModifier(tool.mod)}`
            } : null,
            listName: this.#getListName("toolCheck", name),
            tooltip: game.i18n.format("BF.Tool.Action.CheckSpecific", {tool: name}),
            system: {actionType: "toolCheck", actionId: toolId}
          };
        });

      this.addActions(actions, {id: "toolChecks"});
    }

    async #buildVehicleChecks() {
      const vehicles = this.actor?.system.proficiencies?.vehicles;

      if (!vehicles) return;

      const actions = Object.entries(vehicles)
        .map(([vehiclesId, vehicles]) => {
          const name = game.i18n.localize(vehicles.label);

          return {
            id: `vehicle-${vehiclesId}`,
            name: name,
            icon1: this.#getProficiencyIcon(vehicles.proficiency),
            info1: (this.actor) ? {
              text: coreModule.api.Utils.getModifier(vehicles.mod),
              title: `${game.i18n.localize("BF.Armor.Modifier.Label")}: ${coreModule.api.Utils.getModifier(vehicles.mod)}`
            } : null,
            listName: this.#getListName("vehicleCheck", name),
            tooltip: game.i18n.format("BF.Vehicle.Action.CheckSpecific", {vehicle: name}),
            system: {actionType: "vehicleCheck", actionId: vehiclesId}
          };
        });

      this.addActions(actions, {id: "vehicleChecks"});
    }

    //#endregion

    //#region Features
    async #buildFeatures() {
      if (this.features.size === 0) return;

      const actionTypeId = 'feature';
      const featureMap = new Map();
      const dynamicGroups = this.#buildClassFeatureGroups();

      for (const [itemKey, item] of this.features) {
        let itemId = item._id;
        let type = item.type;
        let category = item.system.type.category;

        if (type === 'feature') {
          switch (category) {
            case 'class':
              type = item.system.identifier.associated;
              break;
            case 'heritage':
              type = 'heritageFeatures';
              break;
            case 'lineage':
              type = 'lineageFeatures';
              break;
            case 'monsters':
              type = 'monstersFeatures';
              break;
            case 'vehicle':
              type = 'vehicleFeatures';
              break;
            case 'talent':
              break;
            default:
              continue;
          }
        }

        const typeMap = featureMap.get(type) ?? new Map();
        typeMap.set(itemId, item);
        featureMap.set(type, typeMap);
      }

      await this.#addDynamicGroups(dynamicGroups);

      return this.#addActionsFromMap(actionTypeId, featureMap);
    }

    #buildClassFeatureGroups() {
      const classes = this.actor?.system.progression?.classes;

      if (!classes)
        return new Map();

      return Object.entries(classes)
        .sort((lhs, rhs) => rhs[1].levels - lhs[1].levels)
        .reduce((acc, [identifier, cls]) => {
          const label = game.i18n.format('BF.Feature.Category.ClassSpecific[other]', {class: cls.document.name});

          acc.set(identifier, {
            groupData: {
              id: identifier,
              name: label,
              listName: this.#getListName('feature', label),
              type: 'system',
              settings: {customWidth: 500}
            },
            parentGroupData: tah.groups.classFeatures
          });

          return acc;
        }, new Map())
    }

    //#endregion

    //#region Effects

    async #buildEffects() {
      const actionType = "effect";

      const effects = new Map(this.actor.allApplicableEffects().map(effect => [effect.id, effect]));
      if (effects.size === 0) return;

      const passiveEffects = new Map();
      const temporaryEffects = new Map();
      const inactiveEffects = new Map();
      const statusEffectIds = new Set(CONFIG.statusEffects.map(statusEffect => statusEffect._id));

      for (const [effectId, effect] of effects.entries()) {
        if (effect.isSuppressed) continue;
        if (statusEffectIds.has(effect.id)) continue;

        if (effect.disabled) {
          inactiveEffects.set(effectId, effect);
        } else if (effect.isTemporary) {
          temporaryEffects.set(effectId, effect);
        } else {
          passiveEffects.set(effectId, effect);
        }
      }

      await Promise.all([
        this.#buildActions(passiveEffects, 'effect', 'passiveEffects'),
        this.#buildActions(temporaryEffects, 'effect', 'temporaryEffects'),
        this.#buildActions(inactiveEffects, 'effect', 'inactiveEffects'),
      ]);
    }

    async #buildConditions() {
      if (this.tokens?.length === 0) return;

      // Get conditions and exit if none exist
      const conditions = CONFIG.statusEffects.filter(condition => condition.id !== "");
      if (conditions.length === 0) return;

      // Get actions
      const actionType = "condition";
      const actions = await Promise.all(conditions.map(async condition => {
        const hasCondition = this.actors.every(actor => {
          return actor.effects.some(effect => effect.statuses.some(status => status === condition.id)
            && !effect?.disabled);
        });
        const name = game.i18n.localize(condition.label) ?? condition.name;
        return {
          id: condition.id,
          name,
          img: coreModule.api.Utils.getImage(condition),
          cssClass: `toggle${(hasCondition) ? " active" : ""}`,
          listName: this.#getListName(actionType, name),
          tooltip: this.#getConditionTooltipData(condition.id, condition.name),
          system: {actionType, actionId: condition.id}
        };
      }));

      // Add actions to HUD
      this.addActions(actions, {id: "conditions"});
    }

    //#endregion

    //#region Spells


    async #buildSpells() {
      if (this.spells.size === 0) return;

      const spellsMap = new Map();

      for (const [key, item] of this.spells) {
        if (this.#showOnlyPrepared && !item.system.prepared) continue;
        // if (!this.#isUsableItem(item) || !this.#isUsableSpell(item)) continue;
        let type = null;

        if (item.system.linkedActivity && item.system.linkedActivity.displayInSpellbook)
          type = "additionalSpells";
        else if (item.system.tags.has('ritual'))
          type = "ritualSpells"
        else switch (item.getFlag("black-flag", "relationship.mode")) {
          case "atWill":
            type = "atWillSpells"; break;
          case "innate":
            type = "innateSpells"; break;
          case "pact":
            type = "pactSpells"; break;
          default: {
            switch (item.system.circle.base) {
              case 0:
                type = "cantrips"; break;
              case 1:
                type = "circle-1"; break;
              case 2:
                type = "circle-2"; break;
              case 3:
                type = "circle-3"; break;
              case 4:
                type = "circle-4"; break;
              case 5:
                type = "circle-5"; break;
              case 6:
                type = "circle-6"; break;
              case 7:
                type = "circle-7"; break;
              case 8:
                type = "circle-8"; break;
              case 9:
                type = "circle-9"; break;
            }
          }
        }

        if (!type) continue;

        const circleMap = spellsMap.get(type) ?? new Map();
        circleMap.set(key, item);
        spellsMap.set(type, circleMap);
      }

      for (const [circle, slot] of Object.entries(this.actor.system.spellcasting.slots)) {
        const value = slot?.value ?? '∞';
        const max = slot?.max ?? '∞';

        const groupData = {
          id: circle,
          info: {info1: {class: "tah-spotlight", text:  `${value}/${max}`}}
        };

        this.addGroupInfo(groupData);
      }

      return this.#addActionsFromMap('spell', spellsMap);
    }

    //#endregion

    //#region Inventory
    /**
     * Build inventory
     * @private
     */
    async #buildInventory() {
      if (this.inventory.size === 0) return;

      const actionTypeId = 'item';
      const inventoryMap = new Map();
      const dynamicGroups = new Map();

      for (const [itemKey, item] of this.inventory) {
        let itemId = item._id;
        let type = item.type;

        switch (type) {
          case 'gear':
            type = item.system.type.category;
            if (!dynamicGroups.get(type)) {
              dynamicGroups.set(type, {
                groupData: {
                  id: type,
                  name: item.system.type.label,
                  listName: this.#getListName(type, item.system.type.label),
                  type: 'system',
                  settings: {
                    style: this.#groupGear ? 'tab' : 'list'
                  }
                },
                parentGroupData: tah.groups.gear
              });
            }
            break;
          case 'container':
            await this.#buildContainer(item, tah.groups.containers);
            continue;
          default:
            break;
        }

        const typeMap = inventoryMap.get(type) ?? new Map();
        typeMap.set(itemId, item);
        inventoryMap.set(type, typeMap);
      }

      await this.#addDynamicGroups(dynamicGroups);

      return this.#addActionsFromMap(actionTypeId, inventoryMap);
    }

    async #buildContainer(item, parent = null) {
      const parentGroup = parent ?? tah.groups.containers;

      const container = {
        groupData: {
          id: item._id,
          name: item.name,
          listName: this.#getListName('container', item.name),
          type: 'system',
          icon1: '<i class="fas fa-box-open></i>',
          settings: {
            image: coreModule.api.Utils.getImage(item),
            style: 'tab'
          },
          info1: this.#getInfo1(item),
          info2: this.#getInfo2(item),
          info3: this.#getInfo3(item),
        },
        parentGroupData: parentGroup
      };

      await this.addGroup(container.groupData, container.parentGroupData);

      return this.#buildContainerItems(container.groupData);
    }

    async #buildContainerItems(container) {
      if (this.itemsInContainers.size === 0) return;

      const actionTypeId = 'item';
      const inventoryMap = new Map();

      for (const [itemKey, item] of this.itemsInContainers) {
        if (item.system.container !== container.id) continue;
        let itemId = item._id;
        let type = item.type;

        switch (item.type) {
          case 'container':
            await this.#buildContainer(item, container);
            continue;
          default:
            break;
        }

        const typeMap = inventoryMap.get(type) ?? new Map();
        typeMap.set(itemId, item);
        inventoryMap.set(type, typeMap);
      }

      return this.#addActionsFromMap(actionTypeId, inventoryMap, container.id);
    }

    //#endregion

    //#region Utility

    async #buildUtility() {
      const combat = await this.#buildUtilityCombat();
      const char = await this.#buildUtilityCharacter();
      const token = await this.#buildUtilityToken();
      const actionType = 'utility';
      const actionData = {...combat, ...char, ...token};

      for (let group in actionData) {
        const types = actionData[group];
        const actions = Object.values(types).map(action => {
          const name = action.name;

          return foundry.utils.mergeObject({
            type: 'system',
            listName: this.#getListName(actionType, name),
            system: {actionType: "utility", actionId: action.id}
          }, action);
        })

        const groupData = {id: group, type: 'system'}
        await this.addActions(actions, groupData)
      }
    }

    async #buildUtilityCombat() {
      const combatTypes = {
        initiative: {
          id: 'initiative',
          name: game.i18n.localize('tokenActionHud.black-flag.actions.rollInitiative')
        },
        endTurn: {
          id: 'endTurn',
          name: game.i18n.localize('tokenActionHud.endTurn')
        }
      }

      if (game.combat) {
        const tokenIds = canvas.tokens.controlled.map((token) => token.id);
        const combatants = game.combat.combatants.filter((combatant) => tokenIds.includes(combatant.tokenId));

        // Get initiative for single token
        if (combatants.length === 1) {
          const currentInitiative = combatants[0].initiative;
          combatTypes.initiative.info1 = {
            class: 'tah-spotlight',
            text: currentInitiative,
          }
        }

        const active = combatants.length > 0 && (combatants.every((combatant) => combatant?.initiative)) ? ' active' : '';
        combatTypes.initiative.cssClass = `toggle${active}`;
      }

      if (!this.actor || !game.combat || game.combat?.current?.tokenId !== this.token?.id) delete combatTypes.endTurn;

      return {'combat': combatTypes};
    }


    async #buildUtilityCharacter() {
      const characterTypes = {}

      for (const [type, config] of Object.entries(CONFIG.BlackFlag.rest.types)) {
        characterTypes[type + "Rest"] = {
          id: type,
          name: game.i18n.localize(config.label),
          tooltip: game.i18n.localize(config.hint),
          system: {actionId: 'rest'}
        }
      }

      return {'character': characterTypes};
    }

    async #buildUtilityToken() {
      const tokenTypes = {}

      if (!this.tokens)
        return tokenTypes;

      if (game.modules.get('item-piles')?.active && game.user.isGM) {
        if (this.token) {
          if (this.token.document.flags && this.token.document.flags['item-piles']?.data.enabled) {
            tokenTypes.makeItemPile = {
              id: 'revertItemPile',
              name: game.i18n.localize('tokenActionHud.black-flag.actions.revertItemPile')
            };
          } else {
            tokenTypes.makeItemPile = {
              id: 'makeItemPile',
              name: game.i18n.localize('tokenActionHud.black-flag.actions.makeItemPile')
            };
          }
        } else {
          tokenTypes.toggleItemPiles = {
            id: 'toggleItemPiles',
            name: game.i18n.localize('tokenActionHud.black-flag.actions.toggleItemPiles')
          };
        }
      }

      if (game.user.isGM) {
        tokenTypes.toggleDisposition = {
          id: 'toggleDisposition',
          name: game.i18n.localize('tokenActionHud.black-flag.actions.toggleDisposition'),
        }
      }

      return {'token': tokenTypes};
    }

    //#endregion
//#endregion

    async #addDynamicGroups(dynamicGroups) {
      for (let [key, groupData] of dynamicGroups) {
        await this.addGroup(groupData.groupData, groupData.parentGroupData);
      }
    }

    #makeActionFromItem(item, actionType, {image = true} = {}) {
      const {icon1, icon2, icon3} = this.#getItemIcons(item);

      return {
        id: item._id,
        name: this.#getActionName(item.name),
        img: image ? coreModule.api.Utils.getImage(item) : null,
        icon1,
        icon2,
        icon3,
        info1: this.#getInfo1(item),
        info2: this.#getInfo2(item),
        info3: this.#getInfo3(item),
        listName: this.#getListName(actionType, item.name),
        system: {actionType, actionId: item.id},
        tooltip: this.#getTooltip(item),
      };
    }

    /**
     *
     * @param {string} actionTypeId
     * @param {Map<string,Map>} inventoryMap
     * @param {string|null} parentGroup
     */
    async #addActionsFromMap(actionTypeId, inventoryMap, parentGroup = null) {
      for (const [type, typeMap] of inventoryMap) {
        await this.#buildActions(typeMap, actionTypeId, parentGroup, type);
      }
    }

    async #buildActions(actionMap, actionTypeId, parentGroup, type = null) {
      type ??= actionTypeId;
      const groupId = parentGroup ?? tah.items[type]?.groupId ?? this.#findGroup({id: type})?.id;

      if (!groupId) return;

      const groupData = {id: groupId, type: 'system'};
      const actions = [...actionMap].map(([itemId, item]) => this.#makeActionFromItem(item, actionTypeId));
      this.addActions(actions, groupData);
    }

    #getInfo1(item) {
      const info = {
        class: '',
        text: '',
        title: ''
      };

      switch (item.type) {
        case 'feature':
          if (item.system.uses?.hasUses) {
            info.text = `${item.system.uses.value}/${item.system.uses.max}`;
            info.title = game.i18n.localize('BF.Uses.Label');
          }
          break;
        case 'spell':
          info.class = 'nowrap';
          info.text = item.system.range.label;
          info.title = game.i18n.localize("BF.WEAPON.FIELDS.range.label");
          break;
        case 'ammunition':
        case 'armor':
        case 'consumable':
        case 'gear':
        case 'sundry':
        case 'tool':
        case 'weapon':
          if (item.system.quantity === 1) break;
          info.text = `${item.system.quantity}`;
          info.title = game.i18n.localize('BF.Quantity.Label');
          break;

        default:
      }

      return info;
    }

    #getInfo2(item) {
      const info = {
        class: '',
        text: '',
        title: ''
      };

      switch (item.type) {
        case 'ammunition':
        case 'armor':
        case 'consumable':
        case 'gear':
        case 'sundry':
        case 'tool':
        case 'weapon':
          if (item.system.uses?.hasUses) {
            info.text = `${item.system.uses.value}/${item.system.uses.max}`;
            info.title = game.i18n.localize('BF.Uses.Label');

            if (item.system.uses.consumeQuantity)
              info.title += ` (${game.i18n.localize('BF.Uses.ConsumeQuantity.Label')})`;
          }
          break;
        default:
      }

      return info;
    }

    #getInfo3(item) {
      const info = {
        class: '',
        text: '',
        title: ''
      };

      switch (item.type) {
        default:
      }

      return info;
    }

    #getProficiencyIcon(proficiency) {
      return proficiency ? `
        <div class="proficiency-selector" data-multiplier="${proficiency.multiplier}"
            data-rounding="${proficiency.rounding}" aria-label="${proficiency.label}">
                <blackFlag-icon src="systems/black-flag/artwork/interface/proficiency.svg" inert></blackFlag-icon>
        </div>
` : '';
    }

    #getListName(actionType, actionName) {
      const prefix = `${game.i18n.localize(tah.actions[actionType])}: ` ?? "";
      actionName = game.i18n.localize(actionName);

      return `${prefix}${actionName}` ?? "";
    }

    #getTooltip(item) {
      debugger;
      if (this.#tooltipsSetting === "none") return "";

      if (this.#tooltipsSetting === "full" && foundry.utils.getType(item.system.richTooltip) === "function") {
        const tooltip = {};
        tooltip.content = `<section class="loading" data-uuid="${item.uuid}"><i class="fas fa-spinner fa-spin-pulse"></i></section>`;
        tooltip.class = "black-flag black-flag-tooltip item-tooltip";

        return tooltip;
      }

      switch (item.type) {
        default:
          return item.name
      }
    }

    #getActionName(name) {
      if (this.#maxCharacters > 0) {
        return name.substring(0, this.#maxCharacters) + '…';
      }

      return name;
    }

    #getItemIcons(item) {
      const iconItemEquipped = `<i class="fa-solid fa-shield-halved" data-tooltip="${game.i18n.localize('BF.Item.Equipped')}"></i>`;

      let icon1 = null;
      let icon2 = null;
      let icon3 = null;

      switch (item.type) {
        case 'spell':
          if (item.system.target.template.type) {
            const long = BlackFlag.data.fields.TargetField.templateLabel(item.system.target, {style: "long"})
            let tooltip = `${game.i18n.localize("BF.AreaOfEffect.Label")} (${long})`;
            icon1 = `<i class="fa-solid fa-ruler-combined" data-tooltip="${tooltip}"></i>`;
          } else if (item.system.target.affects.count > 1)
            icon1 = `<i class="fa-solid fa-users" data-tooltip="${game.i18n.localize("BF.TARGET.Label[one]")}"></i>`;
          else if (item.system.target.affects.count === 1)
            icon1 = `<i class="fa-solid fa-user" data-tooltip="${game.i18n.localize("BF.TARGET.Label[one]")}"></i>`;

          if (item.system.range.units === "touch")
            icon2 = `<i class="fa-solid fa-hand" data-tooltip="${game.i18n.localize("BF.WEAPON.FIELDS.range.label")}"></i>`;
          else if (item.system.range.value > 0)
            icon2 = `<i class="fa-solid fa-ruler data-tooltip=${game.i18n.localize("BF.WEAPON.FIELDS.range.label")}"></i>`;

          if (this.#showPreparedness && item.system.prepared)
            icon3 = `<i class="fa-solid fa-check" data-tooltip="${game.i18n.localize("BF.Spell.Preparation.Prepared")}"></i>`;
          else if (this.#showPreparedness)
            icon3 = `<i class="fa-solid fa-xmark" data-tooltip="${game.i18n.localize("BF.Spell.Preparation.NotPrepared")}"></i>`;
          break;
        case 'ammunition':
        case 'armor':
        case 'consumable':
        case 'feature':
        case 'gear':
        case 'sundry':
        case 'tool':
        case 'weapon':
          if (item.system.equipped)
            icon1 = iconItemEquipped;

          if (item.system.uses?.consumeQuantity)
            icon2 = `<i class="fa-solid fa-trash" data-tooltip="${game.i18n.localize('BF.Uses.ConsumeQuantity.Label')}"></i>`

          if (this.#displayActivityIcon && item.system.activities?.size > 0)
            icon3 = `<i class="fa-solid fa-crosshairs" data-tooltip="${game.i18n.localize('BF.ACTIVITY.Label[one]')}"></i>`;
          break;
      }

      return {icon1, icon2, icon3};
    }

    #getConditionTooltipData(id, name) {
      if (this.#tooltipsSetting === "none") return "";

      const condition = CONFIG.BlackFlag.conditions[id];

      if (this.#tooltipsSetting === "nameOnly" || !condition?.reference) return name;

      const tooltip = {};
      tooltip.content = `<section class="loading" data-uuid="${condition.reference}"><i class="fas fa-spinner fa-spin-pulse"></i></section>`;
      tooltip.class = "black-flag black-flag-tooltip rule-tooltip";

      return tooltip;
    }
  }
})
