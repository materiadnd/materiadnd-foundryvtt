import { Constants } from "../constants.js";
import { Settings } from "../settings.js";

//FILTER_STATES = ["ignore", "yes", "no"]    //yes this is cribbed from 5etools

function printSet(set) {
    return new Array(...set).join(' ');
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

function renderCastTime(spell) {
    if (['action', 'bonus', 'reaction'].includes(spell.system.activation?.type)) {
        return `${spell.system.activation?.type}`;
    } else {
        return `${spell.system.activation?.cost} ${spell.system.activation?.type}`;
    }
}

function renderConcentration(spell) {
    if (spell.system.properties.has('concentration')) {
        return `<img src="${CONFIG.DND5E.spellTags['concentration'].icon}"/>`
    } else {
        return '';
    }
}
function renderRitual(spell) {
    if (spell.system.properties.has('ritual')) {
        return `<img src="${CONFIG.DND5E.spellTags['ritual'].icon}"/>`
    } else {
        return '';
    }
}

function renderRange(spell) {
    if (spell.system.range?.value) {
        return `${spell.system.range?.value} ${CONFIG.DND5E.movementUnits[spell.system.range?.units]}`;
    } else {
        return `${CONFIG.DND5E.rangeTypes[spell.system.range?.units]}`;
    }
}
function getSpellsForLevel(searchIndex, level) {
    switch(level) {
        case 0:
            return searchIndex.level0SpellIds;
        case 1:
            return searchIndex.level1SpellIds;
        case 2:
            return searchIndex.level2SpellIds;
        case 3:
            return searchIndex.level3SpellIds;
        case 4:
            return searchIndex.level4SpellIds;
        case 5:
            return searchIndex.level5SpellIds;
        case 6:
            return searchIndex.level6SpellIds;
        case 7:
            return searchIndex.level7SpellIds;
        case 8:
            return searchIndex.level8SpellIds;
        case 9:
            return searchIndex.level9SpellIds;
    }
}

function getSpellsForSchool(searchIndex, school) {
    switch(school) {
        case 'abj':
            return searchIndex.abjSpellIds;
        case 'con':
            return searchIndex.conSpellIds;
        case 'div':
            return searchIndex.divSpellIds;
        case 'enc':
            return searchIndex.encSpellIds;
        case 'evo':
            return searchIndex.evoSpellIds;
        case 'ill':
            return searchIndex.illSpellIds;
        case 'nec':
            return searchIndex.necSpellIds;
        case 'trs':
            return searchIndex.trsSpellIds;
    }
}

function getSpellsForClass(searchIndex, className) {
    switch (className) {
        case 'artificer':
            return searchIndex.artificerSpellIds;
        case 'bard':
            return searchIndex.bardSpellIds;
        case 'cleric':
            return searchIndex.clericSpellIds;
        case 'druid':
            return searchIndex.druidSpellIds;
        case 'paladin':
            return searchIndex.paladinSpellIds;
        case 'ranger':
            return searchIndex.rangerSpellIds;
        case 'sorcerer':
            return searchIndex.sorcererSpellIds;
        case 'warlock':
            return searchIndex.warlockSpellIds;
        case 'wizard':
            return searchIndex.wizardSpellIds;
    }
}

function getSpellsForComponent(searchIndex, component) {
    switch (component) {
        case 'vocal':
            return searchIndex.vocalSpellIds;
        case 'somatic':
            return searchIndex.somaticSpellIds;
        case 'material':
            return searchIndex.materialSpellIds;
        case 'ritual':
            return searchIndex.ritualSpellIds;
        case 'concentration':
            return searchIndex.concentrationSpellIds;
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
        // this.printFilters();
    }
    excludeLevel(level) {
        if (this.includeLevels.has(level)) { this.includeLevels.delete(level); }
        if (!this.excludeLevels.has(level)) { this.excludeLevels.add(level); }
        // this.printFilters();
    }
    ignoreLevel(level) {
        if (this.includeLevels.has(level)) { this.includeLevels.delete(level); }
        if (this.excludeLevels.has(level)) { this.excludeLevels.delete(level); }
        // this.printFilters();
    }

    requireList(list) {
        if (!this.includeLists.has(list)) { this.includeLists.add(list); }
        if (this.excludeLists.has(list)) { this.excludeLists.delete(list); }
        // this.printFilters();
    }
    excludeList(list) {
        if (this.includeLists.has(list)) { this.includeLists.delete(list); }
        if (!this.excludeLists.has(list)) { this.excludeLists.add(list); }
        // this.printFilters();
    }
    ignoreList(list) {
        if (this.includeLists.has(list)) { this.includeLists.delete(list); }
        if (this.excludeLists.has(list)) { this.excludeLists.delete(list); }
        // this.printFilters();
    }

    requireSchool(school) {
        if (!this.includeSchools.has(school)) { this.includeSchools.add(school); }
        if (this.excludeSchools.has(school)) { this.excludeSchools.delete(school); }
        // this.printFilters();
    }
    excludeSchool(school) {
        if (this.includeSchools.has(school)) { this.includeSchools.delete(school); }
        if (!this.excludeSchools.has(school)) { this.excludeSchools.add(school); }
        // this.printFilters();
    }
    ignoreSchool(school) {
        if (this.includeSchools.has(school)) { this.includeSchools.delete(school); }
        if (this.excludeSchools.has(school)) { this.excludeSchools.delete(school); }
        // this.printFilters();
    }

    requireComponent(component) {
        if (!this.includeComponents.has(component)) { this.includeComponents.add(component); }
        if (this.excludeComponents.has(component)) { this.excludeComponents.delete(component); }
        // this.printFilters();
    }
    excludeComponent(component) {
        if (this.includeComponents.has(component)) { this.includeComponents.delete(component); }
        if (!this.excludeComponents.has(component)) { this.excludeComponents.add(component); }
        // this.printFilters();
    }
    ignoreComponent(component) {
        if (this.excludeComponents.has(component)) { this.excludeComponents.delete(component); }
        if (this.includeComponents.has(component)) { this.includeComponents.delete(component); }
        // this.printFilters();
    }

    updateText(text) {
        this.textFilter = text;
        // this.printFilters();
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

export class SpellSearchIndex {
    artificerSpellIds = new Array();
    bardSpellIds = new Array();
    clericSpellIds = new Array();
    druidSpellIds = new Array();
    paladinSpellIds = new Array();
    rangerSpellIds = new Array();
    sorcererSpellIds = new Array();
    warlockSpellIds = new Array();
    wizardSpellIds = new Array();

    level0SpellIds = new Array();
    level1SpellIds = new Array();
    level2SpellIds = new Array();
    level3SpellIds = new Array();
    level4SpellIds = new Array();
    level5SpellIds = new Array();
    level6SpellIds = new Array();
    level7SpellIds = new Array();
    level8SpellIds = new Array();
    level9SpellIds = new Array();

    abjSpellIds = new Array();
    conSpellIds = new Array();
    divSpellIds = new Array();
    encSpellIds = new Array();
    evoSpellIds = new Array();
    illSpellIds = new Array();
    necSpellIds = new Array();
    trsSpellIds = new Array();

    vocalSpellIds = new Array();
    materialSpellIds = new Array();
    somaticSpellIds = new Array();
    ritualSpellIds = new Array();
    concentrationSpellIds = new Array();

    allSpellIds = new Array();

    async updateIndexForPack(packName) {
        let pack = game.packs.get(packName);
        let packDocs = await pack.getDocuments();
        // run data sanity checks to exclude any weirdly malformed spell things
        let cleanDocs = packDocs.filter(x => x.type == 'spell')
            .filter(x => x.name != "")
            .filter(x => x.hasOwnProperty('system'))
            .filter(x => x.hasOwnProperty('flags') && x.flags.hasOwnProperty('materia-dnd') && x.flags['materia-dnd'].hasOwnProperty('spell-lists') && !x.flags['materia-dnd'].hasOwnProperty('exclude-from-spell-search'))
            .filter(x => x.system.hasOwnProperty('level'))
            .filter(x => x.system.hasOwnProperty('school'))
            .filter(x => x.system.hasOwnProperty('properties'))

        for (const spell of cleanDocs) {
            var spellObject = {
                uuid: spell.uuid,
                name: spell.name,
                level: spell.system.level,
                school: spell.system.school,
                classLists: spell.flags['materia-dnd']['spell-lists'],
                components: spell.system.properties.filter(x => ['vocal', 'somatic', 'material', 'ritual', 'concentration'].includes(x)),
            };
            this.allSpellIds.push(spell.uuid);
            switch (spellObject.level) {
                case 0:
                    this.level0SpellIds.push(spell.uuid);
                    break;
                case 1:
                    this.level1SpellIds.push(spell.uuid);
                    break;
                case 2:
                    this.level2SpellIds.push(spell.uuid);
                    break;
                case 3:
                    this.level3SpellIds.push(spell.uuid);
                    break;
                case 4:
                    this.level4SpellIds.push(spell.uuid);
                    break;
                case 5:
                    this.level5SpellIds.push(spell.uuid);
                    break;
                case 6:
                    this.level6SpellIds.push(spell.uuid);
                    break;
                case 7:
                    this.level7SpellIds.push(spell.uuid);
                    break;
                case 8:
                    this.level8SpellIds.push(spell.uuid);
                    break;
                case 9:
                    this.level9SpellIds.push(spell.uuid);
                    break;
            }
            switch (spellObject.school) {
                case 'abj':
                    this.abjSpellIds.push(spell.uuid);
                    break;
                case 'con':
                    this.conSpellIds.push(spell.uuid);
                    break;
                case 'div':
                    this.divSpellIds.push(spell.uuid);
                    break;
                case 'enc':
                    this.encSpellIds.push(spell.uuid);
                    break;
                case 'evo':
                    this.evoSpellIds.push(spell.uuid);
                    break;
                case 'ill':
                    this.illSpellIds.push(spell.uuid);
                    break;
                case 'nec':
                    this.necSpellIds.push(spell.uuid);
                    break;
                case 'trs':
                    this.trsSpellIds.push(spell.uuid);
                    break;
            }
            for (const className of spellObject.classLists.split(',')) {
                switch (className) {
                    case 'artificer':
                        this.artificerSpellIds.push(spell.uuid);
                        break;
                    case 'bard':
                        this.bardSpellIds.push(spell.uuid);
                        break;
                    case 'cleric':
                        this.clericSpellIds.push(spell.uuid);
                        break;
                    case 'druid':
                        this.druidSpellIds.push(spell.uuid);
                        break;
                    case 'paladin':
                        this.paladinSpellIds.push(spell.uuid);
                        break;
                    case 'ranger':
                        this.rangerSpellIds.push(spell.uuid);
                        break;
                    case 'sorcerer':
                        this.sorcererSpellIds.push(spell.uuid);
                        break;
                    case 'warlock':
                        this.warlockSpellIds.push(spell.uuid);
                        break;
                    case 'wizard':
                        this.wizardSpellIds.push(spell.uuid);
                        break;
                }
            }
            for (const component of spellObject.components) {
                switch (component) {
                    case 'vocal':
                        this.vocalSpellIds.push(spell.uuid);
                        break;
                    case 'somatic':
                        this.somaticSpellIds.push(spell.uuid);
                        break;
                    case 'material':
                        this.materialSpellIds.push(spell.uuid);
                        break;
                    case 'ritual':
                        this.ritualSpellIds.push(spell.uuid);
                        break;
                    case 'concentration':
                        this.concentrationSpellIds.push(spell.uuid);
                        break;
                }
            }
        }
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
        this.searchIndex = JSON.parse(await game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.SPELL_SEARCH_INDEX));
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

        let results = this.searchIndex.allSpellIds.reduce( (acc, id) => { acc.push(fromUuidSync(id)); return acc;}, new Array())
        if (this._searchFilter.includeLevels.size > 0) {
            // console.log(`materia-dnd | Spell Search: including spell levels.  Before: ${results.length}`);
            let includeSpellIds = new Array();
            for ( const level of this._searchFilter.includeLevels.values() ) {
                includeSpellIds = new Array(...includeSpellIds, ...getSpellsForLevel(this.searchIndex, level));
            }
            results = results.filter(x => includeSpellIds.includes(x.uuid));
            // console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this._searchFilter.excludeLevels.size > 0) {
            // console.log(`materia-dnd | Spell Search: excluding spell levels.  Before: ${results.length}`);
            let excludeSpellIds = new Array();
            for (const level of this._searchFilter.excludeLevels.values() ) {
                excludeSpellIds = new Array(...excludeSpellIds, ...getSpellsForLevel(this.searchIndex, level));
            }
            results = results.filter( x => !excludeSpellIds.includes(x.uuid));
            // console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this._searchFilter.includeSchools.size > 0) {
            // console.log(`materia-dnd | Spell Search: including spell schools.  Before: ${results.length}`);
            let includeSpellIds = new Array();
            for ( const school of this._searchFilter.includeSchools.values() ) {
                includeSpellIds = new Array(...includeSpellIds, ...getSpellsForSchool(this.searchIndex, school));
            }
            results = results.filter( x => includeSpellIds.includes(x.uuid));
            // console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this._searchFilter.excludeSchools.size > 0) {
            // console.log(`materia-dnd | Spell Search: excluding spell schools.  Before: ${results.length}`);
            let excludeSpellIds = new Array();
            for (const school of this._searchFilter.excludeSchools.values() ) {
                excludeSpellIds = new Array(...excludeSpellIds, ...getSpellsForSchool(this.searchIndex, school));
            }
            results = results.filter( x => !excludeSpellIds.includes(x.uuid));
            // console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this._searchFilter.includeComponents.size > 0) {
            // console.log(`materia-dnd | Spell Search: including spell components.  Before: ${results.length}`);
            let includeSpellIds = new Array();
            for ( const component of this._searchFilter.includeComponents.values() ) {
                includeSpellIds = new Array(...includeSpellIds, ...getSpellsForComponent(this.searchIndex, component));
            }
            results = results.filter( x => includeSpellIds.includes(x.uuid));
            // console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this._searchFilter.excludeComponents.size > 0) {
            // console.log(`materia-dnd | Spell Search: excluding spell components.  Before: ${results.length}`);
            let excludeSpellIds = new Array();
            for (const component of this._searchFilter.excludeComponents.values() ) {
                excludeSpellIds =  new Array(...excludeSpellIds, ...getSpellsForComponent(this.searchIndex, component));
            }
            results = results.filter( x => !excludeSpellIds.includes(x.uuid));
            // console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this._searchFilter.includeLists.size > 0) {
            // console.log(`materia-dnd | Spell Search: including class spell lists.  Before: ${results.length}`);
            let includeSpellIds = new Array();
            for ( const className of this._searchFilter.includeLists.values() ) {
                includeSpellIds = new Array(...includeSpellIds, ...getSpellsForClass(this.searchIndex, className));
            }
            results = results.filter( x => includeSpellIds.includes(x.uuid));
            // console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this._searchFilter.excludeLists.size > 0) {
            // console.log(`materia-dnd | Spell Search: excluding class spell lists.  Before: ${results.length}`);
            let excludeSpellIds = new Array();
            for (const className of this._searchFilter.excludeLists.values() ) {
                excludeSpellIds = new Array(...excludeSpellIds, ...getSpellsForClass(this.searchIndex, className));
            }
            results = results.filter( x => !excludeSpellIds.includes(x.uuid));
            // console.log(`materia-dnd | After: ${results.length}`);
        }

        if (this._searchFilter.textFilter != "") {
            // console.log(`materia-dnd | Spell Search: filtering text.  Before: ${results.length}`);
            results = results.filter(x => {
                let regexp = new RegExp(this._searchFilter.textFilter, "i");
                return x.name.match(regexp);
            });
            // console.log(`materia-dnd | After: ${results.length}`);
        }

        results.sort((a, b) => a.name.localeCompare(b.name));
        this.searchResults = results;
        await this._updateTableResults(html);
    }

    async _updateTableResults(html) {
        let tableBodyString = "";

        for (let result of this.searchResults) {
            let richName = await TextEditor.enrichHTML(`@UUID[${result.uuid}]`);
            tableBodyString += `<tr class="spell-search-result-row">\n`;
            tableBodyString += `<td style="text-align: left">${richName}</td>\n`;
            tableBodyString += `<td>${(CONFIG.DND5E.spellLevels[result.system.level]).replace(' Level', '')}</td>\n`;
            tableBodyString += `<td class="spell-search-result-cast-time">${renderCastTime(result)}</td>\n`;
            tableBodyString += `<td><img src="${CONFIG.DND5E.spellSchools[result.system.school].icon}"/>${CONFIG.DND5E.spellSchools[result.system.school].label}</td>\n`;
            tableBodyString += `<td>${renderComponents(result)}</td>\n`
            tableBodyString += `<td>${renderConcentration(result)}</td>\n`
            tableBodyString += `<td>${renderRitual(result)}</td>\n`
            tableBodyString += `<td class="spell-search-result-range">${renderRange(result)}</td>\n`;
            tableBodyString += `<tr>`
        }
        
        document.getElementById("spell-search-results-body").innerHTML = tableBodyString;
        document.getElementById("spell-search-results-count").innerHTML = this.searchResults.length;
    }

}