class ExhaustionManager { 

}

Hooks.on("dnd5e.healActor", (actor, healInfo, systemInfo, evtId) => {
    if (actor.system?.attributes?.hp?.value == healInfo.hp) {
        // their current HP is equal to the amount that was healed, ergo they were at zero
        console.log("materia-dnd | Exhaustion: Detected healing from 0 HP, applying one level of exhaustion.");
        // TODO: logic to clamp at 6?
        actor.system.attributes.exhaustion += 1;
    }
});

// We also need to fix it so exhaustion levels don't drop off when
// falling unconscious because the current system does that
Hooks.on("dnd5e.damageActor", (actor, dmgInfo, systemInfo, evtId) => {
    if (actor.system?.attributes?.hp?.value == 0) {
        // they fell unconscious, but at this point they will already have their exhaustion
        // set to zero so we need to lookup this evtId in our tracker to see what the HP was
        // prior
    }

});