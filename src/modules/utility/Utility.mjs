import {constants} from '../constants.mjs';
import {debug} from "./Debug.mjs";

export default class Utility {

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
    templates = foundry.utils.flattenObject(templates)

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

const notify = Utility.notify;
const error = Utility.error;
const getTemplate = Utility.getTemplate;
const getSetting = Utility.getSetting;
const setSetting = Utility.setSetting;
const slugify = Utility.slugify;
const isGmActive = Utility.isGmActive;
const getHook = Utility.getHook;


export {notify, error, getTemplate, getSetting, setSetting, slugify, isGmActive, getHook};