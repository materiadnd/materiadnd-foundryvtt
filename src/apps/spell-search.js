import { Constants } from "../constants.js";

//FILTER_STATES = ["ignore", "yes", "no"]    //yes this is cribbed from 5etools

class SearchFilter {
    includeLevels = new Set();
    excludeLevels = new Set();
    includeLists = new Set();
    excludeLists = new Set();
    includeSchools = new Set();
    excludeSchools = new Set();
    includeComponents = new Set();
    excludeComponents = new Set();
    textFilter = "";

    requireLevel(level) {
        if (!this.includeLevels.has(level)) { this.includeLevels.add(level); }
        if (this.excludeLevels.has(level)) { this.excludeLevels.delete(level); }
    }
    excludeLevel(level) {
        if (this.includeLevels.has(level)) { this.includeLevels.delete(level); }
        if (!this.excludeLevels.has(level)) { this.excludeLevels.add(level); }
    }
    ignoreLevel(level) {
        if (this.includeLevels.has(level)) { this.includeLevels.delete(level); }
        if (this.excludeLevels.has(level)) { this.excludeLevels.delete(level); }
    }

    requireList(list) {
        if (!this.includeLists.has(list)) { this.includeLists.add(list); }
        if (this.excludeLists.has(list)) { this.excludeLists.delete(list); }
    }
    excludeList(list) {
        if (this.includeLists.has(list)) { this.includeLists.delete(list); }
        if (!this.excludeLists.has(list)) { this.excludeLists.add(list); }
    }
    ignoreList(list) {
        if (this.includeLists.has(list)) { this.includeLists.delete(list); }
        if (this.excludeLists.has(list)) { this.excludeLists.delete(list); }
    }

    requireSchool(school) {
        if (!this.includeSchools.has(list)) { this.includeSchools.add(school); }
        if (this.excludeSchools.has(list)) { this.excludeSchools.delete(school); }
    }
    excludeSchool(school) {
        if (this.includeSchools.has(list)) { this.includeSchools.delete(school); }
        if (!this.excludeSchools.has(list)) { this.excludeSchools.add(school); }
    }
    ignoreSchool(school){
        if (this.includeSchools.has(list)) { this.includeSchools.delete(school); }
        if (this.excludeSchools.has(list)) { this.excludeSchools.delete(school); }
    }

    requireComponent(component) {
        if (!this.includeComponents.has(component)) { this.includeComponents.add(component); }
        if (this.excludeComponents.has(component)) { this.excludeComponents.delete(component); }
    }
    excludeComponent(component) {
        if (this.includeComponents.has(component)) { this.includeComponents.delete(component); }
        if (!this.excludeComponents.has(component)) { this.excludeComponents.add(component); }
    }
    ignoreComponent(component) {
        if (this.excludeComponents.has(component)) { this.excludeComponents.delete(component); }
        if (this.includeComponents.has(component)) { this.includeComponents.delete(component); }
    }

    updateText(text) {
        this.textFilter = text;
    }


}

export class SpellSearchApp extends FormApplication {

    _searchFilter = new SearchFilter();

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
        _updateSearchFilters(ev.target);
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

    _updateSearchFilters(elt) {


    }
}