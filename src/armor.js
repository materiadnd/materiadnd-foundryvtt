Hooks.once("ready", () => {
    console.log("materia-dnd | Armor: Adding custom armor and shield types.");
    dnd5e.config.armorIds.gambeson = 'Compendium.materia-dnd.items.Item.3mC7XVd9nDuogp91';
    dnd5e.config.armorIds.jerkin = 'Compendium.materia-dnd.items.Item.bKmiINDMl8LjgPfm';
    dnd5e.config.armorIds.lamellar = 'Compendium.materia-dnd.items.Item.6swObZ50ac9T81Ht';
    dnd5e.config.armorIds.hauberk = 'Compendium.materia-dnd.items.Item.EsZRntTx7vgRfEh1';
    dnd5e.config.armorIds.brigandine = 'Compendium.materia-dnd.items.Item.2CzwK7NTkGYPGQVg';
    dnd5e.config.armorIds.cuirass = 'Compendium.materia-dnd.items.Item.M0f5u7FLt9ierGbz';
    dnd5e.config.shieldIds.buckler = 'Compendium.materia-dnd.items.Item.v9puBCt5FEyZokks';
    dnd5e.config.shieldIds.tower = 'Compendium.materia-dnd.items.Item.4SwPNdzTGgKSspED';
    console.log("materia-dnd | Armor: Added six armor types and two shield types.");
    console.log("materia-dnd | Armor: Completed setup.");
});