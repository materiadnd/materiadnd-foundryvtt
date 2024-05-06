export async function ExhaustionDamageHandler(actor, heal, diff, id) { 
    // if current HP equals the heal value, we were at zero, so we
    // up the exhaustion by one
    if (diff.system.attributes.hp.value == 0) {
        console.log("materia-dnd | Exhaustion: " + actor.name + " has dropped to 0 HP, upping exhaustion by 1");
        let newExhLevel = actor.system.attributes.exhaustion + 1;
        actor.update({ "system.attributes.exhaustion": newExhLevel });
        // special case:  new exhaustion level = 4, we make them vulnerable to all dmg
        if (newExhLevel == 4) {
            makeVulnerableToAllDamageTypes(actor);
        }
    }
}

export function ExhastionActiveEffectHandler(activeEffect, flags, diff, id) {
    let actor = activeEffect.parent;
    if (flags.flags.dnd5e.exhaustionLevel == 3) {
        // special case, dropping from 4 to 3 removes the vulnerability we imposed
        actor.system.traits.dv.value.clear();
    }
    if (flags.flags.dnd5e.exhaustionLevel >= 4) {
        actor.system.traits.dv.value.clear();
        makeVulnerableToAllDamageTypes(actor);
    }
}

function makeVulnerableToAllDamageTypes(actor) {
    for (const [dmgType, _] of Object.entries(CONFIG.DND5E.damageTypes)) {
        actor.system.traits.dv.value.add(dmgType)
    }
}