export function WildShapeTransformActorHandler(actor, target, d, txOptions, options) {
    // custom Materia wildshape
    // we only want this to fire on a wild shape
    if (txOptions.preset == "wildshape") {
        // applies to all wild shapes
        d.system.abilities.str.value = actor.system.abilities.wis.value;   // specific sky behavior will overwrite this below
        d.system.abilities.str.mod = actor.system.abilities.wis.mod;
        d.system.abilities.dex.value = actor.system.abilities.wis.value;
        d.system.abilities.dex.mod = actor.system.abilities.wis.mod;
        d.system.abilities.con.value = actor.system.abilities.con.value;
        d.system.abilities.con.mod = actor.system.abilities.con.mod;
        d.system.attributes.hp.temp = actor.classes.druid.system.levels;
        d.system.attributes.prof = actor.system.attributes.prof;

        // applies to specific forms
        if (target.name.toLowerCase().includes("of the land")) {
            d.system.attributes.ac.value = 10 + actor.system.abilities.wis.mod + actor.system.attributes.prof;
        } else if (target.name.toLowerCase().includes("of the sea")) {
            d.system.attributes.ac.value = 10 + actor.system.abilities.wis.mod;
        } else if (target.name.toLowerCase().includes("of the sky")) {
            d.system.abilities.str.value = actor.system.abilities.str.value;
            d.system.abilities.str.mod = actor.system.abilities.str.mod;
            d.system.attributes.ac.value = 8 + actor.system.abilities.wis.mod;
        }
    }
}