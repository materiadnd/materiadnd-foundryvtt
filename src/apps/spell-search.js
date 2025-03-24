import { Constants } from "../constants.js";
import { Settings } from "../settings.js";

const TOGGLE_STATES = ["ignore", "yes", "no"];
const SPELL_COMPONENT_TYPES = ["material", "somatic", "vocal"];
const SPELL_TAG_TYPES = ["concentration", "ritual"]

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
    if (spell.system.properties.has('vocal')) { componentList.push(CONFIG.DND5E.itemProperties['vocal'].abbreviation); } 
    if (spell.system.properties.has('somatic')) { componentList.push(CONFIG.DND5E.itemProperties['somatic'].abbreviation); }
    if (spell.system.properties.has('material')) { componentList.push(CONFIG.DND5E.itemProperties['material'].abbreviation); }
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

function getSpellsForCastTime(searchIndex, castTime) {
    switch (castTime) {
        case 'bonus': return searchIndex.bonusSpellIds;
        case 'action': return searchIndex.actionSpellIds;
        case 'reaction': return searchIndex.reactionSpellIds;
        case 'other': return searchIndex.otherCastTimeSpellIds;
    }
}


function renderSpellField(spellData, fieldName) {
    switch (fieldName) {
        // case 'fancyName': return renderSpellFancyName(spellData);
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
        if (spellData.castTime?.value > 1) {
            return `${spellData.castTime?.value} ${spellData.castTime?.type}s`;
        } else {
            return `${spellData.castTime?.value} ${spellData.castTime?.type}`;
        }
    }
}

function renderSpellSchool(spellData) {
    return `<img src="${spellData.school.icon}"/>${spellData.school.label}`;
}

function renderSpellConcentration(spellData) {
    if (spellData.concentration) {
        return `<dnd5e-icon class="search-results-body-icon" src="${CONFIG.DND5E.itemProperties['concentration'].icon}"></dnd5e-icon>`
    } else {
        return '';
    }
}

function renderSpellRitual(spellData) {
    if (spellData.ritual) {
        return `<dnd5e-icon class="search-results-body-icon" src="${CONFIG.DND5E.itemProperties['ritual'].icon}"></dnd5e-icon>`
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

export class SearchFilter {
    includeLevels = new Set();
    excludeLevels = new Set();
    includeLists = new Set();
    excludeLists = new Set();
    includeSchools = new Set();
    excludeSchools = new Set();
    includeComponents = new Set();
    excludeComponents = new Set();
    includeCastTimes = new Set();
    excludeCastTimes = new Set();
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

    requireCastTime(castTime) {
        if (!this.includeCastTimes.has(castTime)) { this.includeCastTimes.add(castTime); }
        if (this.excludeCastTimes.has(castTime)) { this.excludeCastTimes.delete(castTime); }
        // this.printFilters();
    }
    excludeCastTime(castTime) {
        if (this.includeCastTimes.has(castTime)) { this.includeCastTimes.delete(castTime); }
        if (!this.excludeCastTimes.has(castTime)) { this.excludeCastTimes.add(castTime); }
        // this.printFilters();
    }
    ignoreCastTime(castTime) {
        if (this.excludeCastTimes.has(castTime)) { this.excludeCastTimes.delete(castTime); }
        if (this.includeCastTimes.has(castTime)) { this.includeCastTimes.delete(castTime); }
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
    // this is a terrible way to do it but it makes it the easiest way
    // to stringify them for deserialization
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

    bonusSpellIds = new Array();
    actionSpellIds = new Array();
    reactionSpellIds = new Array();
    otherCastTimeSpellIds = new Array();

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
                castTime: ['action', 'bonus', 'reaction'].includes(spell.system.activation.type) ? spell.system.activation.type : 'other',
            };
            this.allSpellIds.push(spell.uuid);
            switch (spellObject.level) {
                case 0: this.level0SpellIds.push(spell.uuid); break;
                case 1: this.level1SpellIds.push(spell.uuid); break;
                case 2: this.level2SpellIds.push(spell.uuid); break;
                case 3: this.level3SpellIds.push(spell.uuid); break;
                case 4: this.level4SpellIds.push(spell.uuid); break;
                case 5: this.level5SpellIds.push(spell.uuid); break;
                case 6: this.level6SpellIds.push(spell.uuid); break;
                case 7: this.level7SpellIds.push(spell.uuid); break;
                case 8: this.level8SpellIds.push(spell.uuid); break;
                case 9: this.level9SpellIds.push(spell.uuid); break;
            }
            switch (spellObject.school) {
                case 'abj': this.abjSpellIds.push(spell.uuid); break;
                case 'con': this.conSpellIds.push(spell.uuid); break;
                case 'div': this.divSpellIds.push(spell.uuid); break;
                case 'enc': this.encSpellIds.push(spell.uuid); break;
                case 'evo': this.evoSpellIds.push(spell.uuid); break;
                case 'ill': this.illSpellIds.push(spell.uuid); break;
                case 'nec': this.necSpellIds.push(spell.uuid); break;
                case 'trs': this.trsSpellIds.push(spell.uuid); break;
            }
            for (const className of spellObject.classLists.split(',')) {
                switch (className) {
                    case 'artificer': this.artificerSpellIds.push(spell.uuid); break;
                    case 'bard': this.bardSpellIds.push(spell.uuid); break;
                    case 'cleric': this.clericSpellIds.push(spell.uuid); break;
                    case 'druid': this.druidSpellIds.push(spell.uuid); break;
                    case 'paladin': this.paladinSpellIds.push(spell.uuid); break;
                    case 'ranger': this.rangerSpellIds.push(spell.uuid); break;
                    case 'sorcerer': this.sorcererSpellIds.push(spell.uuid); break;
                    case 'warlock': this.warlockSpellIds.push(spell.uuid); break;
                    case 'wizard': this.wizardSpellIds.push(spell.uuid); break;
                }
            }
            for (const component of spellObject.components) {
                switch (component) {
                    case 'vocal': this.vocalSpellIds.push(spell.uuid); break;
                    case 'somatic': this.somaticSpellIds.push(spell.uuid); break;
                    case 'material': this.materialSpellIds.push(spell.uuid); break;
                    case 'ritual': this.ritualSpellIds.push(spell.uuid); break;
                    case 'concentration': this.concentrationSpellIds.push(spell.uuid); break;
                }
            }
            switch (spellObject.castTime) {
                case 'bonus': this.bonusSpellIds.push(spell.uuid); break;
                case 'action': this.actionSpellIds.push(spell.uuid); break;
                case 'reaction': this.reactionSpellIds.push(spell.uuid); break;
                case 'other': this.otherCastTimeSpellIds.push(spell.uuid); break;
            }
        }
    }
}

export class SpellSearchApp extends Application {
    _searchIndex = new SpellSearchIndex();

    constructor(className = undefined, maxLevel = undefined) {
        super();
        this.className = className;
        this.maxLevel = maxLevel;
        this._initialize();
    }

    render(force = false, options = {}) {
        super.render(force, options);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;
        const overrides = {
            height: 800,
            width: 850,
            template: Constants.TEMPLATES.SPELL_SEARCH,
            title: 'Spell Search',
            resizable: true,
            userId: game.userId,
        };
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        return mergedOptions;
    }

    getData() {
        let data = {};
        data.levelFilters = this.levelFilters;
        data.classFilters = this.classFilters;
        data.schoolFilters = this.schoolFilters;
        data.componentFilters = this.componentFilters;
        data.otherFilters = this.otherFilters;
        data.castTimeFilters = this.castTimeFilters;
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
        html = html[0] ?? html;  // cribbed from theripper93
        // timeout for janky core behavior
        setTimeout(() => {
            //enable the input
            html.querySelector("input").disabled = false;
            //focus the input
            html.querySelector("input").focus();
            html.querySelector("input").selectionStart = html.querySelector("input").selectionEnd = 9999;
        }, 20);
    }

    async _initialize() {
        // loadTemplates();
        // set properties
        this._initializeLevelFilters();
        this._initializeClassFilters();
        this._initializeSchoolFilters();
        this._initializeComponentFilters();
        this._initializeCastTimeFilters();
        this.searchIndex = JSON.parse(game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.SPELL_SEARCH_INDEX));
        await this._initializeSpellData();
        this.searchFilter = new SearchFilter();
        if (this.maxLevel) {
            for (const levelNum of getLevelsToExclude(this.maxLevel)) {
                this.searchFilter.excludeLevel(levelNum);
                await this._setFilterState("level", levelNum, "no");
            }
            // also ignore cantrips because this is presumably for spell preps
            this.searchFilter.excludeLevel(0);
            await this._setFilterState("level", 0, "no");
        }
        if (this.className) {
            this.searchFilter.requireList(this.className);
            await this._setFilterState("class", this.className, "yes");
        }
        // register Handlebars helpers
        Handlebars.registerHelper("renderSpellField", (item, fieldName) => renderSpellField(item, fieldName));

        await this._applySearchFilter().then(() => this.render());
    }

    async _initializeSpellData() {
        let packName = game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.SPELL_SEARCH_PACK_NAME);
        let pack = game.packs.get(packName);
        let spellDocs = await pack.getDocuments();

        spellDocs = spellDocs.filter(x => x.type == 'spell')
            .filter(x => x.name != "")
            .filter(x => x.hasOwnProperty('system'))
            .filter(x => x.hasOwnProperty('flags') && x.flags.hasOwnProperty('materia-dnd') && x.flags['materia-dnd'].hasOwnProperty('spell-lists') && !x.flags['materia-dnd'].hasOwnProperty('exclude-from-spell-search'))
            .filter(x => x.system.hasOwnProperty('level'))
            .filter(x => x.system.hasOwnProperty('school'))
            .filter(x => x.system.hasOwnProperty('properties'))
            .map(item => {
                return {
                    uuid: item.uuid,
                    name: item.name,
                    level: CONFIG.DND5E.spellLevels[item.system.level],
                    castTime: item.system?.activation,
                    school: CONFIG.DND5E.spellSchools[item.system.school],
                    components: getComponentString(item),
                    concentration: item.system?.properties?.has('concentration'),
                    ritual: item.system?.properties?.has('ritual'),
                    range: item.system?.range
                }
            });
        for (const i in spellDocs) {
            let currentDoc = spellDocs[i];
            currentDoc.fancyName = await TextEditor.enrichHTML(`@UUID[${currentDoc.uuid}]`);
            spellDocs[i] = currentDoc;
        }
        this.spellData = spellDocs;
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
        this.componentFilters = SPELL_COMPONENT_TYPES.map(
            x => { return { key: x, name: CONFIG.DND5E.itemProperties[x].label, state: 'ignore' } }
        );
        this.otherFilters = SPELL_TAG_TYPES.map(
            x => { return { key: x, name: CONFIG.DND5E.itemProperties[x].label, state: 'ignore' } }
        );
    }

    _initializeCastTimeFilters() {
        this.castTimeFilters = [['action', 'Action'], ['reaction', 'Reaction'],
        ['bonus', 'Bonus Action'], ['other', 'Other']].map(
            x => { return { key: x[0], name: x[1], state: 'ignore' } }
        );
    }

    async _applySearchFilter() {
        let results = structuredClone(this.spellData);  // copy every time, spellData should only ever be written on init

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

        if (this.searchFilter.includeCastTimes.size > 0) {
            // console.log(`materia-dnd | Spell Search: including class spell lists.  Before: ${results.length}`);
            let includeSpellIds = new Array();
            for (const castTime of this.searchFilter.includeCastTimes.values()) {
                includeSpellIds = new Array(...includeSpellIds, ...getSpellsForCastTime(this.searchIndex, castTime));
            }
            results = results.filter(x => includeSpellIds.includes(x.uuid));
            // console.log(`materia-dnd | After: ${results.length}`);
        }
        if (this.searchFilter.excludeCastTimes.size > 0) {
            // console.log(`materia-dnd | Spell Search: excluding class spell lists.  Before: ${results.length}`);
            let excludeSpellIds = new Array();
            for (const castTime of this.searchFilter.excludeCastTimes.values()) {
                excludeSpellIds = new Array(...excludeSpellIds, ...getSpellsForCastTime(this.searchIndex, castTime));
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
        this.searchResults = results;
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
                this.otherFilters = this.otherFilters.reduce((acc, item) => {
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
                break;
            case "castTime":
                var castTime = filterItem;
                this.castTimeFilters = this.castTimeFilters.reduce((acc, item) => {
                    if (item.key == castTime) {
                        acc.push({ key: item.key, name: item.name, state: state });
                        return acc;
                    } else {
                        acc.push(item);
                        return acc;
                    }
                }, new Array());
                switch (state) {
                    case "ignore":
                        this.searchFilter.ignoreCastTime(castTime);
                        break;
                    case "yes":
                        this.searchFilter.requireCastTime(castTime);
                        break;
                    case "no":
                        this.searchFilter.excludeCastTime(castTime);
                        break;
                }
                break;
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
        let searchElt = $(`<span>&nbsp;&nbsp;<i class="fa-solid fa-magnifying-glass"></i> Spells</span>`);
        let className = header.innerHTML.replace(' Spellcasting', '').toLowerCase();
        let maxLevel = getMaxLevelForClass(actor, className);
        className = className.replace(/\s*\(\w+\)\s*/i, '');    // for Warlock (INT) variant, and if we ever
                                                                // do any other variant class
        let searchApp = new SpellSearchApp(className, maxLevel);
        searchElt.on("click", (evt) => {
            searchApp.render(true);
        });
        header.insertAdjacentElement("afterend", searchElt[0]);
    }
}