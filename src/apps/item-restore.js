import { Constants } from "../constants.js";

function fetchFromObject(obj, prop) {
    if(typeof obj === 'undefined') {
        return false;
    }

    var _index = prop.indexOf('.')
    if(_index > -1) {
        return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
    }

    return obj[prop];
}

/**
 * Compares two Item5e's for a specific set of different fields and produces an
 * object with similar field structure to an Item5e that notes which fields are
 * different between the two.
 * 
 * @param {Item5e} itemBeingReplaced 
 * @param {Item5e} itemReplacing 
 * @returns {object}
 */
function Item5eCompare(itemBeingReplaced, itemReplacing) {
    // we only are specifically looking for some attributes
    diffObject = {
        "system": {
            "description": {},
            "price": {},
            "unidentified": {},
            "type": {},
            "armor": {},
        }
    };

    diffObject.name = itemBeingReplaced.name == itemReplacing.name;
    diffObject.system.equipped = itemBeingReplaced.system?.equipped == itemReplacing.system.equipped;
    diffObject.system.identified = itemBeingReplaced.system?.identified == itemReplacing.system?.identified;
    diffObject.system.rarity = itemBeingReplaced.system?.rarity == itemReplacing.system?.rarity;

    // Description Tab
    diffObject.system.quantity = itemBeingReplaced.system?.quantity == itemReplacing.system?.quantity;
    diffObject.system.weight = itemBeingReplaced.system?.weight == itemReplacing.system?.weight;
    diffObject.system.price.value = itemBeingReplaced.system?.price?.value == itemReplacing.system?.price?.value;
    diffObject.system.price.denomination = itemBeingReplaced.system?.price?.denomination == itemReplacing.system?.price?.denomination;

    diffObject.system.description.value = itemBeingReplaced.system?.description?.value == itemReplacing.system?.description?.value;
    diffObject.system.unidentified.name = itemBeingReplaced.system?.unidentified?.name == itemReplacing.system?.unidentified?.name;
    diffObject.system.unidentified.description = itemBeingReplaced.system?.unidentified?.description == itemReplacing.system?.unidentified?.description;
    diffObject.system.description.chat = itemBeingReplaced.system?.description?.chat == itemReplacing?.system?.description?.chat;

    // Details Tab
    diffObject.system.type.value = itemBeingReplaced.system?.type?.value == itemReplacing.system?.type?.value;
    diffObject.system.type.baseItem = itemBeingReplaced.system?.type?.baseItem == itemReplacing.system?.type?.baseItem;
    diffObject.system.type.label = itemBeingReplaced.system?.type?.label == itemReplacing.system?.type?.label; // may be auto-populated, may want to remove

    diffObject.system.attunement = itemBeingReplaced.system?.attunement == itemReplacing.system?.attunement;
    diffObject.system.proficient = itemBeingReplaced.system?.proficient == itemReplacing.system?.proficient;
    diffObject.system.properties = itemBeingReplaced.system?.properties == itemReplacing.system?.properties;

    diffObject.system.magicalBonus = itemBeingReplaced.system?.magicalBonus == itemReplacing.system?.magicalBonus;
    diffObject.system.armor.value = itemBeingReplaced.system?.armor?.value == itemReplacing.system?.armor?.value;
    diffObject.system.armor.magicalBonus = itemBeingReplaced.system?.armor?.magicalBonus == itemReplacing.system?.armor?.magicalBonus;
    diffObject.system.armor.dex = itemBeingReplaced.system?.armor?.dex == itemReplacing.system?.armor?.dex;
    diffObject.system.strength = itemBeingReplaced.system?.strength == itemReplacing.system?.strength;

    // can skip Usage section entirely if neither have it
    if (itemBeingReplaced.system?.activation?.type != null || itemReplacing.system?.activation?.type != null) {
        // one of them has an activation type so we have to check these
        diffObject.system.activation = {};
        diffObject.system.activation.type = itemBeingReplaced.system?.activation?.type == itemReplacing.system?.activation?.type;
        diffObject.system.activation.cost = itemBeingReplaced.system?.activation?.cost == itemReplacing.system?.activation?.cost;
        diffObject.system.activation.condition = itemBeingReplaced.system?.activation?.condition == itemReplacing.system?.activation?.condition;

        if (itemBeingReplaced.system?.target?.type != null || itemReplacing.system?.target?.type != null) {
            diffObject.system.target = {};
            diffObject.system.target.type = itemBeingReplaced.system?.target?.type == itemReplacing.sytem?.target?.type;
            diffObject.system.target.value = itemBeingReplaced.system?.target?.value == itemReplacing.sytem?.target?.value;
            diffObject.system.target.units = itemBeingReplaced.system?.target?.units == itemReplacing.sytem?.target?.units;
        }
        if (itemBeingReplaced.system?.range?.units != null || itemReplacing.system?.range?.units != null) {
            diffObject.system.range = {};
            diffObject.system.range.units = itemBeingReplaced.system?.range?.units == itemReplacing.system?.range?.units;
            diffObject.system.range.value = itemBeingReplaced.system?.range?.value == itemReplacing.system?.range?.units;
            diffObject.system.range.long = itemBeingReplaced.system?.range?.long == itemReplacing.system?.range?.units;
        }
        if (itemBeingReplaced.system?.duration?.units != null || itemReplacing.system?.duration?.units != null) {
            diffObject.system.duration = {};
            diffObject.system.duration.units = itemBeingReplaced.system?.duration?.units == itemReplacing.system?.duration?.units;
            diffObject.system.duration.value = itemBeingReplaced.system?.duration?.value == itemReplacing.system?.duration?.value;
        }
        if (itemBeingReplaced.system?.uses?.per != null || itemReplacing.system?.uses?.per != null) {
            diffObject.system.uses = {};
            diffObject.system.uses.per = itemBeingReplaced.system?.uses?.per == itemReplacing.system?.uses?.per;
            diffObject.system.uses.value = itemBeingReplaced.system?.uses?.value == itemReplacing.system?.uses?.value;
            diffObject.system.uses.max = itemBeingReplaced.system?.uses?.max == itemReplacing.system?.uses?.max;
            diffObject.system.uses.recovery = itemBeingReplaced.system?.uses?.recovery == itemReplacing.system?.uses?.recovery;
            diffObject.system.uses.autoDestroy = itemBeingReplaced.system?.uses?.autoDestroy == itemReplacing.system?.uses?.autoDestroy;
        }
        if (itemBeingReplaced.system?.consume?.type != null || itemReplacing.system?.consume?.type != null) {
            diffObject.system.consume = {};
            diffObject.system.consume.type = itemBeingReplaced.system?.consume?.type == itemBeingReplaced.system?.consume?.type;
            diffObject.system.consume.target = itemBeingReplaced.system?.consume?.target == itemBeingReplaced.system?.consume?.target;
            diffObject.system.consume.amount = itemBeingReplaced.system?.consume?.amount == itemBeingReplaced.system?.consume?.amount; // this should always differ if it's set (with normal use cases)
            diffObject.system.consume.scales = itemBeingReplaced.system?.consume?.scales == itemBeingReplaced.system?.consume?.scales;
        }
    }
    // can skip Action/Attack section entirely if neither have it
    if (itemBeingReplaced.system.actionType != "" || itemReplacing.system.actionType != "") {
        // one of them has an action Type so we have to check these
        diffObject.system.actionType = itemBeingReplaced.system?.actionType == itemReplacing.system?.actionType;
        diffObject.system.ability = itemBeingReplaced.system?.ability == itemReplacing.system?.ability;
        if (itemBeingReplaced.system?.attack != null || itemReplacing.system?.attack != null) {
            diffObject.system.attack = {};
            diffObject.system.attack.bonus = itemBeingReplaced.system?.attack?.bonus == itemReplacing.system?.attack?.bonus;
            diffObject.system.attack.flat = itemBeingReplaced.system?.attack?.flat == itemReplacing.system?.attack?.flat;
        }
        if (itemBeingReplaced.system?.critical != null || itemReplacing.system?.critical != null) {
            diffObject.system.critical = {};
            diffObject.system.critical.threshold = itemBeingReplaced.system?.critical?.threshold == itemReplacing.system?.critical?.threshold;
            diffObject.system.critical.damage = itemBeingReplaced.system?.critical?.damage == itemReplacing.system?.critical?.damage;
        }
        if (itemBeingReplaced.system?.damage != null || itemReplacing.system?.damage != null) {
            diffObject.system.damage = {};
            // TODO(dd): damage parts needs to be handled differently
            diffObject.system.damage.versatile = itemBeingReplaced.system?.damage?.versatile == itemReplacing.system?.damage?.versatile;
        }
        diffObject.system.formula = itemBeingReplaced.system?.formula == itemReplacing.system?.formula;
        if (itemBeingReplaced.system?.save?.ability != null || itemReplacing.system?.save?.ability != null) {
            diffObject.system.save = {};
            diffObject.system.save.ability = itemBeingReplaced.system?.save?.ability == itemReplacing.system?.save?.ability;
            diffObject.system.save.dc = itemBeingReplaced.system?.save?.dc == itemReplacing.system?.save?.dc;
            diffObject.system.save.scaling = itemBeingReplaced.system?.save?.scaling == itemReplacing.system?.save?.scaling;
        }
        diffObject.system.chatFlavor = itemBeingReplaced.system?.chatFlavor == itemReplacing.system?.chatFlavor;
    }

    return diffObject;
}

function renderBaseType(itemType) {
    switch (itemType) {
        case 'improv':
            return "Improvised";
        case 'martialM':
            return "Martial Melee";
        case 'martialR':
            return "Martial Ranged";
        case 'natural':
            return "Natural";
        case 'siege':
            return "Siege";
        case 'simpleM':
            return "Simple Melee";
        case 'simpleR':
            return "Simple Ranged";
        default:
            return itemType;
    }
}
function renderAttunement(attunement) {
    return CONFIG.DND5E.attunements[attunement];
};

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
        loadTemplates({
            diffrow: Constants.TEMPLATES.DIFF_ROW_PARTIAL
        });

        // set properties

        // register Handlebars helpers
        Handlebars.registerHelper('diffrow', function(diff, key, desc, originalItem, existingItem) {
            if (!diff[key]) {
                let originalItemProp = fetchFromObject(originalItem, key);
                let existingItemProp = fetchFromObject(existingItem, key);
                if (key == "system.type.value") {
                    originalItemProp = renderBaseType(originalItemProp);
                    existingItemProp = renderBaseType(existingItemProp);
                } else if (key == "system.attunement") {
                    originalItemProp = renderAttunement(originalItemProp);
                    existingItemProp = renderAttunement(existingItemProp);
                }
                return new Handlebars.SafeString(`<tr class="diff-table-row">\n<td><input type="checkbox" id="${key}" /></td>\n<td>${desc}</td>\n<td>${existingItemProp}</td>\n<td>${originalItemProp}</td>\n</tr>\n`);
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
    }

    async setResetData(origItemId, actorId, itemId) {
        this.originalItemId = origItemId;
        this.actorId = actorId;
        this.itemId = itemId;
        this.actor = game.actors.get(this.actorId);
        this.existingItem = this.actor.items.find(x => x._id == this.itemId);
        this.originalItem = await fromUuid(origItemId);
        this.diff = Item5eCompare(this.existingItem, this.originalItem);
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
}