import { Constants } from "./constants.js"

export const THIRD_PACT_ABBR = "thirdpact";
export const THIRD_PACT_LABEL = "Third Pact";

const PACT_CASTER_TYPES = ['pact', THIRD_PACT_ABBR];

function getPactLevels(actor) {
    // NB: This whole function is a bit "overdone", it presumes that full pact caster progression
    // and one-third pact caster progression can live either on classes or subclasses, when in reality
    // only one class uses pact caster progression and only one subclass uses one-third pact caster
    // progression.

    // grab classes with pact caster progression
    let pactClasses = actor.items
        .filter( x => x.type === 'class' )
        .filter( x => x.system?.levels > 0 &&  PACT_CASTER_TYPES.includes( x.system?.spellcasting.progression ))
        .map( x => ({ progression: x.system?.spellcasting.progression, levels: x.system?.levels }));
    // grab subclasses with pact caster progression 
    let pactSubclasses = actor.items
        .filter( x => x.type === 'subclass' )
        .filter( x => PACT_CASTER_TYPES.includes( x.system?.spellcasting.progression ))
        .map( x => ({ progression: x.system?.spellcasting.progression,
                      levels: actor.items.find( c => c.system?.identifier === x.system?.classIdentifier ).system.levels }));
    // append them together
    let pactClassesAndSubclasses = pactClasses.concat(pactSubclasses);
    // walk the combined list and add up level count for each pact progression type
    let thirdCasterLevels = pactClassesAndSubclasses.reduce(
        (acc, pactClassOrSubclass) => {
            if (pactClassOrSubclass.progression == THIRD_PACT_ABBR) { return acc + pactClassOrSubclass.levels; } else { return acc; }
        }, 0);
    let fullCasterLevels = pactClassesAndSubclasses.reduce(
        (acc, pactClassOrSubclass) => {
            if (pactClassOrSubclass.progression == 'pact') { return acc + pactClassOrSubclass.levels; } else { return acc; }
        }, 0);
    return { fullCasterLevels: fullCasterLevels, thirdCasterLevels: thirdCasterLevels };
}

export function derivePactSlots(actor) {
    if ( actor.type !== 'character' ) return;
    if ( !isPactCaster(actor) ) return;
    let pactLevels = getPactLevels(actor);
    let effectiveCasterLevel = pactLevels.fullCasterLevels + Math.ceil(pactLevels.thirdCasterLevels / 3);
    if (effectiveCasterLevel > 0) {
        // pact spell level = Math.min((pactLevels + 1) / 2, 5) (normal progression is at 1/3/5/7/9, capping at 5)
        actor.system.spells.pact.level = Math.floor(Math.min((effectiveCasterLevel + 1) / 2, 5));
        // slot count calc is just a lookup table essentially
        let slotCount = 1;
        if (effectiveCasterLevel >= 2 && effectiveCasterLevel <= 9){
            slotCount = 2;
        } else if (effectiveCasterLevel >= 10 && effectiveCasterLevel <= 14) {
            slotCount = 3;
        } else if (effectiveCasterLevel >= 15 && effectiveCasterLevel <= 18) {
            slotCount = 4;
        } else if (effectiveCasterLevel >= 19){
            slotCount = 5;
        }
        if (pactLevels.thirdCasterLevels == 20) {  // special case, full 20 levels in 1/3 caster gets 3 slots
            slotCount = 3;
        }
        actor.system.spells.pact.value = actor.system.spells.pact.value ?? slotCount;
        actor.system.spells.pact.max = slotCount;
    }
}

export function refreshPactSlots() {
    game.actors.forEach( x => refreshActorPactSlots(x) );
}

function refreshActorPactSlots(actor) {
    if ( actor.type !== 'character' ) {
        return;
    }
    if ( isPactCaster(actor) ) {
        derivePactSlots(actor);
        actor.render(false);
    }
}

function isPactCaster(actor) {
    // if any top-level classes have any of the pact caster progression types, short-circuit return true
    if (PACT_CASTER_TYPES.some( x => x == actor.items
                                .filter( x => x.type === 'class' )
                                .filter( x => x.system?.levels > 0 )
                                .map( x => x.system?.spellcasting?.progression ))
    ) return true;
    // now we have to check subclasses, but they don't have levels so we have to walk up find the parent class item
    // and make sure it has levels
    let pactSubclassClassNames = actor.items
        .filter( x => x.type === 'subclass' )
        .filter( x => PACT_CASTER_TYPES.includes( x.system?.spellcasting?.progression ))
        .map( x => x.system?.classIdentifier);
    let pactClasses = actor.items
        .filter( x => x.type === 'class' && pactSubclassClassNames.some( sc => x.system?.identifier == sc ));
    return pactClasses.length > 0;
}

// Add custom "third pact" spell progression
export function SpellcastingAddThirdPactProgression() {
    console.log('materia-dnd | Third-Pact: Registering third-pact spell progression type.');
    dnd5e.config.spellProgression[THIRD_PACT_ABBR] = THIRD_PACT_LABEL;
    console.log('materia-dnd | Third-Pact: Configuration setup complete.');
}

// monkey-patch the prepareDerivedData function of the Actor5e type
export function AddThirdPactCaster() {
    console.log('materia-dnd | Third-Pact: Patching prepareDerivedData function of Actor5e datatype.');
    let libWrapper = globalThis.libWrapper;
    if (libWrapper != undefined) {
        console.log('materia-dnd | Third-Pact: libWrapper detected, patching with libWrapper');
        libWrapper.register(Constants.MODULE_ID, 'dnd5e.documents.Actor5e.prototype.prepareDerivedData', function(wrapped, ...args) {
            derivePactSlots(args);
            let result = wrapped(args);
            return result;
        }, "WRAPPER"); 
    } else {
        console.log('materia-dnd | Third-Pact: no libWrapper detected, brute-force patching');
        const origFunc = dnd5e.documents.Actor5e.prototype.prepareDerivedData;
        dnd5e.documents.Actor5e.prototype.prepareDerivedData = function() {
            origFunc.call(this);
            derivePactSlots(this);
        }
    }
}