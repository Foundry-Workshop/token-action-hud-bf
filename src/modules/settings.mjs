import {constants, defaults, settings} from './constants.mjs';
import {Debug} from "./utility/Debug.mjs";

/**
 *
 * @param coreUpdate
 */
export function registerSettingsCoreUpdate(coreUpdate) {
  game.settings.register(constants.moduleId, settings.displayUnequipped, {
    name: game.i18n.localize('tokenActionHud.black-flag.settings.displayUnequipped.name'),
    hint: game.i18n.localize('tokenActionHud.black-flag.settings.displayUnequipped.hint'),
    scope: 'client',
    config: true,
    type: Boolean,
    default: defaults.displayUnequipped,
    onChange: (value) => {
      coreUpdate(value)
    }
  })
  game.settings.register(constants.moduleId, settings.groupGear, {
    name: game.i18n.localize('tokenActionHud.black-flag.settings.groupGear.name'),
    hint: game.i18n.localize('tokenActionHud.black-flag.settings.groupGear.hint'),
    scope: 'client',
    config: true,
    type: Boolean,
    default: defaults.groupGear,
    onChange: (value) => {
      coreUpdate(value)
    }
  })
  game.settings.register(constants.moduleId, settings.displayActivityIcon, {
    name: game.i18n.localize('tokenActionHud.black-flag.settings.displayActivityIcon.name'),
    hint: game.i18n.localize('tokenActionHud.black-flag.settings.displayActivityIcon.hint'),
    scope: 'client',
    config: true,
    type: Boolean,
    default: defaults.displayActivityIcon,
    onChange: (value) => {
      coreUpdate(value)
    }
  })
  game.settings.register(constants.moduleId, settings.showOnlyPrepared, {
    name: game.i18n.localize('tokenActionHud.black-flag.settings.showOnlyPrepared.name'),
    hint: game.i18n.localize('tokenActionHud.black-flag.settings.showOnlyPrepared.hint'),
    scope: 'client',
    config: true,
    type: Boolean,
    default: defaults.showOnlyPrepared,
    onChange: (value) => {
      coreUpdate(value)
    }
  })
  game.settings.register(constants.moduleId, settings.showPreparedness, {
    name: game.i18n.localize('tokenActionHud.black-flag.settings.showPreparedness.name'),
    hint: game.i18n.localize('tokenActionHud.black-flag.settings.showPreparedness.hint'),
    scope: 'client',
    config: true,
    type: Boolean,
    default: defaults.showPreparedness,
    onChange: (value) => {
      coreUpdate(value)
    }
  })
  game.settings.register(constants.moduleId, settings.maxCharacters, {
    name: game.i18n.localize('tokenActionHud.black-flag.settings.maxCharacters.name'),
    hint: game.i18n.localize('tokenActionHud.black-flag.settings.maxCharacters.hint'),
    scope: 'client',
    config: true,
    type: Number,
    default: defaults.maxCharacters,
    onChange: (value) => {
      coreUpdate(value)
    }
  })

  Debug.registerSetting();
}