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
     * @param {object} event       The event
     * @param {string} buttonValue The button value
     */
    async handleActionClick(event, buttonValue) {
      const {actionType, actionId} = this.action.system;
      const args = {event, actionType, actionId, action: this.action, actor: this.actor, token: this.token};

      debug("[RollHandlerBlackFlag] handleActionClick", {
        event,
        buttonValue,
        actionType,
        actionId,
        action: this.action
      });

      if (!this.actor) {
        for (const token of coreModule.api.Utils.getControlledTokens()) {
          const actor = token.actor;
          args.token = token;
          args.actor = actor;
          args.multiple = true;
          await this.#handleAction(args);
        }
      } else {
        await this.#handleAction(args);
      }

      Hooks.callAll('forceUpdateTokenActionHud');
    }

    /**
     * Handle action
     * @private
     * @param {
     *   {
     *     event:      Event,
     *     actionType: string,
     *     actor:      BlackFlagActor,
     *     token:      TokenDocument,
     *     actionId:   string,
     *     action:     Object|*
     *     multiple:   boolean
     *   }
     * } args
     */
    async #handleAction(args) {
      const {event, actionType, actor, token, actionId, multiple = false} = args;
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
        case "toolCheck":
          await actor.rollTool(
            {tool: actionId}, dialog);
          break;
        case "vehicleCheck":
          await actor.rollVehicle(
            {vehicle: actionId}, dialog);
          break;
        case "effect":
          await this.#toggleEffect(actor, actionId);
          break;
        case "condition":
          if (!token) return;
          await this.#toggleCondition(actor, token, actionId);
          break;
        case "feature":
        case "item":
          if (this.isRenderItem()) this.renderItem(actor, actionId);
          else this.#useItem(args);
          break;
        case "utility":
          await this.#useUtilityAction(args);
          break;
        default:
          break;
      }
    }

    async #useUtilityAction({event, actor, token, actionId, dialog}) {
      switch (actionId) {
        case 'initiative':
          await actor.configureInitiativeRoll({}, dialog);
          break;
        case 'endTurn':
          if (game.combat?.current?.tokenId === token?.id)
            return game.combat?.nextTurn();
          break;
        case 'rest':
          await actor.rest({type: action.id});
          break;
        case 'toggleItemPiles':
        case 'makeItemPile':
        case 'revertItemPile':
          this.#handleItemPiles(token, actionId);
          break;
        case 'toggleDisposition':
          this.#toggleDisposition(token);
          break;
      }
    }

    #toggleDisposition(token) {
      const dispositions = Object.values(CONST.TOKEN_DISPOSITIONS);

      let disposition = token.document.disposition;
      let index = dispositions.indexOf(disposition);
      index = (index + 1) % dispositions.length;
      disposition = dispositions[index];
      token.document.update({disposition});
    }

    #handleItemPiles(token, actionId) {
      if (!game.modules.get('item-piles')?.active) return;
      let revert = null;

      if (actionId === 'toggleItemPiles')
        revert = token.document.flags['item-piles']?.data.enabled;
      if (actionId === 'makeItemPile')
        revert = false;
      if (actionId === 'revertItemPile')
        revert = true;

      if (revert === true)
        game.itempiles?.API?.revertTokensFromItemPiles([token]);
      else if (revert === false)
        game.itempiles?.API?.turnTokensIntoItemPiles([token]);
    }

    async #toggleEffect(actor, actionId) {
      const effect = actor.allApplicableEffects().find(effect => effect.id === actionId);
      if (!effect) return;

      if (this.isRightClick && !effect.transfer) {
        await effect.delete();
      } else {
        await effect.update({disabled: !effect.disabled});
      }

      Hooks.callAll("forceUpdateTokenActionHud");
    }

    async #toggleCondition(actor, token, actionId) {
      if (!token) return;

      const statusEffect = CONFIG.statusEffects.find(statusEffect => statusEffect.id === actionId);
      const isConvenient = statusEffect?.flags?.["dfreds-convenient-effects"]?.isConvenient
        ?? actionId.startsWith("Convenient Effect");

      if (game.dfreds && isConvenient) {
        const effectName = statusEffect.name ?? statusEffect.label;
        await game.dfreds.effectInterface.toggleEffect(effectName, {overlay: !!this.isRightClick});
      } else {
        const condition = CONFIG.statusEffects.find(effect => effect.id === actionId);
        if (!condition) return;

        const effect = actor.effects.find(effect => effect.statuses.every(status => status === actionId));

        if (effect?.disabled)
          await effect.delete();

        await actor.toggleStatusEffect(condition.id, {overlay: !!this.isRightClick});
      }

      Hooks.callAll("forceUpdateTokenActionHud");
    }

    /**
     * Use Item
     * @private
     * @param {object} actor    The actor
     * @param {string} actionId The action id
     */
    #useItem({actor, actionId}) {
      /**
       * @var {BlackFlagItem}
       */
      const item = coreModule.api.Utils.getItem(actor, actionId);

      item.activate();
    }

    /**
     * Post Item to Chat
     * @private
     * @param {object} actor    The actor
     * @param {string} actionId The action id
     */
    #postItemToChat({actor, actionId}) {
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
