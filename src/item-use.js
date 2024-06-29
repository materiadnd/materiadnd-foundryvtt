async function updateActorItemUses(actor) {
    console.log("materia-dnd | Item Uses: Updating Item Use Sources for actor: " + actor.name);
    let updates = actor.items.filter( i => i.type == 'feat' &&
        i.system?.consume?.type === 'charges' &&
        i.system?.consume.target === "").
        reduce((acc, item) => {
            let itemSourceId = getItemSource(actor, item.getFlag('materia-dnd', 'item-use-source'))._id;
            let update = { _id: item.id, "system.consume.target": itemSourceId };
            acc.push(update);
            return acc;
        }, []);
    console.log("materia-dnd | Item Uses: Making " + updates.length + " updates for actor: " + actor.name);
    await actor.updateEmbeddedDocuments("Item", updates);
}

function getItemSource(actor, itemSourceType) {
    return actor.items.find( x => x.type == 'feat' && x.getFlag('materia-dnd', 'item-use-target') == itemSourceType);
}

// When a user connects, we see if they have a PC and update theirs
export function ItemUseUserConnectedHandler(user, b) {
    if (user._source?.character !== null) {
        updateActorItemUses(game.actors.get(user._source.character));
    }
}

// When a user gets updated (which can include updating your PC), update their PC
export function ItemUseUpdateUserHandler(user, updates, diff, uid) { 
    if (user._source?.character !== null) {
        updateActorItemUses(game.actors.get(user._source.character));
    }
}

// When an item gets created (leveling, manually dropping things, etc.)
export function ItemUseCreateIemHandler(item, flags, itemId) {
    if (item.parent !== null ) {
        updateActorItemUses(item.parent);
    }
}