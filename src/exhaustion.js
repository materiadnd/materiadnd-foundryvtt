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
    // updateActor indicates exhaustion level has changed
    // simply remove the existing effect and add a new one with the appropriate changes
    let existingId = actor.effects.find(x => x.flags?.["materia-dnd"]?.["exhaustion-level"])?._id;
    let newExhLevel = exhLevel?.system?.attributes?.exhaustion;
    const minusTwoChanges = [ "system.bonuses.abilities.save", "system.bonuses.abilities.check", "system.bonuses.spell.dc",
        "system.bonuses.msak.attack", "system.bonuses.rsak.attack", "system.bonuses.mwak.attack", "system.bonuses.rwak.attack" ];
    const speedChangeKey = "system.attributes.movement.walk";
    let changes = minusTwoChanges.map(x => ( { key: x, value: (-2 * newExhLevel).toString(), mode: 2 }));
    changes.push({ key: speedChangeKey, value: (-5 * newExhLevel).toString(), mode: 2 });
    let description = "Due to exhaustion, your D20 Tests and imposed DCs are reduced by " + (2 * newExhLevel) + " and your Speed is reduced by " + (5 * newExhLevel) + " feet.";

    if (newExhLevel == 0 && existingId != null ) {
        await actor.deleteEmbeddedDocuments("ActiveEffect", [existingId]);
    } else if (existingId != null && newExhLevel != null) {
        let updates = [
            {
                _id: existingId,
                label: "Exhaustion Level " + newExhLevel,
                description: description,
                flags: {
                    "materia-dnd": { "exhaustion-level": newExhLevel }
                },
                changes: changes,
            }
        ]
        await actor.updateEmbeddedDocuments("ActiveEffect", updates);
    } else if (newExhLevel != null) {
        let effectData = {
                label: "Exhaustion Level",
                icon: "systems/dnd5e/icons/svg/statuses/exhaustion.svg",
                description: description,
                flags: {
                    "materia-dnd": { }
                }
        };
        effectData["label"] = "Exhaustion Level " + newExhLevel;
        effectData["changes"] = changes;
        effectData.flags["materia-dnd"]["exhaustion-level"] = newExhLevel;
        await actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
    }
}