console.log("materia-dnd | Wild Shape: registering transformActor hook");
Hooks.on("dnd5e.transformActor", (actor, target, d, txOptions, options) => {
    // custom Materia wildshape
    // we only want this to fire on a wild shape, best we can do is know when it's a polymorph by
    // the preset options that differ from wild shape
    if (txOptions.keepBackgroundAE) {
        // applies to all wild shapes
        d.system.abilities.dex.value = actor.system.abilities.wis.value;
        d.system.abilities.dex.mod = actor.system.abilities.wis.mod;
        d.system.abilities.con.value = actor.system.abilities.con.value;
        d.system.abilities.con.mod = actor.system.abilities.con.mod;

        d.system.attributes.hp = actor.system.attributes.hp;

        // applies to specific forms
        if (target.name.toLowerCase().includes("of the land")) {
            d.system.abilities.str.value = actor.system.abilities.wis.value;
            d.system.abilities.str.mod = actor.system.abilities.wis.mod;
            d.system.attributes.ac.value = 10 + actor.system.abilities.wis.mod + actor.system.attributes.prof;
        } else if (target.name.toLowerCase().includes("of the sea")) {
            d.system.abilities.str.value = actor.system.abilities.wis.value;
            d.system.abilities.str.mod = actor.system.abilities.wis.mod;
            d.system.attributes.ac.value = 10 + actor.system.abilities.wis.mod;
        } else if (target.name.toLowerCase().includes("of the sky")) {
            d.system.abilities.str.value = actor.system.abilities.str.value;
            d.system.abilities.str.mod = actor.system.abilities.str.mod;
            d.system.attributes.ac.value = 8 + actor.system.abilities.wis.mod;
        }

        // // add back original features and items
        // d.items = d.items.concat(actor.items.filter( i => {
        //     if ( [
        //         // "class", "subclass",
        //         "feat",
        //         // "equipment", "weapon", "tool", "loot", "container"
        //     ].includes(i.type) ) return true;
        // }));
        // d.effects = actor.effects;
    }
});
console.log("materia-dnd | Wild Shape: Setup complete.");