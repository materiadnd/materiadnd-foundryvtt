import { Constants } from "../constants.js";

const sectionFields = [
    {
        "section": "General",
        "fields": [
            { "field": "name", "label": "Name" },
            { "field": "img", "label": "Image", "renderFunc": renderImage },
            { "field": "system.equipped", "label": "Equipped?" },
            { "field": "system.identified", "label": "Identified?" },
            { "field": "system.rarity", "label": "Rarity", "renderFunc": renderItemRarity },
            { "field": "system.quantity", "label": "Quantity" },
            { "field": "system.weight", "label": "Weight" },
            { "field": "system.price.value", "label": "Price (value)" },
            { "field": "system.price.denomination", "label": "Price (denomination)" },
        ]
    },
    {
        "section": "Description",
        "fields": [
            // { "field": "system.unidentified.name", "label": "Unidentified Name" },
            // { "field": "system.unidentified.description", "label": "Unidentified Description" },
            { "field": "system.description.value", "label": "Description" },
            { "field": "system.description.chat", "label": "Chat Description" },
        ]
    },
    {
        "section": "Details (General)",
        "fields": [
            { "field": "system.type.value", "label": "Type", "renderFunc": renderBaseType },
            { "field": "system.type.baseItem", "label": "Base Item" },
            // { "field": "system.type.label", "label": "Item Label" },
            { "field": "system.attunement", "label": "Attunement", "renderFunc": renderAttunement },
            //"system.proficient",
            { "field": "system.properties", "label": "Properties", "renderFunc": renderProperties },
            { "field": "system.magicalBonus", "label": "Magical Bonus" },
            { "field": "system.armor.value", "label": "Armor Class" },
            { "field": "system.armor.magicalBonus", "label": "Armor Magic Bonus" },
            { "field": "system.armor.dex", "label": "Max Dexterity Modifier" },
            { "field": "system.strength", "label": "Required Strength" },
            { "field": "system.level", "label": "Spell Level", "renderFunc": renderSpellLevel },
            { "field": "system.materials.value", "label": "Spellcasting Materials" },
            { "field": "system.materials.consumed", "label": "Materials Consumed?" },
            { "field": "system.materials.cost", "label": "Materials Cost" },
            { "field": "system.materials.supply" , "label": "Materials (#)" },
            { "field": "system.preparation.mode", "label": "Spell Preparation Mode" },
            { "field": "system.preparation.prepared", "label": "Prepared?" },
            { "field": "system.school", "label": "Spell School", "renderFunc": renderSpellSchool },
            { "field": "system.hp.value", "label": "HP (current)" },
            { "field": "system.hp.max", "label": "HP (max)" },
            { "field": "system.hp.dt", "label": "Damage Threshold" },
            { "field": "system.hp.conditions", "label": "Health Conditions" }
        ]
    },
    {
        "section": "Details (Usage)",
        "fields": [
            { "field": "system.activation.type", "label": "Activation Cost (units)", "renderFunc": renderActivationType },
            { "field": "system.activation.cost", "label": "Activation Cost (#)" },
            { "field": "system.activation.condition", "label": "Activation Condition" },
            { "field": "system.target.type", "label": "Target (type)", "renderFunc": renderTargetType },
            { "field": "system.target.value", "label": "Target (#)" },
            { "field": "system.target.units", "label": "Target (units)" },
            { "field": "system.target.width", "label": "Line Width" },
            { "field": "system.target.prompt", "label": "Template Prompt" },
            { "field": "system.range.units", "label": "Range (units)", "renderFunc": renderRangeType },
            { "field": "system.range.value", "label": "Range (normal)" },
            { "field": "system.range.long", "label": "Range (long)" },
            { "field": "system.duration.units", "label": "Duration (units)", "renderFunc": renderTimePeriod },
            { "field": "system.duration.value", "label": "Duration (#)" },
            { "field": "system.uses.per", "label": "Limited Uses (units)", "renderFunc": renderLimitedUsePeriod },
            { "field": "system.uses.value", "label": "Limited Uses (#)" },
            { "field": "system.uses.max", "label": "Limited Uses (Max)" },
            { "field": "system.uses.recovery", "label": "Recovery Formula" },
            { "field": "system.uses.autoDestroy", "label": "Destroy on Empty" },
            { "field": "system.uses.prompt", "label": "Uses Prompt" },
            { "field": "system.consume.type", "label": "Resource Consumption (units)", "renderFunc": renderConsumptionType },
            { "field": "system.consume.target", "label": "Resource Consumption (target)", "renderFunc": renderConsumptionTarget },
            { "field": "system.consume.amount", "label": "Resource Consumption (#)" },
            { "field": "system.consume.scales", "label": "Scales" },  //??
        ]
    },
    {
        "section": "Details (Action)",
        "fields": [
            { "field": "system.actionType", "label": "Action Type", "renderFunc": renderActionType },
            { "field": "system.ability", "label": "Ability Modifier", "renderFunc": renderAbility },
            { "field": "system.attack.bonus", "label": "Attack Roll Bonus" },
            { "field": "system.attack.flat", "label": "Flat Bonus" },
            { "field": "system.critical.threshold", "label": "Critical Hit Threshold" },
            { "field": "system.critical.damage", "label": "Extra Critical Hit Damage" },
            { "field": "system.damage.parts", "label": "Damage Formulas", "renderFunc": renderDamageParts },
            { "field": "system.damage.versatile", "label": "Versatile Damage" },
            { "field": "system.formula", "label": "Other Formula" },
            { "field": "system.save.ability", "label": "Saving Throw", "renderFunc": renderAbility },
            { "field": "system.save.dc", "label": "Saving Throw DC" },
            { "field": "system.save.scaling", "label": "Saving Throw Target" },
            { "field": "system.chatFlavor", "label": "Chat Message Flavor" },
        ]
    },
    {
        "section": "Summons",
        "fields": [
            { "field": "system.summons.profiles", "label": "Profiles", "renderFunc": renderSummonProfiles },
            { "field": "system.summons.match.proficiency", "label": "Match Proficiency" },
            { "field": "system.summons.bonuses.ac", "label": "Bonus Armor Class" },
            { "field": "system.summons.bonuses.hp", "label": "Bonus Hit Points" },
            { "field": "system.summons.match.attacks", "label": "Match Attacks" },
            { "field": "system.summons.match.saves", "label": "Match Saves" },
            { "field": "system.summons.bonuses.attackDamage", "label": "Bonus Attack Damage" },
            { "field": "system.summons.bonuses.saveDamage", "label": "Bonus Save Damage" },
            { "field": "system.summons.bonuses.healing", "label": "Bonus Healing" },
        ]
    }
];


function fetchFromObject(obj, prop) {
    if (typeof obj === 'undefined') {
        return false;
    }
    if (obj == null) {
        return null;
    }

    var _index = prop.indexOf('.')
    if (_index > -1) {
        let first = prop.substring(0, _index);
        let rest = prop.substr(_index + 1);
        if (!obj.hasOwnProperty(first)) {
            return undefined;
        } else {
            return fetchFromObject(obj[first], rest);
        }
    }

    let retVal = obj[prop];
    if (retVal instanceof Set) {
        // Sets do weird stuff but Array coercion works fine
        return Array.from(retVal);
    } else {
        return retVal;
    }
}

function getDiffFields(existingItem, referenceItem, sectionFields) {
    // pseudocode:
    // iterate over sections in field list:
    //   for each field in section fields:
    //     get existing value
    //     get reference value
    //     if either is non-null:
    //       create object with both values with key of field name
    let diffList = []
    for (const sectionDefinition of sectionFields) {
        if (sectionDefinition.hasOwnProperty('sections')) {
            diffObject[sectionDefinition['section']] = getDiffFields(existingItem, referenceItem, sectionDefinition['sections'])
        } else {
            let fieldDiffs = [];
            for (const fieldEntry of sectionDefinition['fields']) {
                let existingItemValue = fetchFromObject(existingItem, fieldEntry['field']);
                let referenceItemValue = fetchFromObject(referenceItem, fieldEntry['field']);
                if ((existingItemValue != null || referenceItemValue != null) &&
                    (existingItemValue != undefined || referenceItemValue != undefined) &&
                    existingItemValue != referenceItemValue) {
                        if (existingItemValue instanceof Array && referenceItemValue instanceof Array) {
                            if (JSON.stringify(existingItemValue) == JSON.stringify(referenceItemValue)) {
                                break;
                            }
                        }
                        if ('renderFunc' in fieldEntry) {
                            fieldDiffs.push({ "field": fieldEntry['field'], "label": fieldEntry['label'], "existing": existingItemValue, "reference": referenceItemValue, "renderFunc": fieldEntry['renderFunc'] });
                        } else {
                            fieldDiffs.push({ "field": fieldEntry['field'], "label": fieldEntry['label'], "existing": existingItemValue, "reference": referenceItemValue });
                        }
                }
            }
            if (fieldDiffs.length > 0) {
                let sectionDiff = { "section": sectionDefinition["section"], "fields": fieldDiffs };
                diffList.push(sectionDiff);
            }
        }
    }
    return diffList;
}

function renderAbility(ability, _) {
    if (ability == undefined) {
        return `${ability}`;
    } else {
        return `${CONFIG.DND5E.abilities[ability].label}`;
    }
}
function renderActionType(actionType, _) {
    return `${CONFIG.DND5E.itemActionTypes[actionType]}`;
}
function renderActivationType(activationType, _) {
    return `${CONFIG.DND5E.abilityActivationTypes[activationType]}`;
}
function renderAttunement(attunement, _) {
    return `${CONFIG.DND5E.attunements[attunement]}`;
}
function renderBaseType(itemType, _) {
    let allItemTypes =  {
        ...CONFIG.DND5E.armorTypes,
        ...CONFIG.DND5E.equipmentTypes,
        ...CONFIG.DND5E.miscEquipmentTypes,
        ...CONFIG.DND5E.toolTypes,
        ...CONFIG.DND5E.weaponTypes
    };
    return `${allItemTypes[itemType]}`;
}
function renderConsumptionTarget(itemId, actor) {
    // I think the hb template INVOKES the function when testing #if on it, but with no args
    if (itemId == undefined || actor == undefined) {
        return `${itemId}`;
    } else {
        let targetItem = actor.items.find( x => x._id == itemId )
        if (targetItem != null) {
            return `<a class="content-link" draggable="true" data-uuid="${targetItem.uuid}" data-id="${targetItem._id}" data-type="Item" data-tooltip="Feature Item"><i class="fas fa-suitcase"></i>${targetItem.name}</a>`;
        } else {
            return `${itemId}`;
        }
    }
}
function renderConsumptionType(consumptionType, _) {
    return `${CONFIG.DND5E.abilityConsumptionTypes[consumptionType]}`;
}
function renderDamageParts(dmgParts, _) {
    if (dmgParts instanceof Array) {
        let itemStr = "";
        dmgParts.forEach((elt) => {
            let formula = elt[0];
            let dmgType = elt[1];
            itemStr += `<li>${formula} (${dmgType})</li>\n`;
        });
        return `<ol style="list-style: none">\n${itemStr}</ol>`;
    } else {
        return `${dmgParts}`;
    }
}
function renderImage(imgUrl, _) {
    return `<img style="max-width: 100px; height: 100px;" src="${imgUrl}"/>`;
}
function renderItemRarity(itemRarity, _) {
    return `<p style="text-transform: capitalize">${CONFIG.DND5E.itemRarity[itemRarity]}</p>`;
}
function renderLimitedUsePeriod(limitedUsePeriod, _) {
    if (limitedUsePeriod == undefined) {
        return `${limitedUsePeriod}`;
    } else {
        return `${CONFIG.DND5E.limitedUsePeriods[limitedUsePeriod].label}`;
    }
}
function renderProperties(properties, _) {
    if (properties instanceof Array) {
        let itemStr = "";
        properties.forEach((elt) => {
            itemStr += `<li>${CONFIG.DND5E.itemProperties[elt].label}</li>`
        });
        return `<ol style="list-style: none">\n${itemStr}</ol>`;
    } else {
        return `${properties}`;
    }
}
function renderRangeType(rangeType, _) {
    return `${CONFIG.DND5E.rangeTypes[rangeType]}`;
}
function renderSpellSchool(school, _) {
    return `${CONFIG.DND5E.spellSchools[school]}`;
}
function renderSpellLevel(level, _) {
    return `${CONFIG.DND5E.spellLevels[level]}`;
}
function renderSummonProfiles(profiles, _) {
    if (profiles instanceof Array) {
        let itemStr = "";
        profiles.forEach((elt) => {
            let summonActor = fromUuidSync(elt.uuid);
            itemStr += `<li><a class="content-link" draggable="true" data-uuid="${elt.uuid}" data-id="${summonActor._id}" data-type="Actor" data-pack="${summonActor.pack}" data-tooltip="Non-Player Character Actor"><i class="fas fa-user"></i>${summonActor.name}</a></li>\n`;
        });
        return `<ol style="list-style: none">\n${itemStr}</ol>`;
    } else {
        return `${profiles}`;
    }
}
function renderTargetType(targetType, _) {
    return `${CONFIG.DND5E.targetTypes[targetType]}`;
}
function renderTimePeriod(timePeriod, _) {
    return `${CONFIG.DND5E.timePeriods[timePeriod]}`;
}

export class ItemRestoreApp extends FormApplication {
    constructor() {
        super();
        this._initialize();
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;
        const overrides = {
            height: '1080px',
            width: 'auto',
            template: Constants.TEMPLATES.ITEM_RESTORE,
            title: 'Item Restore',
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
        Handlebars.registerHelper("render", (item, renderFunc) => {
            if (item != null && item != undefined && item != "") {
                console.log(`materia-dnd | Item Restore: In render HB helper for item: ${item}, with renderFunc: ${renderFunc.name}`);
                return renderFunc(item, this.actor);
            }
        });
    }

    getData() {
        let data = {};
        data.originalItem = this.originalItem;
        data.existingItem = this.existingItem;
        data.actor = this.actor;
        data.diff = this.diff;
        // set data to be available externally
        return data;
    }

    activateListeners(html) {
        html.find('.restore-item-button').click(async ev => await this._resetItem());
        html.find('.update-item-button').click(async ev => await this._updateItem(html));
        html.find('.diff-ckbox').change(ev => this._handleDiffCheckboxChange(html, ev));
    }

    async setResetData(origItemId, actorId, itemId) {
        this.originalItemId = origItemId;
        this.actorId = actorId;
        this.itemId = itemId;
        this.actor = game.actors.get(this.actorId);
        this.existingItem = this.actor.items.find(x => x._id == this.itemId);
        this.originalItem = await fromUuid(origItemId);
        this.diff = getDiffFields(this.existingItem, this.originalItem, sectionFields);
    }

    async _resetItem() {
        // delete the item on the character sheet
        let actor = game.actors.get(this.actorId);
        let actorItem = actor.items.find(x => x._id == this.itemId);
        actorItem.delete();
        let origItem = await fromUuid(this.originalItemId);
        await actor.createEmbeddedDocuments("Item", [origItem]);
        await this.close();
    }

    async _updateItem(html) {
        // get the fields that are to be kept and their values
        let propsToKeep = [];
        let diffCheckboxes = document.querySelectorAll('.diff-ckbox');
        let anyChecked = false;
        diffCheckboxes.forEach((curVal, curIdx, listObj) => {
            if (curVal.checked) {
                anyChecked = true;
                propsToKeep.push(curVal.id);
            }
        });
        if (!anyChecked) { return; }  // the button should be disabled
        // build an "update" document that will be applied to the reference item
        let update = {};
        for (const prop of propsToKeep) {
            update[prop] = fetchFromObject(this.existingItem, prop);
        }
        // delete the existing item on the char sheet
        let actor = game.actors.get(this.actorId);
        let actorItem = actor.items.find(x => x._id == this.itemId);
        actorItem.delete();
        // add the reference item
        let origItem = await fromUuid(this.originalItemId);
        let newItems = await actor.createEmbeddedDocuments("Item", [origItem]);
        let newItem = newItems[0];
        // update it
        await newItem.update(update);
        await this.close();
    }

    _handleDiffCheckboxChange(html, ev) {
        if (ev.target.checked) {
            // set orig to exclude
            document.getElementById(`${ev.target.id}-orig`).classList.add('diff-exclude');
            document.getElementById(`${ev.target.id}-orig`).classList.remove('diff-keep');
            // set existing to keep
            document.getElementById(`${ev.target.id}-existing`).classList.add('diff-keep');
            document.getElementById(`${ev.target.id}-existing`).classList.remove('diff-exclude');
        } else {
            // set orig to keep
            document.getElementById(`${ev.target.id}-orig`).classList.remove('diff-exclude');
            document.getElementById(`${ev.target.id}-orig`).classList.add('diff-keep');
            // set existing to exclude
            document.getElementById(`${ev.target.id}-existing`).classList.remove('diff-keep');
            document.getElementById(`${ev.target.id}-existing`).classList.add('diff-exclude');
        }
        // enable update item button if any checkboxes are checked
        let diffCheckboxes = document.querySelectorAll('.diff-ckbox');
        let anyChecked = false;
        diffCheckboxes.forEach((curVal, curIdx, listObj) => {
            if (curVal.checked) {
                anyChecked = true;
            }
        });
        if (anyChecked) {
            document.getElementById("update-item-button").classList.remove("disabled");
            document.getElementById("update-item-button").classList.add("enabled");
        } else {
            document.getElementById("update-item-button").classList.remove("enabled");
            document.getElementById("update-item-button").classList.add("disabled");
        }
    }
}