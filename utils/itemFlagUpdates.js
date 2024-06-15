let compendiumPacks = [
	"materia-dnd.monster-features",
	"materia-dnd.class-and-subclass-features",
	"materia-dnd.items",
	"materia-dnd.magic-items",
	"materia-dnd.species",
	"materia-dnd.spells",
	"materia-dnd.species"
];

let flaggedItems = new Map();
for ( const packName of compendiumPacks ) {
	let pack = game.packs.get(packName);
	let packItems = await pack.getDocuments();
	for ( const item of packItems ) {
		let flag = await item.getFlag('materia-dnd', 'sourceId');
		if (flag) {
			flaggedItems.set(item.name, flag);
		}
	}
}

let itemTypes = [ 'equipment', 'weapon', 'spell' ];

for ( const actor of game.actors ) {
	for ( const item of actor.items.filter( x => itemTypes.includes(x.type) ) ) {
		let flag = await item.getFlag('materia-dnd', 'sourceId');
		if (!flag) {
			if (flaggedItems.has(item.name)) {
				let sourceId =  flaggedItems.get(item.name);
				await item.setFlag('materia-dnd', 'sourceId', sourceId);
				console.log(`Actor: ${actor.name} [${actor._id}];; Item: ${item.name} [${item._id}] => Setting sourceId: ${sourceId}`);
			}
		}
	}
}