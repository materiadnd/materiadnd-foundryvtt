import { Constants } from "../constants";

export class LocusManagerApp extends FormApplication {
    constructor() {
        super();
        this._initialize();
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;
        const overrides = {
            height: 'auto',
            width: 'auto',
            template: Constants.TEMPLATES.LOCUS_MANAGER,
            title: 'Locus Manager',
            userId: game.userId
        };

        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        return mergedOptions;
    }

    getData() {
        let data = {};
        return data;
    }

    activateListeners(html) {

    }

    async _initialize() {

    }
}