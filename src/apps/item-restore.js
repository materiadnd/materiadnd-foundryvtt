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
        // hook in stuff
    }

    setOriginalItemId(origItemId) {
        this.originalItemId = origItemId;
    }
}