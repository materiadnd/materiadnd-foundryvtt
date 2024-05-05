Hooks.on("dnd5e.healActor", async (actor, heal, diff, id) => {
    // if current HP equals the heal value, we were at zero, so we
    // up the exhaustion by one
    if (diff.system.attributes?.hp?.value === heal.total) {
        console.log("materia-dnd | Exhaustion: " + actor.name + " has healed from 0 HP, upping exhaustion by 1");
        actor.update({ "system.attributes.exhaustion": actor.system.attributes.exhaustion + 1 });
    }
}