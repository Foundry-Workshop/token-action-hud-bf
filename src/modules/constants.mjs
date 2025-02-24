const constants = {
  modulePath: 'modules/token-action-hud-bf',
  moduleId: 'token-action-hud-bf',
  moduleLabel: `Token Action HUD Black Flag`,
  requiredCoreModuleVersion: '2.0'
};

const defaults = {}

const flags = {}

const settings = {
  displayUnequipped: 'displayUnequipped',
  groupLores: 'groupLores',
  groupGear: 'groupGear',
  maxCharacters: 'maxCharacters',
  shiftRollMode: 'shiftRollMode',
  bypassDefault: 'bypassDefault',
  advantageDesc: 'showAdvantageDescription'
}

const tah = {
  /**
   * Action types
   */
  actions: {
    ability: "tokenActionHud.black-flag.ability",
    check: "tokenActionHud.black-flag.check",
    counter: "tokenActionHud.black-flag.counter",
    effect: "tokenActionHud.black-flag.effect",
    exhaustion: "tokenActionHud.black-flag.exhaustion",
    feature: "tokenActionHud.black-flag.feat",
    save: "tokenActionHud.black-flag.save",
    skill: "tokenActionHud.black-flag.skill",
    spell: "tokenActionHud.black-flag.spell",
    item: 'tokenActionHud.black-flag.item',
    utility: 'tokenActionHud.utility',
  },

  /**
   * Groups
   */
  groups: {
    abilities: {id: 'abilities', name: 'tokenActionHud.black-flag.abilities', type: 'system'},
    skill: {id: 'skill', name: 'tokenActionHud.black-flag.skill', type: 'system'},
    vehicle: {id: 'vehicle', name: 'tokenActionHud.black-flag.vehicle', type: 'system'},

    actions: {id: 'actions', name: 'tokenActionHud.black-flag.actions', type: 'system'},

    inventory: {id: 'inventory', name: 'tokenActionHud.black-flag.inventory', type: 'system'},
    containers: {id: 'containers', name: 'tokenActionHud.black-flag.containers', type: 'system'},
    ammunition: {id: 'ammunition', name: 'tokenActionHud.black-flag.ammunition', type: 'system'},
    armor: {id: 'armor', name: 'tokenActionHud.black-flag.armor', type: 'system'},
    consumables: {id: 'consumables', name: 'tokenActionHud.black-flag.consumables', type: 'system'},
    gear: {id: 'gear', name: 'tokenActionHud.black-flag.gear', type: 'system'},
    sundries: {id: 'sundries', name: 'tokenActionHud.black-flag.sundries', type: 'system'},
    tools: {id: 'tools', name: 'tokenActionHud.black-flag.tools', type: 'system'},
    weapons: {id: 'weapons', name: 'tokenActionHud.wfrp4e.weapons', type: 'system'},

    utility: {id: 'utility', name: 'tokenActionHud.utility', type: 'system'},
    combat: {id: 'combat', name: 'tokenActionHud.black-flag.combat', type: 'system'},
    token: {id: 'token', name: 'tokenActionHud.token', type: 'system'},
    character: {id: 'character', name: 'tokenActionHud.black-flag.character', type: 'system'},
  },

  /**
   * Item types
   */
  items: {
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
