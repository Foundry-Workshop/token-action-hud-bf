import {settings, tah} from "./constants.mjs";
import {getSetting} from "./utility/Utility.mjs";

export let ActionHandlerBlackFlag = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
  /**
   * Extends Token Action HUD Core's ActionHandler class and builds system-defined actions for the HUD
   * @extends ActionHandler
   */
  ActionHandlerBlackFlag = class ActionHandlerBlackFlag extends coreModule.api.ActionHandler {
    #maxCharacters;
    #groupGear;

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
      this.#groupGear = getSetting(settings.groupGear);

      // Set items variables
      // Declaring multiple arrays, while taking more memory for sure, should be better
      // than having to reconvert map to array to map every time I want to filter
      if (this.actor) {
        const physicalItems = this.actor.items.filter(i => i.system.isPhysical);
        const inventory = physicalItems.filter(i => !i.system.container);
        const itemsInContainers = physicalItems.filter(i => !!i.system.container);

        this.items = coreModule.api.Utils.sortItemsByName(this.actor.items);
        this.inventory = coreModule.api.Utils.sortItemsByName(inventory);
        this.itemsInContainers = coreModule.api.Utils.sortItemsByName(itemsInContainers)
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

    async #buildAbilities() {

      await this.#buildAbilitiesGroup("ability", "checks");
      await this.#buildAbilitiesGroup("save", "saves");
    }

    async #buildAbilitiesGroup(actionType, groupId) {
      const abilities = this.actor?.system.abilities || CONFIG.BlackFlag.abilities;

      const isCheck = groupId === "checks";
      const isSave = groupId === "saves";

      const actions = Object.entries(abilities)
        .filter(ability => abilities[ability[0]].value !== 0)
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
        .filter(skill => skills[skill[0]].value !== 0)
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

      // Add actions to action list
      this.addActions(actions, {id: "skills"});
    }

    /**
     * Build inventory
     * @private
     */
    async #buildInventory() {
      if (this.inventory.size === 0) return;

      const actionTypeId = 'item';
      const inventoryMap = new Map();
      const dynamicGroups = new Map();

      for (const [itemKey, itemData] of this.inventory) {
        let itemId = itemData._id;
        let type = itemData.type;

        switch (type) {
          case 'gear':
            type = itemData.system.type.category;
            if (!dynamicGroups.get(type)) {
              dynamicGroups.set(type, {
                groupData: {
                  id: type,
                  name: itemData.system.type.label,
                  listName: this.#getListName(type, itemData.system.type.label),
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
            await this.#buildContainer(itemData, tah.groups.containers);
            continue;
          default:
            break;
        }

        const typeMap = inventoryMap.get(type) ?? new Map();
        typeMap.set(itemId, itemData);
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

      for (const [itemKey, itemData] of this.itemsInContainers) {
        if (itemData.system.container !== container.id) continue;
        let itemId = itemData._id;
        let type = itemData.type;

        switch (itemData.type) {
          case 'container':
            await this.#buildContainer(itemData, container);
            continue;
          default:
            break;
        }

        const typeMap = inventoryMap.get(type) ?? new Map();
        typeMap.set(itemId, itemData);
        inventoryMap.set(type, typeMap);
      }

      return this.#addActionsFromMap(actionTypeId, inventoryMap, container.id);
    }

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
          const actionTypeName = `${coreModule.api.Utils.i18n(tah.actions[actionType])}: ` ?? '';

          action.listName = this.#getListName(actionType, name);

          return action;
        })

        const groupData = {id: group, type: 'system'}
        await this.addActions(actions, groupData)
      }
    }

    async #buildUtilityCombat() {
      const combatTypes = {
        initiative: {
          id: 'initiative',
          name: game.i18n.localize('tokenActionHud.black-flag.actions.rollInitiative'),
          onClick: async () => {
            for (const actor of this.actors) {
              await actor.rollInitiative({createCombatants: true});
            }

            return Hooks.callAll('forceUpdateTokenActionHud');
          }
        },
        endTurn: {
          id: 'endTurn',
          name: game.i18n.localize('tokenActionHud.endTurn'),
          onClick: () => {
            if (game.combat?.current?.tokenId === this.token?.id)
              return game.combat?.nextTurn();
          }
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
          onClick: async () => {
            for (const actor of this.actors) {
              actor.rest({type});
            }
          }
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
              name: game.i18n.localize('tokenActionHud.black-flag.actions.revertItemPile'),
              onClick: () => {
                if (!game.modules.get('item-piles')?.active) return;

                for (const token of this.tokens) {
                  game.itempiles?.API?.revertTokensFromItemPiles([token]);
                }
              }
            };
          } else {
            tokenTypes.makeItemPile = {
              id: 'makeItemPile',
              name: game.i18n.localize('tokenActionHud.black-flag.actions.makeItemPile'),
              onClick: () => {
                if (!game.modules.get('item-piles')?.active) return;

                for (const token of this.tokens) {
                  game.itempiles?.API?.turnTokensIntoItemPiles([token]);
                }
              }
            };
          }
        } else {
          tokenTypes.toggleItemPiles = {
            id: 'toggleItemPiles',
            name: game.i18n.localize('tokenActionHud.black-flag.actions.toggleItemPiles'),
            onClick: () => {
              if (!game.modules.get('item-piles')?.active) return;

              for (const token of this.tokens) {
                if (token.document.flags['item-piles']?.data.enabled)
                  game.itempiles?.API?.revertTokensFromItemPiles([token]);
                else
                  game.itempiles?.API?.turnTokensIntoItemPiles([token]);
              }
            }
          };
        }
      }

      if (game.user.isGM) {
        tokenTypes.toggleDisposition = {
          id: 'toggleDisposition',
          name: game.i18n.localize('tokenActionHud.black-flag.actions.toggleDisposition'),
          onClick: () => {
            const dispositions = Object.values(CONST.TOKEN_DISPOSITIONS);

            for (const token of this.tokens) {
              let disposition = token.document.disposition;
              let index = dispositions.indexOf(disposition);
              index = (index + 1) % dispositions.length
              disposition = dispositions[index];
              token.document.update({disposition});
            }
          }
        }
      }

      return {'token': tokenTypes};
    }

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
        const groupId = parentGroup ?? tah.items[type]?.groupId ?? this.#findGroup({id: type})?.id;

        if (!groupId) continue;

        const groupData = {id: groupId, type: 'system'};

        const actions = [...typeMap].map(([itemId, itemData]) => this.#makeActionFromItem(itemData, actionTypeId))

        this.addActions(actions, groupData);
      }
    }

    #getInfo1(itemData) {
      const info = {
        class: '',
        text: '',
        title: ''
      };

      switch (itemData.type) {
        default:
          return info;
      }
    }

    #getInfo2(itemData) {
      const info = {
        class: '',
        text: '',
        title: ''
      };

      switch (itemData.type) {
        default:
          return info;
      }
    }

    #getInfo3(itemData) {
      const info = {
        class: '',
        text: '',
        title: ''
      };

      switch (itemData.type) {
        default:
          return info;
      }
    }

    #getProficiencyIcon(proficiency) {
      // return proficiency?.hasProficiency ? `
      return proficiency ? `
        <div class="proficiency-selector" data-multiplier="${proficiency.multiplier}"
            data-rounding="${proficiency.rounding}" aria-label="${proficiency.label}">
                <blackFlag-icon src="systems/black-flag/artwork/interface/proficiency.svg" inert></blackFlag-icon>
        </div>
` : '';


      // const title = CONFIG.DND5E.proficiencyLevels[level] ?? "";
      // const icon = PROFICIENCY_LEVEL_ICON[level];
      // return (icon) ? `<i class="${icon}" title="${title}"></i>` : "";
    }

    #getListName(actionType, actionName) {
      const prefix = `${game.i18n.localize(tah.actions[actionType])}: ` ?? "";
      actionName = game.i18n.localize(actionName);

      return `${prefix}${actionName}` ?? "";
    }

    #getTooltip(itemData) {
      switch (itemData.type) {
        default:
          return itemData.name
      }
    }

    #getActionName(name) {
      if (this.#maxCharacters > 0) {
        return name.substring(0, this.#maxCharacters) + '…';
      }

      return name;
    }

    #getItemIcons(item) {
      const iconWeaponEquipped = '<i class="fas fa-hand"></i>';
      const iconWeaponLoaded = '<i class="far fa-circle-dot"></i>';
      const iconWeaponNotLoaded = '<i class="far fa-circle-xmark"></i>';
      let icon1 = null;
      let icon2 = null;
      let icon3 = null;

      switch (item.type) {
        default:
      }

      return {icon1, icon2, icon3};
    }
  }
})