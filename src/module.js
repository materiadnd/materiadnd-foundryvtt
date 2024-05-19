import { ItemRestoreApp } from "./apps/item-restore.js";
import { AddMateriaArmor } from "./armor.js"
import { AddMateriaConditions } from "./conditions.js";
import { Constants } from "./constants.js";
import { ExhastionActiveEffectHandler, ExhaustionDamageHandler } from "./exhaustion.js";
import { ItemUseCreateIemHandler, ItemUseUpdateUserHandler, ItemUseUserConnectedHandler } from "./item-use.js";
import { Settings } from "./settings.js";
import { SpellcastingRenderActorSheetHandler, AddThirdPactCaster, SpellcastingAddThirdPactProgression } from "./spellcasting-utils.js";
import { UpdateTeleBonusFlag } from "./tele.js";
import { AddMateriaWeapons } from "./weapons.js";
import { WildShapeTransformActorHandler } from "./wild-shape.js";

Hooks.once('init', () => {
    Settings.initialize();
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ADD_THIRD_PACT_CASTER)) {
        SpellcastingAddThirdPactProgression();
    }
});

Hooks.once("ready", () => {
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ADD_ARMOR_TYPES)) { AddMateriaArmor(); }
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ADD_MATERIA_CONDITIONS)) { AddMateriaConditions(); }
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ADD_THIRD_PACT_CASTER)) { AddThirdPactCaster(); }
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ADD_WEAPONS_AND_WEAPON_PROPS)) { AddMateriaWeapons(); }
})

Hooks.on("dnd5e.damageActor", async (actor, heal, diff, id) => {
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ADD_EXHAUSTION_HANDLING)) {
        await ExhaustionDamageHandler(actor, heal, diff, id);
    }
});

Hooks.on("updateActiveEffect", (activeEffect, flags, diff, id) => {
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ADD_EXHAUSTION_HANDLING)) {
        ExhastionActiveEffectHandler(activeEffect, flags, diff, id);
    }
})

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
    if (game.settings.get(Constants.MODULE_ID, Settings.SETTINGS.ADD_SPELL_PREP_COUNTER)) {
        SpellcastingRenderActorSheetHandler(html, actor);
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
            var origItemId = await item.item?.getFlag('materia-dnd', 'original-item-id');
            if (origItemId == null) { return; }
            const buttonText = game.i18n.localize('MATERIA-DND.ui.item-restore.itemsheet-titlebar-button');
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