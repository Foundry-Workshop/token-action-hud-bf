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
    ability: "tokenActionHud.black-flag.actions.ability",
    check: "tokenActionHud.black-flag.actions.check",
    feature: "tokenActionHud.black-flag.actions.feature",
    save: "tokenActionHud.black-flag.actions.save",
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
    checks: {id: 'checks', name: 'tokenActionHud.black-flag.checks', type: 'system'},
    saves: {id: 'saves', name: 'tokenActionHud.black-flag.saves', type: 'system'},
    skills: {id: 'skills', name: 'tokenActionHud.black-flag.skills', type: 'system'},

    vehicle: {id: 'vehicle', name: 'BF.VEHICLE.Label[other]', type: 'system'},

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
