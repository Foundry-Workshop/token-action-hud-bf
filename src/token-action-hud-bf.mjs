import {constants} from './modules/constants.mjs';
import Utility from './modules/utility/Utility.mjs';
import {SystemManagerBlackFlag} from "./modules/SystemManager.mjs";

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
  const module = game.modules.get(constants.moduleId)
  module.api = {
    requiredCoreModuleVersion: constants.requiredCoreModuleVersion,
    SystemManager: SystemManagerBlackFlag
  }
  Hooks.call('tokenActionHudSystemReady', module)
  Utility.notify(`${constants.moduleLabel} connected to TAH Core`, {consoleOnly: true});
})