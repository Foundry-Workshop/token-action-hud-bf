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

      if (!this.actor) {
        for (const token of coreModule.api.Utils.getControlledTokens()) {
          const actor = token.actor;
          await this.#handleAction(event, actionType, actor, token, actionId);
        }
      } else {
        await this.#handleAction(event, actionType, this.actor, this.token, actionId);
      }
    }

    /**
     * Handle action
     * @private
     * @param {object} event              The event
     * @param {object} actor              The actor
     * @param {object} token              The token
     * @param {string} actionType         The action type
     * @param {string} actionId           The actionId
     */
    async #handleAction(event, actionType, actor, token, actionId) {
      switch (actionType) {
        default:
          break;
      }
    }
  }
})