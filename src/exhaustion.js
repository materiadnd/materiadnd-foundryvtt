export async function ExhaustionDamageHandler(actor, heal, diff, id) { 
    // if current HP equals the heal value, we were at zero, so we
    // up the exhaustion by one
    if (diff?.system?.attributes?.hp?.value == 0) {
        console.log("materia-dnd | Exhaustion: " + actor.name + " has dropped to 0 HP, upping exhaustion by 1");
        let newExhLevel = actor.system.attributes.exhaustion + 1;
        actor.update({ "system.attributes.exhaustion": newExhLevel });

        let effectData = {
             label: "Exhaustion " + newExhLevel,
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
            ],
            system: {}
        };
        await actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
    }
}