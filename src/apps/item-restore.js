import { Constants } from "../constants.js";

export class ItemRestoreApp extends FormApplication {
    constructor() {
        super();
        this._initialize();
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;
        const overrides = {
            height: 'auto',
            width: 'auto',
            template: Constants.TEMPLATES.ITEM_RESTORE,
            title: 'Item Restore',
            userId: game.userId,
        };
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        return mergedOptions;
    }

    async _initialize() {
        // loadTemplates()

        // set properties

        // register Handlebars helpers
        // Handlebars.registerHelper(name, (arg) => {} 
    }

    getData() {
        let data = {};
        // set data to be available externally
        return data;
    }

    activateListeners(html) {
        html.find('.restore-item-button').click( async ev => await this._resetItem());
    }

    setResetData(origItemId, actorId, itemId) {
        this.originalItemId = origItemId;
        this.actorId = actorId;
        this.itemId = itemId;
    }

    async _resetItem() {
        // delete the item on the character sheet
        let actor = game.actors.get(this.actorId);
        let actorItem = actor.items.find( x => x._id == this.itemId );
        actorItem.delete();
        let origItem = await fromUuid(this.originalItemId);
        await actor.createEmbeddedDocuments("Item", [origItem]);
        await this.close();
    }
}