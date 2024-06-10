import { Constants } from "../constants.js";

//FILTER_STATES = ["ignore", "yes", "no"]    //yes this is cribbed from 5etools

export class SpellSearchApp extends FormApplication {
    constructor() {
        super();
        this._initialize();
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;
        const overrides = {
            height: 1080,
            width: 720,
            template: Constants.TEMPLATES.SPELL_SEARCH,
            title: 'Spell Search',
            resizable: true,
            userId: game.userId,
        };
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        return mergedOptions;
    }

    async _initialize() {
        // loadTemplates();

        // set properties

        // register Handlebars helpers
    }

    getData() {
        let data = {};

        return data;
    }

    activateListeners(html) {
        html.find('.toggle-text').click(ev => this._toggleText(html, ev));
    }

    _toggleText(html, ev) {
        let currentState = ev.target.attributes["state"].value;
        switch (currentState) {
            case "ignore":
                ev.target.attributes["state"].value = "yes";
                break;
            case "yes":
                ev.target.attributes["state"].value = "no";
                break;
            case "no":
                ev.target.attributes["state"].value = "ignore";
                break;
        }
    }
}