export async function UpdateTeleBonusFlag(actor) {
    let preparedSpells = await actor.items.filter( x => x.type == 'spell' && x.system?.preparation?.prepared );
    let flagResults = await Promise.all(await preparedSpells.map( async spell => await spell.getFlag('materia-dnd', 'tele-flag') ));
    let teleSpells = flagResults.filter( x => x == 'true' ).length;
    await actor.setFlag('materia-dnd', 'tele-bonus', teleSpells);
}