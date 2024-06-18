import { SearchFilter, SpellSearchIndex } from "./spell-search.js";
import { Constants } from "../constants.js";
import { Settings } from "../settings.js";

const TOGGLE_STATES = ["ignore", "yes", "no"];

function toggleState(currentState) {
    var currIdx = TOGGLE_STATES.findIndex(x => x == currentState);
    return TOGGLE_STATES[(currIdx + 1) % TOGGLE_STATES.length];
}

function getLevelsToExclude(maxValidSpellLevel) {
    return [...Array(10).keys()].filter(x => x > maxValidSpellLevel);
}

function getMaxLevelForClass(actor, className) {
    let spellClassItem = actor.items.find(x => x.type == 'class' && x.name.toLowerCase() == className.toLowerCase());
    if (['full', 'pact'].includes(spellClassItem.system.spellcasting.progression)) {
        return Math.min(Math.floor((spellClassItem.system.levels + 1) / 2), 9);
    } else if (spellClassItem.system.spellcasting.progression == 'half') {
        return Math.min(Math.ceil(spellClassItem.system.levels / 4), 5);
    } else {
        return undefined;
    }
}

function getComponentString(spell) {
    let componentList = [];
    if (spell.system.properties.has('vocal')) { componentList.push(CONFIG.DND5E.spellComponents['vocal'].abbr); }
    if (spell.system.properties.has('somatic')) { componentList.push(CONFIG.DND5E.spellComponents['somatic'].abbr); }
    if (spell.system.properties.has('material')) { componentList.push(CONFIG.DND5E.spellComponents['material'].abbr); }
    return componentList.join('/');
}

function getSpellsForLevel(searchIndex, level) {
    switch (level) {
        case 0: return searchIndex.level0SpellIds;
        case 1: return searchIndex.level1SpellIds;
        case 2: return searchIndex.level2SpellIds;
        case 3: return searchIndex.level3SpellIds;
        case 4: return searchIndex.level4SpellIds;
        case 5: return searchIndex.level5SpellIds;
        case 6: return searchIndex.level6SpellIds;
        case 7: return searchIndex.level7SpellIds;
        case 8: return searchIndex.level8SpellIds;
        case 9: return searchIndex.level9SpellIds;
    }
}

function getSpellsForSchool(searchIndex, school) {
    switch (school) {
        case 'abj': return searchIndex.abjSpellIds;
        case 'con': return searchIndex.conSpellIds;
        case 'div': return searchIndex.divSpellIds;
        case 'enc': return searchIndex.encSpellIds;
        case 'evo': return searchIndex.evoSpellIds;
        case 'ill': return searchIndex.illSpellIds;
        case 'nec': return searchIndex.necSpellIds;
        case 'trs': return searchIndex.trsSpellIds;
    }
}

function getSpellsForClass(searchIndex, className) {
    switch (className) {
        case 'artificer': return searchIndex.artificerSpellIds;
        case 'bard': return searchIndex.bardSpellIds;
        case 'cleric': return searchIndex.clericSpellIds;
        case 'druid': return searchIndex.druidSpellIds;
        case 'paladin': return searchIndex.paladinSpellIds;
        case 'ranger': return searchIndex.rangerSpellIds;
        case 'sorcerer': return searchIndex.sorcererSpellIds;
        case 'warlock': return searchIndex.warlockSpellIds;
        case 'wizard': return searchIndex.wizardSpellIds;
    }
}

function getSpellsForComponent(searchIndex, component) {
    switch (component) {
        case 'vocal': return searchIndex.vocalSpellIds;
        case 'somatic': return searchIndex.somaticSpellIds;
        case 'material': return searchIndex.materialSpellIds;
        case 'ritual': return searchIndex.ritualSpellIds;
        case 'concentration': return searchIndex.concentrationSpellIds;
    }
}


function renderSpellField(spellData, fieldName) {
    switch (fieldName) {
        case 'level': return renderSpellLevel(spellData);
        case 'castTime': return renderSpellCastTime(spellData);
        case 'school': return renderSpellSchool(spellData);
        case 'concentration': return renderSpellConcentration(spellData);
        case 'ritual': return renderSpellRitual(spellData);
        case 'range': return renderSpellRange(spellData);
    }
}

function renderSpellLevel(spellData) {
    return `${spellData.level.replace(' Level', '')}`;
}

function renderSpellCastTime(spellData) {
    if (['action', 'reaction'].includes(spellData.castTime?.type)) {
        return `${spellData.castTime?.type}`;
    } else if (spellData.castTime?.type == 'bonus') {
        return `${spellData.castTime?.type} action`;
    } else {
        if (spellData.castTime?.cost > 1) {
            return `${spellData.castTime?.cost} ${spellData.castTime?.type}s`;
        } else {
            return `${spellData.castTime?.cost} ${spellData.castTime?.type}`;
        }
    }
}

function renderSpellSchool(spellData) {
    return `<img src="${spellData.school.icon}"/>${spellData.school.label}`;
}

function renderSpellConcentration(spellData) {
    if (spellData.concentration) {
        return `<dnd5e-icon class="search-results-body-icon" src="${CONFIG.DND5E.spellTags['concentration'].icon}"></dnd5e-icon>`
    } else {
        return '';
    }
}

function renderSpellRitual(spellData) {
    if (spellData.ritual) {
        return `<dnd5e-icon class="search-results-body-icon" src="${CONFIG.DND5E.spellTags['ritual'].icon}"></dnd5e-icon>`
    } else {
        return '';
    }
}

function renderSpellRange(spellData) {
    if (spellData.range?.value) {
        return `${spellData.range?.value} ${CONFIG.DND5E.movementUnits[spellData.range?.units]}`;
    } else {
        return `${CONFIG.DND5E.rangeTypes[spellData.range?.units]}`;
    }
}

export class SpellSearchAppV2 extends Application {
    _searchIndex = new SpellSearchIndex();

    constructor(className = undefined, maxLevel = undefined) {
        console.log("materia-dnd | Spell Search: CTOR");
        super();
        this.className = className;
        this.maxLevel = maxLevel;
        this._initialize();
    }

    render(force = false, options = {}) {
        console.log("materia-dnd | Spell Search: RENDER");
        super.render(force, options);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;
        const overrides = {
            height: 1080,
            width: 720,
            template: Constants.TEMPLATES.SPELL_SEARCH_V2,
            title: 'Spell Search',
            resizable: true,
            userId: game.userId,
        };
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        return mergedOptions;
    }

    getData() {
        console.log("materia-dnd | Spell Search: GET DATA");
        let data = {};
        data.levelFilters = this.levelFilters;
        data.classFilters = this.classFilters;
        data.schoolFilters = this.schoolFilters;
        data.componentFilters = this.componentFilters;
        data.searchText = this.searchText;
        data.searchResults = this.searchResults;
        return data;
    }

    activateListeners(html) {
        html.find('.toggle-text').on("click", async ev => await this._toggleText(html, ev));
        html.find('#spell-text-search').on("input", async ev => {
            this.searchText = ev.target.value;
            this.searchFilter.updateText(this.searchText);
            await this._applySearchFilter().then(() => this.render());
        });
    }

    async _initialize() {
        console.log("materia-dnd | Spell Search: _INITIALIZE");
        // loadTemplates();
        // set properties
        this._initializeLevelFilters();
        this._initializeClassFilters();
        this._initializeSchoolFilters();
        this._initializeComponentFilters();
        this.searchIndex = JSON.parse(await game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.SPELL_SEARCH_INDEX));
        this.searchFilter = new SearchFilter();
        if (this.maxLevel) {
            for (const levelNum of getLevelsToExclude(this.maxLevel)) {
                this.searchFilter.excludeLevel(levelNum);
                await this._setFilterState("level", levelNum, "no");
            }
        }
        if (this.className) {
            this.searchFilter.requireList(this.className);
            await this._setFilterState("class", this.className, "yes");
        }
        // register Handlebars helpers
        Handlebars.registerHelper("renderSpellField", (item, fieldName) => renderSpellField(item, fieldName));
    }

    _initializeLevelFilters() {
        this.levelFilters = Object.entries(CONFIG.DND5E.spellLevels).map(
            x => { return { level: x[0], levelName: x[1], state: 'ignore' } });
    }

    _initializeClassFilters() {
        this.classFilters = ['artificer', 'bard', 'cleric', 'druid', 'paladin',
            'ranger', 'sorcerer', 'warlock', 'wizard'].map(
                x => { return { id: x, label: x, state: 'ignore' } }
            );
    }

    _initializeSchoolFilters() {
        this.schoolFilters = Object.entries(CONFIG.DND5E.spellSchools).map(
            x => { return { abbr: x[0], name: x[1].label, state: 'ignore' } }
        );
    }

    _initializeComponentFilters() {
        var fullSpellProps = new Array(...Object.entries(CONFIG.DND5E.spellComponents), ...Object.entries(CONFIG.DND5E.spellTags));
        this.componentFilters = fullSpellProps.map(
            x => { return { key: x[0], name: x[1].label, state: 'ignore' } }
        );
    }


    async _applySearchFilter() {
        let results = this.searchIndex.allSpellIds.reduce((acc, id) => { acc.push(fromUuidSync(id)); return acc; }, new Array())
        if (this.searchFilter.includeLevels.size > 0) {
            // console.log(`materia-dnd | Spell Search: including spell levels.  Before: ${results.length}`);
            let includeSpellIds = new Array();
            for (const level of this.searchFilter.includeLevels.values()) {
                includeSpellIds = new Array(...includeSpellIds, ...getSpellsForLevel(this.searchIndex, level));
            }
            results = results.filter(x => includeSpellIds.includes(x.uuid));
            // console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this.searchFilter.excludeLevels.size > 0) {
            // console.log(`materia-dnd | Spell Search: excluding spell levels.  Before: ${results.length}`);
            let excludeSpellIds = new Array();
            for (const level of this.searchFilter.excludeLevels.values()) {
                excludeSpellIds = new Array(...excludeSpellIds, ...getSpellsForLevel(this.searchIndex, level));
            }
            results = results.filter(x => !excludeSpellIds.includes(x.uuid));
            // console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this.searchFilter.includeSchools.size > 0) {
            // console.log(`materia-dnd | Spell Search: including spell schools.  Before: ${results.length}`);
            let includeSpellIds = new Array();
            for (const school of this.searchFilter.includeSchools.values()) {
                includeSpellIds = new Array(...includeSpellIds, ...getSpellsForSchool(this.searchIndex, school));
            }
            results = results.filter(x => includeSpellIds.includes(x.uuid));
            // console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this.searchFilter.excludeSchools.size > 0) {
            // console.log(`materia-dnd | Spell Search: excluding spell schools.  Before: ${results.length}`);
            let excludeSpellIds = new Array();
            for (const school of this.searchFilter.excludeSchools.values()) {
                excludeSpellIds = new Array(...excludeSpellIds, ...getSpellsForSchool(this.searchIndex, school));
            }
            results = results.filter(x => !excludeSpellIds.includes(x.uuid));
            // console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this.searchFilter.includeComponents.size > 0) {
            // console.log(`materia-dnd | Spell Search: including spell components.  Before: ${results.length}`);
            let includeSpellIds = new Array();
            for (const component of this.searchFilter.includeComponents.values()) {
                includeSpellIds = new Array(...includeSpellIds, ...getSpellsForComponent(this.searchIndex, component));
            }
            results = results.filter(x => includeSpellIds.includes(x.uuid));
            // console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this.searchFilter.excludeComponents.size > 0) {
            // console.log(`materia-dnd | Spell Search: excluding spell components.  Before: ${results.length}`);
            let excludeSpellIds = new Array();
            for (const component of this.searchFilter.excludeComponents.values()) {
                excludeSpellIds = new Array(...excludeSpellIds, ...getSpellsForComponent(this.searchIndex, component));
            }
            results = results.filter(x => !excludeSpellIds.includes(x.uuid));
            // console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this.searchFilter.includeLists.size > 0) {
            // console.log(`materia-dnd | Spell Search: including class spell lists.  Before: ${results.length}`);
            let includeSpellIds = new Array();
            for (const className of this.searchFilter.includeLists.values()) {
                includeSpellIds = new Array(...includeSpellIds, ...getSpellsForClass(this.searchIndex, className));
            }
            results = results.filter(x => includeSpellIds.includes(x.uuid));
            // console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this.searchFilter.excludeLists.size > 0) {
            // console.log(`materia-dnd | Spell Search: excluding class spell lists.  Before: ${results.length}`);
            let excludeSpellIds = new Array();
            for (const className of this.searchFilter.excludeLists.values()) {
                excludeSpellIds = new Array(...excludeSpellIds, ...getSpellsForClass(this.searchIndex, className));
            }
            results = results.filter(x => !excludeSpellIds.includes(x.uuid));
            // console.log(`materia-dnd | After: ${results.length}`);
        }

        if (this.searchFilter.textFilter != "") {
            // console.log(`materia-dnd | Spell Search: filtering text.  Before: ${results.length}`);
            results = results.filter(x => {
                let regexp = new RegExp(this.searchFilter.textFilter, "i");
                return x.name.match(regexp);
            });
            // console.log(`materia-dnd | After: ${results.length}`);
        }

        results.sort((a, b) => a.name.localeCompare(b.name));

        let resultsArr = new Array();
        for (const item of results) {
            resultsArr.push({
                name: item.name,
                fancyName: await TextEditor.enrichHTML(`@UUID[${item.uuid}]`),
                level: CONFIG.DND5E.spellLevels[item.system.level],
                castTime: item.system?.activation,
                school: CONFIG.DND5E.spellSchools[item.system.school],
                components: getComponentString(item),
                concentration: item.system?.properties?.has('concentration'),
                ritual: item.system?.properties?.has('ritual'),
                range: item.system?.range
            });
        }
        this.searchResults = resultsArr;
    }

    async _setFilterState(filterName, filterItem, state) {
        switch (filterName) {
            case "level":
                var spellLevel = parseInt(filterItem);
                this.levelFilters = this.levelFilters.reduce((acc, item) => {
                    if (item.level == spellLevel) {
                        acc.push({ level: item.level, levelName: item.levelName, state: state });
                        return acc;
                    } else {
                        acc.push(item);
                        return acc;
                    }
                }, new Array());
                switch (state) {
                    case "ignore":
                        this.searchFilter.ignoreLevel(spellLevel);
                        break;
                    case "yes":
                        this.searchFilter.requireLevel(spellLevel);
                        break;
                    case "no":
                        this.searchFilter.excludeLevel(spellLevel);
                        break;
                }
                break;
            case "class":
                var className = filterItem;
                this.classFilters = this.classFilters.reduce((acc, item) => {
                    if (item.id == className) {
                        acc.push({ id: item.id, label: item.label, state: state });
                        return acc;
                    } else {
                        acc.push(item);
                        return acc;
                    }
                }, new Array());
                switch (state) {
                    case "ignore":
                        this.searchFilter.ignoreList(className);
                        break;
                    case "yes":
                        this.searchFilter.requireList(className);
                        break;
                    case "no":
                        this.searchFilter.excludeList(className);
                        break;
                }
                break;
            case "school":
                var school = filterItem;
                this.schoolFilters = this.schoolFilters.reduce((acc, item) => {
                    if (item.abbr == school) {
                        acc.push({ abbr: item.abbr, name: item.name, state: state });
                        return acc;
                    } else {
                        acc.push(item);
                        return acc;
                    }
                }, new Array());
                switch (state) {
                    case "ignore":
                        this.searchFilter.ignoreSchool(school);
                        break;
                    case "yes":
                        this.searchFilter.requireSchool(school);
                        break;
                    case "no":
                        this.searchFilter.excludeSchool(school);
                        break;
                }
                break;
            case "component":
                var component = filterItem;
                this.componentFilters = this.componentFilters.reduce((acc, item) => {
                    if (item.key == component) {
                        acc.push({ key: item.key, name: item.name, state: state });
                        return acc;
                    } else {
                        acc.push(item);
                        return acc;
                    }
                }, new Array());
                switch (state) {
                    case "ignore":
                        this.searchFilter.ignoreComponent(component);
                        break;
                    case "yes":
                        this.searchFilter.requireComponent(component);
                        break;
                    case "no":
                        this.searchFilter.excludeComponent(component);
                        break;
                }
        }
        await this._applySearchFilter().then(() => this.render());
    }

    async _toggleText(html, ev) {
        const filterRegexp = /spell-(\w+)-filter-(\w+)/;
        var matches = ev.target.id.match(filterRegexp);
        var currentState = ev.target.attributes['state'].value;
        let newState = toggleState(currentState);
        await this._setFilterState(matches[1], matches[2], newState);
    }
}

export function SpellSearchRenderActorSheetHandler(html, actor) {
    for (const header of html.find("div.spellcasting > div.header > h3")) {
        let searchElt = $(`<span>&nbsp;&nbsp;<i class="fa-solid fa-magnifying-glass"></i> Search</span>`);
        let className = header.innerHTML.replace(' Spellcasting', '').toLowerCase();
        let maxLevel = getMaxLevelForClass(actor, className);
        let searchApp = new SpellSearchAppV2(className, maxLevel);
        searchElt.on("click", (evt) => {
            searchApp.render(true);
        });
        header.insertAdjacentElement("beforeend", searchElt[0]);
    }
}