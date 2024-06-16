import { Constants } from "../constants.js";

//FILTER_STATES = ["ignore", "yes", "no"]    //yes this is cribbed from 5etools

function printSet(set) {
    return new Array(...set).join(' ');
}

function getSpellLists(spell) {
    if (spell.flags.hasOwnProperty('materia-dnd') &&
        spell.flags['materia-dnd'].hasOwnProperty('spell-lists')) {
        return new Set(spell.flags['materia-dnd']['spell-lists'].split(','));
    } else {
        console.log('materia-dnd | Spell search: no spell lists found, returning empty set')
        return new Set();
    }
}

function hasExcludeFromSearchResultsFlag(spell) {
    if (spell.flags.hasOwnProperty('materia-dnd') &&
        spell.flags['materia-dnd'].hasOwnProperty('exclude-from-spell-search')) {
            return spell.flags['materia-dnd']['exclude-from-spell-search'] == "true";
        } else {
            return false;
        }
}

function renderComponents(spell) {
    let componentList = [];
    if (spell.system.properties.has('vocal')) {
        componentList.push(CONFIG.DND5E.spellComponents['vocal'].abbr);
    }
    if (spell.system.properties.has('somatic')) {
        componentList.push(CONFIG.DND5E.spellComponents['somatic'].abbr);
    }
    if (spell.system.properties.has('material')) {
        componentList.push(CONFIG.DND5E.spellComponents['material'].abbr);
    }
    return componentList.join('/');
}

function renderConcentration(spell) {
    if (spell.system.properties.has('concentration')) {
        return 'X';
    } else {
        return '';
    }
}

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
        this.printFilters();
    }
    excludeLevel(level) {
        if (this.includeLevels.has(level)) { this.includeLevels.delete(level); }
        if (!this.excludeLevels.has(level)) { this.excludeLevels.add(level); }
        this.printFilters();
    }
    ignoreLevel(level) {
        if (this.includeLevels.has(level)) { this.includeLevels.delete(level); }
        if (this.excludeLevels.has(level)) { this.excludeLevels.delete(level); }
        this.printFilters();
    }

    requireList(list) {
        if (!this.includeLists.has(list)) { this.includeLists.add(list); }
        if (this.excludeLists.has(list)) { this.excludeLists.delete(list); }
        this.printFilters();
    }
    excludeList(list) {
        if (this.includeLists.has(list)) { this.includeLists.delete(list); }
        if (!this.excludeLists.has(list)) { this.excludeLists.add(list); }
        this.printFilters();
    }
    ignoreList(list) {
        if (this.includeLists.has(list)) { this.includeLists.delete(list); }
        if (this.excludeLists.has(list)) { this.excludeLists.delete(list); }
        this.printFilters();
    }

    requireSchool(school) {
        if (!this.includeSchools.has(school)) { this.includeSchools.add(school); }
        if (this.excludeSchools.has(school)) { this.excludeSchools.delete(school); }
        this.printFilters();
    }
    excludeSchool(school) {
        if (this.includeSchools.has(school)) { this.includeSchools.delete(school); }
        if (!this.excludeSchools.has(school)) { this.excludeSchools.add(school); }
        this.printFilters();
    }
    ignoreSchool(school) {
        if (this.includeSchools.has(school)) { this.includeSchools.delete(school); }
        if (this.excludeSchools.has(school)) { this.excludeSchools.delete(school); }
        this.printFilters();
    }

    requireComponent(component) {
        if (!this.includeComponents.has(component)) { this.includeComponents.add(component); }
        if (this.excludeComponents.has(component)) { this.excludeComponents.delete(component); }
        this.printFilters();
    }
    excludeComponent(component) {
        if (this.includeComponents.has(component)) { this.includeComponents.delete(component); }
        if (!this.excludeComponents.has(component)) { this.excludeComponents.add(component); }
        this.printFilters();
    }
    ignoreComponent(component) {
        if (this.excludeComponents.has(component)) { this.excludeComponents.delete(component); }
        if (this.includeComponents.has(component)) { this.includeComponents.delete(component); }
        this.printFilters();
    }

    updateText(text) {
        this.textFilter = text;
        this.printFilters();
    }

    printFilters() {
        let filterString = `Levels: IN: ${printSet(this.includeLevels)}; OUT: ${printSet(this.excludeLevels)}\n`;
        filterString += `Classes: IN: ${printSet(this.includeLists)}; OUT: ${printSet(this.excludeLists)}\n`;
        filterString += `Schools: IN: ${printSet(this.includeSchools)}; OUT: ${printSet(this.excludeSchools)}\n`
        filterString += `Components: IN: ${printSet(this.includeComponents)}; OUT: ${printSet(this.excludeComponents)}\n`
        filterString += `Text: ${this.textFilter}`;
        console.log(`materia-dnd | Spell search: Filter:\n${filterString}`);
    }
}

export class SpellSearchApp extends FormApplication {

    _searchFilter = new SearchFilter();
    searchResults = new Array();

    constructor(packName) {
        super();
        this.spellPackName = packName;
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
        data.searchResults = this.searchResults;
        return data;
    }

    activateListeners(html) {
        html.find('.toggle-text').on("click", async ev => await this._toggleText(html, ev));
        html.find('#spell-text-search').on("input", async ev => await this._textInputChanged(html, ev));
    }

    async _toggleText(html, ev) {
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
        await this._updateSearchFilters(html, ev.target);
    }

    async _textInputChanged(html, ev) {
        await this._searchFilter.updateText(ev.target.value);
        this.searchResults = await this._updateSearchResults(html);
    }

    async _updateSearchFilters(html, elt) {
        const filterRegexp = /spell-(\w+)-filter-(\w+)/;
        var matches = elt.id.match(filterRegexp);
        var state = elt.attributes["state"].value;
        if (matches.length == 3) {
            switch (matches[1]) {
                case "class":
                    if (state == "ignore") {
                        this._searchFilter.ignoreList(matches[2]);
                    } else if (state == "yes") {
                        this._searchFilter.requireList(matches[2]);
                    } else if (state == "no") {
                        this._searchFilter.excludeList(matches[2]);
                    }
                    break;
                case "level":
                    if (state == "ignore") {
                        this._searchFilter.ignoreLevel(parseInt(matches[2]));
                    } else if (state == "yes") {
                        this._searchFilter.requireLevel(parseInt(matches[2]));
                    } else if (state == "no") {
                        this._searchFilter.excludeLevel(parseInt(matches[2]));
                    }
                    break;
                case "school":
                    if (state == "ignore") {
                        this._searchFilter.ignoreSchool(matches[2]);
                    } else if (state == "yes") {
                        this._searchFilter.requireSchool(matches[2]);
                    } else if (state == "no") {
                        this._searchFilter.excludeSchool(matches[2]);
                    }
                    break;
                case "component":
                    if (state == "ignore") {
                        this._searchFilter.ignoreComponent(matches[2]);
                    } else if (state == "yes") {
                        this._searchFilter.requireComponent(matches[2]);
                    } else if (state == "no") {
                        this._searchFilter.excludeComponent(matches[2]);
                    }
                    break;
            }
            await this._updateSearchResults(html);
        } else {
            console.error(`materia-dnd | Spell search: did not find appropriate filter matches: ${elt.id}`);
        }
    }

    async _updateSearchResults(html) {
        let pack = game.packs.get(this.spellPackName);
        let packSpells = await pack.getDocuments();

        let results = packSpells.filter( x => x.type == 'spell' );
        if (this._searchFilter.includeLevels.size > 0) {
            console.log(`materia-dnd | Including spell levels ${printSet(this._searchFilter.includeLevels)} | Before: ${results.length}`);
            results = results.filter(x => this._searchFilter.includeLevels.has(x?.system?.level));
            console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this._searchFilter.excludeLevels.size > 0) {
            console.log(`materia-dnd | Excluding spell levels ${printSet(this._searchFilter.excludeLevels)} | Before: ${results.length}`);
            results = results.filter(x => !this._searchFilter.excludeLevels.has(x?.system?.level));
            console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this._searchFilter.includeSchools.size > 0) {
            console.log(`materia-dnd | Including spell schools ${printSet(this._searchFilter.includeSchools)} | Before: ${results.length}`);
            results = results.filter(x => this._searchFilter.includeSchools.has(x?.system?.school));
            console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this._searchFilter.excludeSchools.size > 0) {
            console.log(`materia-dnd | Excluding spell schools ${printSet(this._searchFilter.excludeSchools)} | Before: ${results.length}`);
            results = results.filter(x => !this._searchFilter.excludeSchools.has(x?.system?.school));
            console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this._searchFilter.includeComponents.size > 0) {
            console.log(`materia-dnd | Including spell components ${printSet(this._searchFilter.includeComponents)} | Before: ${results.length}`);
            results = results.filter(x => this._searchFilter.includeComponents.intersection(x?.system?.properties).size > 0 );
            console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this._searchFilter.excludeComponents.size > 0) {
            console.log(`materia-dnd | Excluding spell components ${printSet(this._searchFilter.excludeComponents)} | Before: ${results.length}`);
            results = results.filter(x => this._searchFilter.excludeComponents.isDisjointFrom(x?.system?.properties))
            console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this._searchFilter.includeLists.size > 0) {
            console.log(`materia-dnd | Including spell lists ${printSet(this._searchFilter.includeLists)} | Before: ${results.length}`);
            results = results.filter( x => getSpellLists(x).intersection(this._searchFilter.includeLists).size > 0 );
            console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this._searchFilter.excludeLists.size > 0) {
            console.log(`materia-dnd | Excluding spell lists ${printSet(this._searchFilter.excludeLists)} | Before: ${results.length}`);
            results = results.filter( x => getSpellLists(x).isDisjointFrom(this._searchFilter.excludeLists) );
            console.log(`materia-dnd | After: ${results.length}`);
        }
        console.log(`materia-dnd | Excluding spells with flag to exclude from search results | Before ${results.length}`);
        results = results.filter( x => !hasExcludeFromSearchResultsFlag(x));
        console.log(`materia-dnd | After: ${results.length}`);
        this.searchResults = results;
        await this._updateTableResults(html);
    }

    async _updateTableResults(html) {
        let tableBodyString = "";

        for (let result of this.searchResults) {
            let richName = await TextEditor.enrichHTML(`@UUID[${result.uuid}]`);
            tableBodyString += `<tr>\n<td>${richName}</td>\n`;
            tableBodyString += `<td>${CONFIG.DND5E.spellLevels[result.system.level]}</td>\n`;
            tableBodyString += `<td>${CONFIG.DND5E.spellSchools[result.system.school].label}</td>\n`;
            tableBodyString += `<td>${renderComponents(result)}</td>\n`
            tableBodyString += `<td>${renderConcentration(result)}</td>\n</tr>\n`
        }
        
        document.getElementById("spell-search-results-body").innerHTML = tableBodyString;
        document.getElementById("spell-search-results-count").innerHTML = this.searchResults.length;
    }

}