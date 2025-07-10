export async function ExhaustionDamageHandler(actor, heal, diff, id) { 
    // if current HP equals the heal value, we were at zero, so we
    // up the exhaustion by one
    if (diff?.system?.attributes?.hp?.value == 0) {
        console.log("materia-dnd | Exhaustion: " + actor.name + " has dropped to 0 HP, upping exhaustion by 1");
        let newExhLevel = actor.system.attributes.exhaustion + 1;
        actor.update({ "system.attributes.exhaustion": newExhLevel });
    }
}

export async function ExhaustionIncDecHandler(actor, exhLevel, diff, id) {
    // updateActor indicates exhaustion level has gone either up or down by some amount
    // if up, we apply the appropriate additional effects (-2 to all stuff, -5 to speed per level of exh)
    const effectData = {
            label: "Exhaustion Level",
            icon: "systems/dnd5e/icons/svg/statuses/exhaustion.svg",
            changes: [
            { key: "system.bonuses.abilities.save",   value: "-2", mode: 2 }, // -1 to saves
            { key: "system.bonuses.abilities.check",  value: "-2", mode: 2 }, // -1 to all ability checks
            { key: "system.bonuses.spell.dc	",        value: "-2", mode: 2 }, // -1 to all spell DCs
            { key: "system.bonuses.msak.attack",      value: "-2", mode: 2 }, // -1 to all attack rolls
            { key: "system.bonuses.rsak.attack",      value: "-2", mode: 2 },
            { key: "system.bonuses.mwak.attack",      value: "-2", mode: 2 },
            { key: "system.bonuses.rwak.attack",      value: "-2", mode: 2 },
            { key: "system.attributes.movement.walk", value: "-5", mode: 2 }  // -5 to speed
        ]
    };
    let newExhLevel = exhLevel?.system?.attributes?.exhaustion;
    let existingEffects = actor.effects.filter(x => x.name == "Exhaustion Level");
    if (existingEffects.length < newExhLevel) { // we have too few exh levels, add some
        let effectsToCreate = newExhLevel - existingEffects.length;
        // console.log("materia-dnd | Exhaustion: Creating " + effectsToCreate + " new exhaustion effects");
        let effectsToAdd = [];
        for (let i = 0; i < effectsToCreate; i++) {
            effectsToAdd.push(effectData);
        }
        await actor.createEmbeddedDocuments("ActiveEffect", effectsToAdd);
    } else if (existingEffects.length > newExhLevel) { // we have too many exh levels, remove some
        let effectsToRemove = existingEffects.length - newExhLevel;
        let idsToRemove = existingEffects.filter(x => x.name == "Exhaustion Level").map(x => x._id).slice(0, effectsToRemove);
        await actor.deleteEmbeddedDocuments("ActiveEffect", idsToRemove);
    }
}