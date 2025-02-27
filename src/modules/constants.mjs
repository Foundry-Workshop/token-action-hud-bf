const constants = {
  modulePath: 'modules/token-action-hud-bf',
  moduleId: 'token-action-hud-bf',
  moduleLabel: `Token Action HUD Black Flag`,
  requiredCoreModuleVersion: '2.0'
};

const defaults = {
  displayUnequipped: true,
  groupGear: false,
  maxCharacters: 0,
  displayActivityIcon: true,
  showOnlyPrepared: true,
  showPreparedness: false,
}

const flags = {}

const settings = {
  displayUnequipped: 'displayUnequipped',
  groupGear: 'groupGear',
  maxCharacters: 'maxCharacters',
  displayActivityIcon: 'displayActivityIcon',
  showOnlyPrepared: 'showOnlyPrepared',
  showPreparedness: 'showPreparedness',
}

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

    cantrips: {id: "cantrips", name: "tokenActionHud.black-flag.cantrips", type: "system"},
    "circle-1": {id: "circle-1", name: "tokenActionHud.black-flag.circle-1", type: "system"},
    "circle-2": {id: "circle-2", name: "tokenActionHud.black-flag.circle-2", type: "system"},
    "circle-3": {id: "circle-3", name: "tokenActionHud.black-flag.circle-3", type: "system"},
    "circle-4": {id: "circle-4", name: "tokenActionHud.black-flag.circle-4", type: "system"},
    "circle-5": {id: "circle-5", name: "tokenActionHud.black-flag.circle-5", type: "system"},
    "circle-6": {id: "circle-6", name: "tokenActionHud.black-flag.circle-6", type: "system"},
    "circle-7": {id: "circle-7", name: "tokenActionHud.black-flag.circle-7", type: "system"},
    "circle-8": {id: "circle-8", name: "tokenActionHud.black-flag.circle-8", type: "system"},
    "circle-9": {id: "circle-9", name: "tokenActionHud.black-flag.circle-9", type: "system"},
    pactSpells: {id: "pactSpells", name: "tokenActionHud.black-flag.pactSpells", type: "system"},
    ritualSpells: {id: "ritualSpells", name: "tokenActionHud.black-flag.ritualSpells", type: "system"},
    atWillSpells: {id: "atWillSpells", name: "tokenActionHud.black-flag.atWillSpells", type: "system"},
    innateSpells: {id: "innateSpells", name: "tokenActionHud.black-flag.innateSpells", type: "system"},
    additionalSpells: {id: "additionalSpells", name: "BF.Spellcasting.Learning.Mode.Spellbook.Label", type: "system"},

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
}


export {constants, defaults, flags, settings, tah};
