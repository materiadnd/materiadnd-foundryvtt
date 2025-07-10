import { AddMateriaArmor } from "./armor.js"
import { AddMateriaConditions, AddMateriaStatusEffects } from "./conditions.js";
import { AddMateriaWeapons } from "./weapons.js";
import { Constants } from "./constants.js";
import { ExhaustionDamageHandler, ExhaustionIncDecHandler } from "./exhaustion.js";
import { ItemRestoreApp } from "./apps/item-restore.js";
import { ItemUseCreateIemHandler, ItemUseUpdateUserHandler, ItemUseUserConnectedHandler } from "./item-use.js";
import { Replace5eSourcePacks } from "./source-packs.js";
import { Settings } from "./settings.js";
import { AddThirdPactCaster, SpellcastingAddThirdPactProgression } from "./spellcasting-utils.js";
import { UpdateTeleBonusFlag } from "./tele.js";
import { WildShapeTransformActorHandler } from "./wild-shape.js";
import { SpellSearchIndex, SpellSearchApp, SpellSearchRenderActorSheetHandler } from "./apps/spell-search.js";
import { StatRollerRenderActorSheetHandler } from "./apps/stat-roller.js";
import { AddMateriaTools } from "./tools.js";
import { MateriaTableOfContentsCompendium } from "./apps/table-of-contents.js";

Hooks.once("init", () => {
    CONFIG.DND5E.sourceBooks["Materia"] = "Materia D&D 5.M";
})

Hooks.once("init", () => {
    CONFIG.DND5E.sourceBooks["Materia"] = "Materia D&D 5.M";
})

Hooks.once('init', () => {
    Settings.initialize();
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ADD_THIRD_PACT_CASTER)) {
        SpellcastingAddThirdPactProgression();
    }
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ADD_MATERIA_CONDITIONS)) { AddMateriaConditions(); }
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ADD_MATERIA_STATUS_EFFECTS)) { AddMateriaStatusEffects(); }
});

Hooks.once("ready", () => {
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ADD_ARMOR_TYPES)) { AddMateriaArmor(); }
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ADD_THIRD_PACT_CASTER)) { AddThirdPactCaster(); }
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ADD_WEAPONS_AND_WEAPON_PROPS)) { AddMateriaWeapons(); }
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ADD_TOOLS)) { AddMateriaTools(); }
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.REPLACE_SOURCE_PACKS)) { Replace5eSourcePacks(); }
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ENABLE_SPELL_SEARCH)) { 
        let searchButtonHtml = $(`<div class="header-actions action-buttons flexrow">
            <button class="spell-search">
            <i class="fa-solid fa-magnifying-glass"></i> Open Spell Search
        </button>
        </div>`);
        let compendiumSearchElement = $('.compendium-sidebar').find('.directory-header').find('.header-search');
        searchButtonHtml.insertAfter(compendiumSearchElement);
        let spellSearchButton = $('.spell-search').first();
        spellSearchButton.click(async (event) => {
            var spellSearchApp = new SpellSearchApp();   
            spellSearchApp.render(true);
        });
        let index = new SpellSearchIndex();
        index.updateIndexForPack('materia-dnd.spells').then( _ => {
            game.settings.set(Constants.MODULE_ID, Settings.SETTINGS.SPELL_SEARCH_INDEX, JSON.stringify(index));
        });
    }
})

Hooks.once("setup", () => {
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.DISPLAY_HANDBOOK)) {
        // change the appropriately flagged compendiums to use the ToC compendium application
        game.packs.get("materia-dnd.rules").applicationClass = MateriaTableOfContentsCompendium;
    }
});

Hooks.on("dnd5e.damageActor", async (actor, heal, diff, id) => {
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ADD_EXHAUSTION_HANDLING)) {
        await ExhaustionDamageHandler(actor, heal, diff, id);
    }
});

Hooks.on("userConnected", (user, b) => {
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.AUTO_ITEM_USE_TRACKER_ENABLED)) {
        ItemUseUserConnectedHandler(user, b);
    }
});

Hooks.on("updateUser", (user, updates, diff, uid) => {
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.AUTO_ITEM_USE_TRACKER_ENABLED)) {
        ItemUseUpdateUserHandler(user, updates, diff, uid);
    }
});

Hooks.on("createItem", (item, flags, itemId) => {
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.AUTO_ITEM_USE_TRACKER_ENABLED)) {
        ItemUseCreateIemHandler(item, flags, itemId);
    }
});

Hooks.on("renderActorSheet5eCharacter2", (app, html, actor) => {
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ENABLE_SPELL_SEARCH)) {
        SpellSearchRenderActorSheetHandler(html, actor);
    }
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.SHOW_STARTING_STAT_ROLLER)) {
        StatRollerRenderActorSheetHandler(app, html, actor);
    }
});

Hooks.on("dnd5e.transformActor", (actor, target, d, txOptions, options) => {
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.WILD_SHAPE_TRANSFORM_HANDLER_ENABLED)) {
        WildShapeTransformActorHandler(actor, target, d, txOptions, options);
    }
});

Hooks.on("updateItem", (item, flags, diff, id) => {
    if (item.type == 'spell' && item.parent != null ) {
        UpdateTeleBonusFlag(item.parent);
    }
});

Hooks.on("renderItemSheet5e", async (app, html, item) => {
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ENABLE_ITEM_RESTORE)) {
        if(item.item?.actor != null && item.item?.actor?.type == "character" && item.item?.isOwner) {
            var origItemId = await item.item?.getFlag('materia-dnd', 'sourceId');
            if (origItemId == null) { return; }
            const buttonText = game.i18n.localize(`${Constants.MODULE_ID}.ui.item-restore.itemsheet-titlebar-button`);
            let openButton = $(`<a class="open-item-restore"><i class="fas fa-layer-group"></i> ${buttonText}</a>`);
            openButton.click(async (event) => {
                var itemRestoreApp = new ItemRestoreApp();
                await itemRestoreApp.setResetData(origItemId, item.item.actor._id, item.item._id);
                itemRestoreApp.render(true);
            });
            html.closest('.app').find('.open-item-restore').remove();
            let titleElement = html.closest('.app').find('.window-title');
            openButton.insertAfter(titleElement);
        }
    }
});

// Hide the ability scores (ASI) for the Level 1 feat,
// the only valid option is to add a feat.
Hooks.on("renderApplication", async (flow, html, app) => {
    if (app?.title == "Level 1 Feat") {
        html.find('div.feat-section :first-child').css("display", "none")
    }
});

Hooks.on("updateActor", async (actor, exhLevel, diff, id) => {
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ADD_EXHAUSTION_HANDLING)) {
        await ExhaustionIncDecHandler(actor, exhLevel, diff, id);
    }
});