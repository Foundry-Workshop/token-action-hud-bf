const constants = {
  modulePath: 'modules/token-action-hud-bf',
  moduleId: 'token-action-hud-bf',
  moduleLabel: `Token Action HUD Black Flag`,
  requiredCoreModuleVersion: '2.0'
};

const settings = {
  displayUnequipped: 'displayUnequipped',
  groupLores: 'groupLores',
  groupGear: 'groupGear',
  maxCharacters: 'maxCharacters',
  shiftRollMode: 'shiftRollMode',
  bypassDefault: 'bypassDefault',
  advantageDesc: 'showAdvantageDescription'
};

const tah = {
  /**
   * Action types
   */
  actions: {
    ability: "tokenActionHud.black-flag.actions.ability",
    check: "tokenActionHud.black-flag.actions.check",
    save: "tokenActionHud.black-flag.actions.save",
    toolCheck: "BF.Tool.Action.CheckGeneric",
    feature: "tokenActionHud.black-flag.actions.feature",
    skill: "tokenActionHud.black-flag.actions.skill",
    spell: "tokenActionHud.black-flag.actions.spell",
    item: 'tokenActionHud.black-flag.actions.item',
    container: 'tokenActionHud.black-flag.actions.container',
    utility: 'tokenActionHud.utility'
  },

  /**
   * Groups
   */
  groups: {
    checks: {id: 'checks', name: 'tokenActionHud.black-flag.checks', type: 'system', settings: {customWidth: 430}},
    saves: {id: 'saves', name: 'tokenActionHud.black-flag.saves', type: 'system', settings: {customWidth: 410}},
    skills: {id: 'skills', name: 'tokenActionHud.black-flag.skills', type: 'system', settings: {customWidth: 700}},
    toolChecks: {id: 'toolChecks', name: 'tokenActionHud.black-flag.toolChecks', type: 'system', settings: {customWidth: 700}},
    vehicleChecks: {id: 'vehicleChecks', name: 'tokenActionHud.black-flag.vehicleChecks', type: 'system', settings: {customWidth: 700}},

    classFeatures: {id: 'classFeatures', name: 'BF.Feature.Category.Class[other]', type: 'system'},
    talents: {id: 'talents', name: 'BF.Item.Type.Talent[other]', type: 'system'},
    lineageFeatures: {id: 'lineageFeatures', name: 'BF.Feature.Category.Lineage[other]', type: 'system'},
    heritageFeatures: {id: 'heritageFeatures', name: 'BF.Feature.Category.Heritage[other]', type: 'system'},
    monstersFeatures: {id: 'monstersFeatures', name: 'BF.Feature.Category.Monster[other]', type: 'system'},
    vehicleFeatures: {id: 'vehicleFeatures', name: 'BF.Feature.Category.Vehicle[other]', type: 'system'},
    features: {id: 'features', name: 'BF.Item.Type.Feature[other]', type: 'system'},

    temporaryEffects: {id: 'temporaryEffects', name: 'tokenActionHud.black-flag.temporaryEffects', type: 'system'},
    passiveEffects: {id: 'passiveEffects', name: 'tokenActionHud.black-flag.passiveEffects', type: 'system'},
    inactiveEffects: {id: 'inactiveEffects', name: 'tokenActionHud.black-flag.inactiveEffects', type: 'system'},
    conditions: {id: 'conditions', name: 'BF.Condition.Label[other]', type: 'system'},


    actions: {id: 'actions', name: 'BF.ACTIVATION.Type.Action[other]', type: 'system'},

    inventory: {id: 'inventory', name: 'BF.Sheet.Tab.Inventory', type: 'system'},
    containers: {id: 'containers', name: 'BF.Item.Type.Container[other]', type: 'system'},
    ammunition: {id: 'ammunition', name: 'BF.Item.Type.Ammunition[other]', type: 'system'},
    armor: {id: 'armor', name: 'BF.Item.Type.Armor[other]', type: 'system'},
    consumables: {id: 'consumables', name: 'BF.Item.Type.Consumable[other]', type: 'system'},
    gear: {id: 'gear', name: 'BF.Item.Type.Gear[other]', type: 'system'},
    sundries: {id: 'sundries', name: 'BF.Item.Type.Sundry[other]', type: 'system'},
    tools: {id: 'tools', name: 'BF.Item.Type.Tool[other]', type: 'system'},
    weapons: {id: 'weapons', name: 'BF.Item.Type.Weapon[other]', type: 'system'},

    utility: {id: 'utility', name: 'tokenActionHud.utility', type: 'system'},
    combat: {id: 'combat', name: 'tokenActionHud.black-flag.combat', type: 'system'},
    token: {id: 'token', name: 'tokenActionHud.token', type: 'system'},
    character: {id: 'character', name: 'tokenActionHud.black-flag.character', type: 'system'},
  },

  /**
   * Item types
   */
  items: {
    feature: {groupId: 'features'},
    talent: {groupId: 'talents'},
    ammunition: {groupId: 'ammunition'},
    armor: {groupId: 'armor'},
    container: {groupId: 'containers'},
    consumable: {groupId: 'consumables'},
    gear: {groupId: 'gear'},
    sundry: {groupId: 'sundries'},
    tool: {groupId: 'tools'},
    weapon: {groupId: 'weapons'},
  }
};

class Debug {
  static #debugSetting = 'debug';

  static get setting() {
    return Debug.#debugSetting;
  }

  /**
   * Prints current module's settings to console for reference
   */
  static logSettings() {
    Debug.debug('Current game settings:', Debug.summarizeSettings);
  }

  /**
   * Prints out the debug message along with additional data (if provided)
   *
   * @param {String} msg   Debug message
   * @param {any} data     Additional data to output next to the message
   */
  static debug(msg, data = '') {
    if (Debug.enabled)
      Utility.notify(msg, {type: 'debug', consoleOnly: true, data: data});
  }

  /**
   * Registers the setting with the Foundry to allow users to enable Debug mode
   */
  static registerSetting() {
    game.settings.register(constants.moduleId, Debug.setting, {
      name: 'tokenActionHud.black-flag.settings.debug.Enable',
      hint: 'tokenActionHud.black-flag.settings.debug.EnableHint',
      scope: 'client',
      config: true,
      default: false,
      type: Boolean
    });
  }

  /**
   * Returns value of the "Debug mode enable" setting
   *
   * @return {boolean}
   */
  static get enabled() {
    return game.settings.get(constants.moduleId, Debug.#debugSetting);
  }

  /**
   * Returns object of a quick settings summary
   *
   * @return {{}}
   */
  static get summarizeSettings() {
    const moduleSettings = {};
    for (let [_key, setting] of game.settings.settings.entries()) {
      if (setting.namespace !== constants.moduleId) continue;

      const name = setting.name ? game.i18n.localize(setting.name) : setting.key;
      moduleSettings[name] = game.settings.get(constants.moduleId, setting.key);
    }

    return moduleSettings;
  }
}

/**
 * Facade for the Debug.debug() function
 *
 * @param {String} msg   Debug message
 * @param {any} data     Additional data to output next to the message
 */
function debug(msg, data = '') {
  Debug.debug(msg, data);
}

class Utility {

  /**
   * Provides a single point of entry to handle all Module's notifications in a consistent manner
   *
   * @param {string} notification                       Text of the notification
   * @param {'error'|'warning'|'info'|'debug'} type     type of the notification
   * @param {boolean} permanent                         should the notification stay until closed?
   * @param {boolean} consoleOnly                       should the notification be suppressed and only shown in console?
   * @param {*} data                                    additional data to output in the console
   * @param {boolean} trace                             whether to use `console.trace()` instead of `console.log()`
   *
   * @return {false}
   */
  static notify(notification, {type = 'info', permanent = false, consoleOnly = false, data = '', trace = false} = {}) {
    // brand colour: '#3e1395' is too dark for dark mode console;
    const purple = 'purple';
    let colour;

    switch (type) {
      case 'error':
        colour = '#aa2222';
        trace = true;
        break;
      case 'warning':
        colour = '#aaaa22';
        trace = true;
        break;
      case 'debug':
        colour = '#5555ff';
        break;
      case 'info':
      default:
        colour = '#22aa22';
    }

    if (trace)
      console.trace(`🦊 %c${constants.moduleLabel}: %c${notification}`, `color: ${purple}`, `color: ${colour}`, data);
    else
      console.log(`🦊 %c${constants.moduleLabel}: %c${notification}`, `color: ${purple}`, `color: ${colour}`, data);

    if (!consoleOnly)
      ui?.notifications?.notify(notification, type, {permanent: permanent, console: false});

    return false;
  }

  /**
   * Provides a single point of entry to handle all Module's errors in a consistent manner
   *
   * @param {string} notification         Text of the notification
   * @param {Error} error                 original error object
   * @param {boolean} permanent           should the notification stay until closed?
   * @param {*} data                      additional data to output in the console
   *
   * @return {false}
   */
  static error(notification, {permanent = false, data = {}, error = null} = {}) {
    Utility.notify(notification, {type: 'error', consoleOnly: false, permanent, data});

    if (error)
      console.error(error);

    return false;
  }

  /**
   * Returns full module path for the template based on relative path/name only
   *
   * @param {string} template relative path / template's name
   *
   * @return {string}
   */
  static getTemplate(template) {
    if (typeof template !== 'string')
      return undefined;

    return `modules/${constants.moduleId}/templates/${template}`;
  }

  /**
   * Preloads provided templates
   *
   * @param {{}} templates
   */
  static preloadTemplates(templates = {}) {
    debug("Preloading Templates.", {templates});
    templates = foundry.utils.flattenObject(templates);

    for (let [key, template] of Object.entries(templates)) {
      templates[key] = Utility.getTemplate(template);
      if (templates[key] === undefined) delete templates[key];
    }

    loadTemplates(templates).then((result) => {
      debug("Templates preloaded.", {templates, result});
    });
  }

  /**
   * Returns module's setting
   *
   * @param {string} setting name of the setting to retrieve
   *
   * @return {*}
   */
  static getSetting(setting) {
    return game.settings.get(constants.moduleId, setting);
  }

  /**
   * Saves a module's setting
   *
   * @param {string} setting name of the setting to retrieve
   * @param {*}      value   value to save
   *
   * @return {*}
   */
  static async setSetting(setting, value) {
    return await game.settings.set(constants.moduleId, setting, value);
  }

  static getHook(hook) {
    return `${constants.moduleId}.${hook}`;
  }

  static isGmActive() {
    return game.users.some(user => user.isGM && user.active);
  }

  static slugify(string) {
    return String(string)
      .normalize('NFKD') // split accented characters into their base characters and diacritical marks
      .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      .trim() // trim leading or trailing whitespace
      .toLowerCase() // convert to lowercase
      .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-'); // remove consecutive hyphens
  }
}
const getSetting = Utility.getSetting;

/**
 * Default layout and groups
 */
let DEFAULTS = null;

Hooks.once('i18nInit', () => {
  const groups = tah.groups;

  Object.values(groups).forEach(group => {
    group.name = game.i18n.localize(group.name);
    group.listName = `Group: ${game.i18n.localize(group.listName ?? group.name)}`;
  });

  const groupsArray = Object.values(groups);

  DEFAULTS = {
    layout: [
      {
        nestId: 'categoryChecksSaves',
        id: 'categoryChecksSaves',
        name: game.i18n.localize('tokenActionHud.black-flag.checks-saves'),
        groups: [
          {...groups.checks, nestId: 'categoryChecksSaves_abilityChecks'},
          {...groups.saves, nestId: 'categoryChecksSaves_abilitySaves'},
          {...groups.skills, nestId: 'categoryChecksSaves_skills'},
          {...groups.toolChecks, nestId: 'categoryChecksSaves_toolChecks'},
          {...groups.vehicleChecks, nestId: 'categoryChecksSaves_vehicleChecks'},
        ]
      },
      {
        nestId: 'categoryFeatures',
        id: 'categoryFeatures',
        name: game.i18n.localize('BF.Sheet.Tab.Features'),
        groups: [
          { ...groups.classFeatures, nestId: "categoryFeatures_classFeatures" },
          { ...groups.talents, nestId: "categoryFeatures_talents" },
          { ...groups.lineageFeatures, nestId: "categoryFeatures_lineageFeatures" },
          { ...groups.heritageFeatures, nestId: "categoryFeatures_heritageFeatures" },
          { ...groups.monstersFeatures, nestId: "categoryFeatures_monstersFeatures" },
          { ...groups.vehicleFeatures, nestId: "categoryFeatures_vehicleFeatures" },
          { ...groups.features, nestId: "categoryFeatures_features" },
        ]
      },
      {
        nestId: 'categoryEffects',
        id: 'categoryEffects',
        name: game.i18n.localize('BF.Sheet.Tab.Effects'),
        groups: [
          { ...groups.temporaryEffects, nestId: "categoryEffects_temporaryEffects" },
          { ...groups.passiveEffects, nestId: "categoryEffects_passiveEffects" },
          { ...groups.inactiveEffects, nestId: "categoryEffects_inactiveEffects" },
          { ...groups.conditions, nestId: "categoryEffects_conditions" },
        ]
      },
      {
        nestId: 'categoryInventory',
        id: 'categoryInventory',
        name: game.i18n.localize('BF.Sheet.Tab.Inventory'),
        groups: [
          {...groups.weapons, nestId: 'categoryInventory_weapons'},
          {...groups.ammunition, nestId: 'categoryInventory_ammunition'},
          {...groups.armor, nestId: 'categoryInventory_armor'},
          {...groups.gear, nestId: 'categoryInventory_gear'},
          {...groups.tools, nestId: 'categoryInventory_tools'},
          {...groups.consumables, nestId: 'categoryInventory_consumables'},
          {...groups.sundries, nestId: 'categoryInventory_sundries'},
          {...groups.containers, nestId: 'categoryInventory_containers'},
        ]
      },
      {
        nestId: 'categoryUtility',
        id: 'categoryUtility',
        name: game.i18n.localize('tokenActionHud.utility'),
        groups: [
          {...groups.combat, nestId: 'categoryUtility_combat'},
          {...groups.token, nestId: 'categoryUtility_token'},
          {...groups.character, nestId: 'categoryUtility_character'},
          {...groups.utility, nestId: 'categoryUtility_utility'}
        ]
      }
    ],
    groups: groupsArray
  };
});

let ActionHandlerBlackFlag = null;

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
        const features = this.actor.items.filter(i => i.type === 'feature' || i.type === 'talent');

        this.items = coreModule.api.Utils.sortItemsByName(this.actor.items);
        this.inventory = coreModule.api.Utils.sortItemsByName(inventory);
        this.itemsInContainers = coreModule.api.Utils.sortItemsByName(itemsInContainers);
        this.features = coreModule.api.Utils.sortItemsByName(features);
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

    async #buildAbilities() {

      await this.#buildAbilitiesGroup("ability", "checks");
      await this.#buildAbilitiesGroup("save", "saves");
    }

    //#region Checks & Saves
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
          const proficiency = isSave ? ability?.save?.proficiency : ability?.check?.proficiency;

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
        this.#buildActions(passiveEffects, 'effect','passiveEffects'),
        this.#buildActions(temporaryEffects, 'effect','temporaryEffects'),
        this.#buildActions(inactiveEffects, 'effect','inactiveEffects'),
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
        });

        const groupData = {id: group, type: 'system'};
        await this.addActions(actions, groupData);
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
      };

      if (game.combat) {
        const tokenIds = canvas.tokens.controlled.map((token) => token.id);
        const combatants = game.combat.combatants.filter((combatant) => tokenIds.includes(combatant.tokenId));

        // Get initiative for single token
        if (combatants.length === 1) {
          const currentInitiative = combatants[0].initiative;
          combatTypes.initiative.info1 = {
            class: 'tah-spotlight',
            text: currentInitiative,
          };
        }

        const active = combatants.length > 0 && (combatants.every((combatant) => combatant?.initiative)) ? ' active' : '';
        combatTypes.initiative.cssClass = `toggle${active}`;
      }

      if (!this.actor || !game.combat || game.combat?.current?.tokenId !== this.token?.id) delete combatTypes.endTurn;

      return {'combat': combatTypes};
    }


    async #buildUtilityCharacter() {
      const characterTypes = {};

      for (const [type, config] of Object.entries(CONFIG.BlackFlag.rest.types)) {
        characterTypes[type + "Rest"] = {
          id: type,
          name: game.i18n.localize(config.label),
          tooltip: game.i18n.localize(config.hint),
          system: {actionId: 'rest'}
        };
      }

      return {'character': characterTypes};
    }

    async #buildUtilityToken() {
      const tokenTypes = {};

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
        };
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
              }

      return info;
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

    #getTooltip(item) {
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
      let icon1 = null;
      let icon2 = null;
      let icon3 = null;

      switch (item.type) {
        case 'ammunition':
        case 'armor':
        case 'consumable':
        case 'feature':
        case 'gear':
        case 'spell':
        case 'sundry':
        case 'tool':
        case 'weapon':
          if (item.system.activities?.size > 0)
            icon1 = `<i class="fa-solid fa-crosshairs" data-tooltip="${game.i18n.localize('BF.ACTIVITY.Label[one]')}"></i>`;

          if (item.system.uses?.consumeQuantity)
            icon2 = `<i class="fa-solid fa-trash" data-tooltip="${game.i18n.localize('BF.Uses.ConsumeQuantity.Label')}"></i>`;
          break;
      }

      return {icon1, icon2, icon3};
    }

    #getConditionTooltipData(id, name) {
      if (this.tooltipsSetting === "none") return "";

      const condition = CONFIG.BlackFlag.conditions[id];

      if (this.tooltipsSetting === "nameOnly" || !condition?.reference) return name;

      const tooltip = {};
      tooltip.content = `<section class="loading" data-uuid="${condition.reference}"><i class="fas fa-spinner fa-spin-pulse"></i></section>`;
      tooltip.class = "black-flag black-flag-tooltip rule-tooltip";

      return tooltip;
    }
  };
});

let RollHandlerBlackFlag = null;

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
  /**
   * Extends Token Action HUD Core's RollHandler class and handles action events triggered when an action is clicked
   * @extends RollHandler
   */
  RollHandlerBlackFlag = class RollHandlerBlackFlag extends coreModule.api.RollHandler {
    /**
     * Handle action event
     * Called by Token Action HUD Core when an action event is triggered
     * @override
     * @param {object} event       The event
     * @param {string} buttonValue The button value
     */
    async handleActionClick(event, buttonValue) {
      const {actionType, actionId} = this.action.system;
      const args = {event, actionType, actionId, action: this.action, actor: this.actor, token: this.token};

      debug("[RollHandlerBlackFlag] handleActionClick", {
        event,
        buttonValue,
        actionType,
        actionId,
        action: this.action
      });

      if (!this.actor) {
        for (const token of coreModule.api.Utils.getControlledTokens()) {
          const actor = token.actor;
          args.token = token;
          args.actor = actor;
          args.multiple = true;
          await this.#handleAction(args);
        }
      } else {
        await this.#handleAction(args);
      }

      Hooks.callAll('forceUpdateTokenActionHud');
    }

    /**
     * Handle action
     * @private
     * @param {
     *   {
     *     event:      Event,
     *     actionType: string,
     *     actor:      BlackFlagActor,
     *     token:      TokenDocument,
     *     actionId:   string,
     *     action:     Object|*
     *     multiple:   boolean
     *   }
     * } args
     */
    async #handleAction(args) {
      const {event, actionType, actor, token, actionId, multiple = false} = args;
      const dialog = this.#getDialogOptions({multiple});

      switch (actionType) {
        case "ability":
          await actor.rollAbilityCheck({ability: actionId}, dialog);
          break;
        case "save":
          await actor.rollAbilitySave({ability: actionId}, dialog);
          break;
        case "skill":
          await actor.rollSkill(
            {skill: actionId, ability: CONFIG.BlackFlag.skills[actionId].ability}, dialog);
          break;
        case "toolCheck":
          await actor.rollTool(
            {tool: actionId}, dialog);
          break;
        case "vehicleCheck":
          await actor.rollVehicle(
            {vehicle: actionId}, dialog);
          break;
        case "effect":
          await this.#toggleEffect(actor, actionId);
          break;
        case "condition":
          if (!token) return;
          await this.#toggleCondition(actor, token, actionId);
          break;
        case "feature":
        case "item":
          if (this.isRenderItem()) this.renderItem(actor, actionId);
          else this.#useItem(args);
          break;
        case "utility":
          await this.#useUtilityAction(args);
          break;
      }
    }

    async #useUtilityAction({event, actor, token, actionId, dialog}) {
      switch (actionId) {
        case 'initiative':
          await actor.configureInitiativeRoll({}, dialog);
          break;
        case 'endTurn':
          if (game.combat?.current?.tokenId === token?.id)
            return game.combat?.nextTurn();
          break;
        case 'rest':
          await actor.rest({type: action.id});
          break;
        case 'toggleItemPiles':
        case 'makeItemPile':
        case 'revertItemPile':
          this.#handleItemPiles(token, actionId);
          break;
        case 'toggleDisposition':
          this.#toggleDisposition(token);
          break;
      }
    }

    #toggleDisposition(token) {
      const dispositions = Object.values(CONST.TOKEN_DISPOSITIONS);

      let disposition = token.document.disposition;
      let index = dispositions.indexOf(disposition);
      index = (index + 1) % dispositions.length;
      disposition = dispositions[index];
      token.document.update({disposition});
    }

    #handleItemPiles(token, actionId) {
      if (!game.modules.get('item-piles')?.active) return;
      let revert = null;

      if (actionId === 'toggleItemPiles')
        revert = token.document.flags['item-piles']?.data.enabled;
      if (actionId === 'makeItemPile')
        revert = false;
      if (actionId === 'revertItemPile')
        revert = true;

      if (revert === true)
        game.itempiles?.API?.revertTokensFromItemPiles([token]);
      else if (revert === false)
        game.itempiles?.API?.turnTokensIntoItemPiles([token]);
    }

    async #toggleEffect(actor, actionId) {
      const effect = actor.allApplicableEffects().find(effect => effect.id === actionId);
      if (!effect) return;

      if (this.isRightClick && !effect.transfer) {
        await effect.delete();
      } else {
        await effect.update({disabled: !effect.disabled});
      }

      Hooks.callAll("forceUpdateTokenActionHud");
    }

    async #toggleCondition(actor, token, actionId) {
      if (!token) return;

      const statusEffect = CONFIG.statusEffects.find(statusEffect => statusEffect.id === actionId);
      const isConvenient = statusEffect?.flags?.["dfreds-convenient-effects"]?.isConvenient
        ?? actionId.startsWith("Convenient Effect");

      if (game.dfreds && isConvenient) {
        const effectName = statusEffect.name ?? statusEffect.label;
        await game.dfreds.effectInterface.toggleEffect(effectName, {overlay: !!this.isRightClick});
      } else {
        const condition = CONFIG.statusEffects.find(effect => effect.id === actionId);
        if (!condition) return;

        const effect = actor.effects.find(effect => effect.statuses.every(status => status === actionId));

        if (effect?.disabled)
          await effect.delete();

        await actor.toggleStatusEffect(condition.id, {overlay: !!this.isRightClick});
      }

      Hooks.callAll("forceUpdateTokenActionHud");
    }

    /**
     * Use Item
     * @private
     * @param {object} actor    The actor
     * @param {string} actionId The action id
     */
    #useItem({actor, actionId}) {
      /**
       * @var {BlackFlagItem}
       */
      const item = coreModule.api.Utils.getItem(actor, actionId);

      item.activate();
    }

    /**
     * Post Item to Chat
     * @private
     * @param {object} actor    The actor
     * @param {string} actionId The action id
     */
    #postItemToChat({actor, actionId}) {
      /**
       * @var {BlackFlagItem}
       */
      const item = coreModule.api.Utils.getItem(actor, actionId);

      item.postToChat();
    }

    #getDialogOptions({multiple = false}) {
      return {
        configure: !multiple
      }
    }
  };
});

/**
 *
 * @param coreUpdate
 */
function registerSettingsCoreUpdate(coreUpdate) {
  game.settings.register(constants.moduleId, settings.groupGear, {
    name: game.i18n.localize('tokenActionHud.black-flag.settings.groupGear.name'),
    hint: game.i18n.localize('tokenActionHud.black-flag.settings.groupGear.hint'),
    scope: 'client',
    config: true,
    type: Boolean,
    default: false,
    onChange: (value) => {
      coreUpdate(value);
    }
  });
  game.settings.register(constants.moduleId, settings.maxCharacters, {
    name: game.i18n.localize('tokenActionHud.black-flag.settings.maxCharacters.name'),
    hint: game.i18n.localize('tokenActionHud.black-flag.settings.maxCharacters.hint'),
    scope: 'client',
    config: true,
    type: Number,
    default: 0,
    onChange: (value) => {
      coreUpdate(value);
    }
  });

  Debug.registerSetting();
}

let SystemManagerBlackFlag = null;

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {

  /**
   * Extends Token Action HUD Core's SystemManager class
   * @extends SystemManager
   */
  SystemManagerBlackFlag = class SystemManagerBlackFlag extends coreModule.api.SystemManager {
    /**
     * Returns an instance of the ActionHandler to Token Action HUD Core
     * Called by Token Action HUD Core
     * @override
     * @returns {ActionHandler} The ActionHandler instance
     */
    getActionHandler () {
      return new ActionHandlerBlackFlag();
    }

    /**
     * Returns a list of roll handlers to Token Action HUD Core
     * Used to populate the Roll Handler module setting choices
     * Called by Token Action HUD Core
     * @override
     * @returns {object} The available roll handlers
     */
    getAvailableRollHandlers () {
      const coreTitle = 'black-flag';

      return {core: coreTitle};
    }

    /**
     * Returns an instance of the RollHandler to Token Action HUD Core
     * Called by Token Action HUD Core
     * @override
     * @param {string} rollHandlerId The roll handler ID
     * @returns {rollHandler}        The RollHandler instance
     */
    getRollHandler (rollHandlerId) {
      let rollHandler;

      switch (rollHandlerId) {
        case 'black-flag':
        default:
          rollHandler = new RollHandlerBlackFlag();
          break;
      }

      return rollHandler;
    }

    /**
     * Register Token Action HUD system module settings
     * Called by Token Action HUD Core
     * @override
     * @param {function} coreUpdate The Token Action HUD Core update function
     */
    registerSettings (coreUpdate) {
      registerSettingsCoreUpdate(coreUpdate);
    }

    /**
     * Returns the default layout and groups to Token Action HUD Core
     * Called by Token Action HUD Core
     * @returns {object} The default layout and groups
     */
    async registerDefaults () {
      return DEFAULTS;
    }

    /**
     * @todo should be async, but async leads to errors
     *
     * @returns {{darkRed: {file: string, name: string, primaryColor: string, moduleId: string, class: string, tertiaryColor: string, secondaryColor: string}, brown: {file: string, name: string, primaryColor: string, moduleId: string, class: string, tertiaryColor: string, secondaryColor: string}}}
     */
    registerStyles() {
      return {
      }
    }
  };
});

Hooks.once('init', () => {
  Hooks.callAll(`${constants.moduleId}:afterInit`);
});

Hooks.once('setup', () => {
  Hooks.callAll(`${constants.moduleId}:afterSetup`);
});

Hooks.once('ready', () => {
  Hooks.callAll(`${constants.moduleId}:afterReady`);
  Utility.notify(`${constants.moduleLabel} ready`, {consoleOnly: true});
});

Hooks.on('tokenActionHudCoreApiReady', async () => {
  /**
   * Return the SystemManager and requiredCoreModuleVersion to Token Action HUD Core
   */
  const module = game.modules.get(constants.moduleId);
  module.api = {
    requiredCoreModuleVersion: constants.requiredCoreModuleVersion,
    SystemManager: SystemManagerBlackFlag
  };
  Hooks.call('tokenActionHudSystemReady', module);
  Utility.notify(`${constants.moduleLabel} connected to TAH Core`, {consoleOnly: true});
});
