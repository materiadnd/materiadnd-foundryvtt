export function Replace5eSourcePacks() {
    console.log("materia-dnd | Source packs:  Replacing 5e source packs for classes/species/backgrounds.");
    CONFIG.DND5E.sourcePacks.CLASSES = 'materia-dnd.classes';
    CONFIG.DND5E.sourcePacks.RACES = 'materia-dnd.species';
    CONFIG.DND5E.sourcePacks.BACKGROUNDS = 'materia-dnd.backgrounds';
    CONFIG.DND5E.sourcePacks.ITEMS = 'materia-dnd.items';
    console.log("materia-dnd | Source packs:  Replaced source packs.");
}