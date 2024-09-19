export function AddMateriaConditions() {
    console.log("materia-dnd | Conditions: Adding custom conditions and status effects.")
    // Conditions
    dnd5e.config.conditionTypes.dazed = { 'icon': 'modules/materia-dnd/icons/statuses/noun-dazed.svg', 'label': 'Dazed', reference: 'Compendium.materia-dnd.rules.JournalEntry.MpEv2KTNEY6lLelV.JournalEntryPage.Sc9jlItT38o8N70h'};
    dnd5e.config.conditionTypes.possessed = { 'icon': 'modules/materia-dnd/icons/statuses/noun-ghost.svg', 'label': 'Possessed', reference: 'Compendium.materia-dnd.rules.JournalEntry.MpEv2KTNEY6lLelV.JournalEntryPage.zJHQBtD33KkJJunM', statuses: ['incapacitated'] };
    dnd5e.config.conditionTypes.weakened = { 'icon': 'modules/materia-dnd/icons/statuses/noun-weakness.svg', 'label': 'Weakened', reference: 'Compendium.materia-dnd.rules.JournalEntry.MpEv2KTNEY6lLelV.JournalEntryPage.AEqHmIZbN8B1DxAJ' };
    console.log("materia-dnd | Conditions: Added three custom conditions.")
    // Status effects
    CONFIG.statusEffects.push({'id': 'dazed', 'name': 'Dazed', 'icon': 'modules/materia-dnd/icons/statuses/noun-dazed.svg', 'label': 'Dazed', 'reference': 'Compendium.materia-dnd.rules.JournalEntry.MpEv2KTNEY6lLelV.JournalEntryPage.Sc9jlItT38o8N70h'});
    CONFIG.statusEffects.push({'id': 'possessed', 'name': 'Possessed', 'icon': 'modules/materia-dnd/icons/statuses/noun-ghost.svg', 'label': 'Possessed', 'reference': 'Compendium.materia-dnd.rules.JournalEntry.MpEv2KTNEY6lLelV.JournalEntryPage.zJHQBtD33KkJJunM', 'statuses': ['incapacitated']});
    CONFIG.statusEffects.push({'id': 'weakened', 'name': 'Weakened', 'icon': 'modules/materia-dnd/icons/statuses/noun-weakness.svg', 'label': 'Weakened', 'reference': 'Compendium.materia-dnd.rules.JournalEntry.MpEv2KTNEY6lLelV.JournalEntryPage.AEqHmIZbN8B1DxAJ'});
    console.log("materia-dnd | Conditions: Added three status effects.")
    // Overwriting exhaustion
    CONFIG.DND5E.conditionTypes.exhaustion.reference = "Compendium.materia-dnd.rules.JournalEntry.MpEv2KTNEY6lLelV.JournalEntryPage.9XAWvL8gnCtdez6U";
    CONFIG.DND5E.conditionTypes.exhaustion.delete("reduction");
    const exh = CONFIG.statusEffects.find(e => e.id === "exhaustion");
    foundry.utils.mergeObject(exh, CONFIG.DND5E.conditionTypes.exhaustion, { insertKeys: false });
    console.log("materia-dnd | Conditions: Overwrote existing exhaustion with Materia version.");
    // Overwriting prone
    CONFIG.DND5E.conditionTypes.prone.reference = "Compendium.materia-dnd.rules.JournalEntry.MpEv2KTNEY6lLelV.JournalEntryPage.LaLO0fpw458OrsI6";
    const prone = CONFIG.statusEffects.find( e => e.id === "prone" );
    foundry.utils.mergeObject(prone, CONFIG.DND5E.conditionTypes.prone, { insertKeys: false });
    console.log("materia-dnd | Conditions: Overwrote existing prone with Materia version.");

    console.log("materia-dnd | Conditions: Completed setup.");
}
