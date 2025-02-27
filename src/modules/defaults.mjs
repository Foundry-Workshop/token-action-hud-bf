import {tah} from './constants.mjs'

/**
 * Default layout and groups
 */
export let DEFAULTS = null

Hooks.once('i18nInit', () => {
  const groups = tah.groups;

  Object.values(groups).forEach(group => {
    group.name = game.i18n.localize(group.name)
    group.listName = `Group: ${game.i18n.localize(group.listName ?? group.name)}`
  })

  const groupsArray = Object.values(groups)

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
        nestId: 'categorySpells',
        id: 'categorySpells',
        name: game.i18n.localize('BF.Item.Type.Spell[other]'),
        groups: [
          { ...groups.cantrips, nestId: "categorySpells_cantrips" },
          { ...groups["circle-1"], nestId: "categorySpells_circle-1" },
          { ...groups["circle-2"], nestId: "categorySpells_circle-2" },
          { ...groups["circle-3"], nestId: "categorySpells_circle-3" },
          { ...groups["circle-4"], nestId: "categorySpells_circle-4" },
          { ...groups["circle-5"], nestId: "categorySpells_circle-5" },
          { ...groups["circle-6"], nestId: "categorySpells_circle-6" },
          { ...groups["circle-7"], nestId: "categorySpells_circle-7" },
          { ...groups["circle-8"], nestId: "categorySpells_circle-8" },
          { ...groups["circle-9"], nestId: "categorySpells_circle-9" },
          { ...groups.pactSpells, nestId: "categorySpells_pactSpells" },
          { ...groups.ritualSpells, nestId: "categorySpells_ritualSpells" },
          { ...groups.atWillSpells, nestId: "categorySpells_atWillSpells" },
          { ...groups.innateSpells, nestId: "categorySpells_innateSpells" },
          { ...groups.additionalSpells, nestId: "categorySpells_additionalSpells" },
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
  }
});