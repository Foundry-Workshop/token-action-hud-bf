import {constants, settings} from './constants.mjs';
import {Debug} from "./utility/Debug.mjs";

/**
 *
 * @param coreUpdate
 */
export function registerSettingsCoreUpdate(coreUpdate) {
  game.settings.register(constants.moduleId, settings.groupGear, {
    name: game.i18n.localize('tokenActionHud.black-flag.settings.groupGear.name'),
    hint: game.i18n.localize('tokenActionHud.black-flag.settings.groupGear.hint'),
    scope: 'client',
    config: true,
    type: Boolean,
    default: false,
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
    default: 0,
    onChange: (value) => {
      coreUpdate(value)
    }
  })

  Debug.registerSetting();
}