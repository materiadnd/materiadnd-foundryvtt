import { Constants } from "../constants.js";

export class LocusManagerApp extends FormApplication {

    static launchAppForItem(event, target) {

    }

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
        // need listeners for:
        // 1. dragging item onto window
        // 2. clicking remove button on existing item

    }

    async _initialize() {

    }
}

export default class MateriaActorSheet5eCharacter2 extends ActorSheetV2Mixin(ActorSheet5eCharacter) {
    static DEFAULT_OPTIONS = {
        actions: {
            locus: LocusManagerApp.launchAppForItem
        }
    }
}

Hooks.on("init", () => {
    const documentSheetConfig = 
        game.release.generation < 13
            ? documentSheetConfig
            : foundry.application.apps.DocumentSheetConfig;
    
    documentSheetConfig.registerSheet(

    );
});