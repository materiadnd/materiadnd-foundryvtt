console.log("materia-dnd | Loading started");
Hooks.once("ready", () => {
    if (typeof dnd5e !== 'undefined') {
        // Conditions
        dnd5e.config.conditionTypes.dazed = { 'icon': 'modules/materia-dnd/icons/statuses/noun-dazed.svg', 'label': 'Dazed', reference: 'Compendium.materia-dnd.rules.JournalEntry.MpEv2KTNEY6lLelV.JournalEntryPage.Sc9jlItT38o8N70h'};
        dnd5e.config.conditionTypes.possessed = { 'icon': 'modules/materia-dnd/icons/statuses/noun-ghost.svg', 'label': 'Possessed', reference: 'Compendium.materia-dnd.rules.JournalEntry.MpEv2KTNEY6lLelV.JournalEntryPage.zJHQBtD33KkJJunM', statuses: ['incapacitated'] };
        dnd5e.config.conditionTypes.weakened = { 'icon': 'modules/materia-dnd/icons/statuses/noun-weakness.svg', 'label': 'Weakened', reference: 'Compendium.materia-dnd.rules.JournalEntry.MpEv2KTNEY6lLelV.JournalEntryPage.AEqHmIZbN8B1DxAJ' };
        console.log("materia-dnd | Added three condition types");
        // Weapon Types
        dnd5e.config.itemProperties.deft = {
            label: 'Deft',
            isPhysical: 'true'
        };
        dnd5e.config.validProperties.weapon.add('deft');
        dnd5e.config.itemProperties.bandolier = {
            label: 'Bandolier',
            isPhysical: 'true'
        };
        dnd5e.config.validProperties.weapon.add('bandolier');
        dnd5e.config.itemProperties.concealed = {
            label: 'Concealed',
            isPhysical: 'true'
        };
        dnd5e.config.validProperties.weapon.add('concealed');
        dnd5e.config.itemProperties.siege = {
            label: 'Siege',
            isPhysical: 'true'
        };
        dnd5e.config.validProperties.weapon.add('siege');
        console.log("materia-dnd | Added four weapon properties");
        // Weapons
        dnd5e.config.weaponIds.boomerang = 'Compendium.materia-dnd.items.Item.mvPDaAUuS9Dye5yi';
        dnd5e.config.weaponIds.yklwa = 'Compendium.materia-dnd.items.Item.RP4PZrElf7SrRHJf';
        dnd5e.config.weaponIds.shortspear = 'Compendium.materia-dnd.items.Item.DbEyNqIlA7PIi6Yw';
        dnd5e.config.weaponIds.longknife = 'Compendium.materia-dnd.items.Item.IQZffUSyDTd2gwTT';
        dnd5e.config.weaponIds.heavyspear = 'Compendium.materia-dnd.items.Item.tVgfZcZoi5Bvo3X7';
        dnd5e.config.weaponIds.dbscimitar = 'Compendium.materia-dnd.items.Item.wTC7m1DDYmMSdcd9';
        dnd5e.config.weaponIds.warbow = 'Compendium.materia-dnd.items.Item.5A1dzl2rhuXQnRGV';
        console.log("materia-dnd | Added seven weapon types");
        // Armors
        dnd5e.config.armorIds.gambeson = 'Compendium.materia-dnd.items.Item.3mC7XVd9nDuogp91';
        dnd5e.config.armorIds.jerkin = 'Compendium.materia-dnd.items.Item.bKmiINDMl8LjgPfm';
        dnd5e.config.armorIds.lamellar = 'Compendium.materia-dnd.items.Item.6swObZ50ac9T81Ht';
        dnd5e.config.armorIds.hauberk = 'Compendium.materia-dnd.items.Item.EsZRntTx7vgRfEh1';
        dnd5e.config.armorIds.brigandine = 'Compendium.materia-dnd.items.Item.2CzwK7NTkGYPGQVg';
        dnd5e.config.armorIds.cuirass = 'Compendium.materia-dnd.items.Item.M0f5u7FLt9ierGbz';
        dnd5e.config.shieldIds.buckler = 'Compendium.materia-dnd.items.Item.v9puBCt5FEyZokks';
        dnd5e.config.shieldIds.tower = 'Compendium.materia-dnd.items.Item.4SwPNdzTGgKSspED';
        console.log("materia-dnd | Added six armor types and two shield types");
    }
    CONFIG.statusEffects.push({'id': 'dazed', 'name': 'Dazed', 'icon': 'modules/materia-dnd/icons/statuses/noun-dazed.svg', 'label': 'Dazed', 'reference': 'Compendium.materia-dnd.rules.JournalEntry.MpEv2KTNEY6lLelV.JournalEntryPage.Sc9jlItT38o8N70h'});
    CONFIG.statusEffects.push({'id': 'possessed', 'name': 'Possessed', 'icon': 'modules/materia-dnd/icons/statuses/noun-ghost.svg', 'label': 'Possessed', 'reference': 'Compendium.materia-dnd.rules.JournalEntry.MpEv2KTNEY6lLelV.JournalEntryPage.zJHQBtD33KkJJunM', 'statuses': ['incapacitated']});
    CONFIG.statusEffects.push({'id': 'weakened', 'name': 'Weakened', 'icon': 'modules/materia-dnd/icons/statuses/noun-weakness.svg', 'label': 'Weakened', 'reference': 'Compendium.materia-dnd.rules.JournalEntry.MpEv2KTNEY6lLelV.JournalEntryPage.AEqHmIZbN8B1DxAJ'});
});

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
    }
});
console.log("materia-dnd | Loading completed");