import { AddMateriaArmor } from "./armor.js"
import { AddMateriaConditions } from "./conditions.js";
import { ExhastionActiveEffectHandler, ExhaustionDamageHandler } from "./exhaustion.js";
import { ItemUseCreateIemHandler, ItemUseUpdateUserHandler, ItemUseUserConnectedHandler } from "./item-use.js";
import { SpellcastingRenderActorSheetHandler, AddThirdPactCaster, SpellcastingAddThirdPactProgression } from "./spellcasting-utils.js";
import { AddMateriaWeapons } from "./weapons.js";
import { WildShapeTransformActorHandler } from "./wild-shape.js";

Hooks.once("ready", () => {
    AddMateriaArmor();
    AddMateriaConditions();
    AddThirdPactCaster();
    AddMateriaWeapons();
})

Hooks.once('init', () => {
    SpellcastingAddThirdPactProgression();
});

Hooks.on("dnd5e.damageActor", async (actor, heal, diff, id) => {
    await ExhaustionDamageHandler(actor, heal, diff, id);
});

Hooks.on("updateActiveEffect", (activeEffect, flags, diff, id) => {
    ExhastionActiveEffectHandler(activeEffect, flags, diff, id);
})

Hooks.on("userConnected", (user, b) => {
    ItemUseUserConnectedHandler(user, b);
});

Hooks.on("updateUser", (user, updates, diff, uid) => {
    ItemUseUpdateUserHandler(user, updates, diff, uid);
});

Hooks.on("createItem", (item, flags, itemId) => {
    ItemUseCreateIemHandler(item, flags, itemId);
});

Hooks.on("renderActorSheet5eCharacter2", (app, html, actor) => {
    SpellcastingRenderActorSheetHandler(html, actor);
});

Hooks.on("dnd5e.transformActor", (actor, target, d, txOptions, options) => {
    WildShapeTransformActorHandler(actor, target, d, txOptions, options);
});