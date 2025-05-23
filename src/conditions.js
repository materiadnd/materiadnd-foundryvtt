export function AddMateriaConditions() {
    console.log("materia-dnd | Conditions: Adding custom conditions.")
    // Conditions
    CONFIG.DND5E.conditionTypes.dazed = { 'icon': 'modules/materia-dnd/icons/statuses/noun-dazed.svg', 'label': 'Dazed', reference: 'Compendium.materia-dnd.rules.JournalEntry.matJrnConditions.JournalEntryPage.matJrnCondDazed0'};
    CONFIG.DND5E.conditionTypes.possessed = { 'icon': 'modules/materia-dnd/icons/statuses/noun-ghost.svg', 'label': 'Possessed', reference: 'Compendium.materia-dnd.rules.JournalEntry.matJrnConditions.JournalEntryPage.matJrnCondPosses', statuses: ['incapacitated'] };
    CONFIG.DND5E.conditionTypes.weakened = { 'icon': 'modules/materia-dnd/icons/statuses/noun-weakness.svg', 'label': 'Weakened', reference: 'Compendium.materia-dnd.rules.JournalEntry.matJrnConditions.JournalEntryPage.matJrnCondWeaken' };
    console.log("materia-dnd | Conditions: Added three custom conditions.")
    // Overwriting exhaustion
    CONFIG.DND5E.conditionTypes.exhaustion.reference = "Compendium.materia-dnd.rules.JournalEntry.matJrnConditions.JournalEntryPage.matJrnCondExhaus";
    delete CONFIG.DND5E.conditionTypes.exhaustion.reduction;
    const exh = CONFIG.statusEffects.find(e => e.id === "exhaustion");
    foundry.utils.mergeObject(exh, CONFIG.DND5E.conditionTypes.exhaustion, { insertKeys: false });
    console.log("materia-dnd | Conditions: Overwrote existing exhaustion with Materia version.");
    // Overwriting prone
    CONFIG.DND5E.conditionTypes.prone.reference = "Compendium.materia-dnd.rules.JournalEntry.matJrnConditions.JournalEntryPage.matJrnCondProne0";
    const prone = CONFIG.statusEffects.find( e => e.id === "prone" );
    foundry.utils.mergeObject(prone, CONFIG.DND5E.conditionTypes.prone, { insertKeys: false });
    console.log("materia-dnd | Conditions: Overwrote existing prone with Materia version.");

    console.log("materia-dnd | Conditions: Completed setup.");
}

export function AddMateriaStatusEffects() {
    // Status effects
    console.log("materia-dnd | Status Effects: Adding custom status effects.")
    CONFIG.statusEffects.push({'id': 'dazed', 'name': 'Dazed', 'icon': 'modules/materia-dnd/icons/statuses/noun-dazed.svg', 'label': 'Dazed', 'reference': 'Compendium.materia-dnd.rules.JournalEntry.matJrnConditions.JournalEntryPage.matJrnCondDazed0'});
    CONFIG.statusEffects.push({'id': 'possessed', 'name': 'Possessed', 'icon': 'modules/materia-dnd/icons/statuses/noun-ghost.svg', 'label': 'Possessed', 'reference': 'Compendium.materia-dnd.rules.JournalEntry.matJrnConditions.JournalEntryPage.matJrnCondPosses', 'statuses': ['incapacitated']});
    CONFIG.statusEffects.push({'id': 'weakened', 'name': 'Weakened', 'icon': 'modules/materia-dnd/icons/statuses/noun-weakness.svg', 'label': 'Weakened', 'reference': 'Compendium.materia-dnd.rules.JournalEntry.matJrnConditions.JournalEntryPage.matJrnCondWeaken'});
    console.log("materia-dnd | Status Effects: Added three status effects.")
}