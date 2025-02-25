import {debug} from "./utility/Debug.mjs";

export let RollHandlerBlackFlag = null

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
     * @param {object} event        The event
     */
    async handleActionClick(event) {
      const {actionType, actionId} = this.action.system;

      debug("[RollHandlerBlackFlag] handleActionClick", {event, actionType, actionId, action: this.action});
      debugger;

      if (!this.actor) {
        for (const token of coreModule.api.Utils.getControlledTokens()) {
          const actor = token.actor;
          await this.#handleAction({event, actionType, actor, token, actionId, multiple: true});
        }
      } else {
        await this.#handleAction({event, actionType, actor: this.actor, token: this.token, actionId});
      }
    }

    /**
     * Handle action
     * @private
     * @param {object}  event              The event
     * @param {object}  actor              The actor
     * @param {object}  token              The token
     * @param {string}  actionType         The action type
     * @param {string}  actionId           The actionId
     * @param {boolean} multiple           Running Action for multiple Actors
     */
    async #handleAction({event, actionType, actor, token, actionId, multiple = false}) {
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
        case "weapon":
          if (this.isRenderItem()) this.renderItem(actor, actionId);
          else this.#useItem(event, actor, actionId);
          break;
        case "item":
          if (this.isRenderItem()) this.renderItem(actor, actionId);
          else this.#postItemToChat(event, actor, actionId);
          break;
        default:
          break;
      }
    }


    /**
     * Use Item
     * @private
     * @param {object} event    The event
     * @param {object} actor    The actor
     * @param {string} actionId The action id
     */
    #useItem(event, actor, actionId) {
      /**
       * @var {BlackFlagItem}
       */
      const item = coreModule.api.Utils.getItem(actor, actionId);

      item.activate();
    }

    /**
     * Post Item to Chat
     * @private
     * @param {object} event    The event
     * @param {object} actor    The actor
     * @param {string} actionId The action id
     */
    #postItemToChat(event, actor, actionId) {
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
  }
})