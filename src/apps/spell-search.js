import { Constants } from "../constants.js";
import { Settings } from "../settings.js";

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