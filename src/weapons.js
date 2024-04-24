Hooks.once("ready", () => {
    console.log("materia-dnd | Weapons: Setting up weapon properties and custom weapon types.");
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
    console.log("materia-dnd | Weapons: Added four weapon properties");
    // Weapons
    dnd5e.config.weaponIds.boomerang = 'Compendium.materia-dnd.items.Item.mvPDaAUuS9Dye5yi';
    dnd5e.config.weaponIds.yklwa = 'Compendium.materia-dnd.items.Item.RP4PZrElf7SrRHJf';
    dnd5e.config.weaponIds.shortspear = 'Compendium.materia-dnd.items.Item.DbEyNqIlA7PIi6Yw';
    dnd5e.config.weaponIds.longknife = 'Compendium.materia-dnd.items.Item.IQZffUSyDTd2gwTT';
    dnd5e.config.weaponIds.heavyspear = 'Compendium.materia-dnd.items.Item.tVgfZcZoi5Bvo3X7';
    dnd5e.config.weaponIds.dbscimitar = 'Compendium.materia-dnd.items.Item.wTC7m1DDYmMSdcd9';
    dnd5e.config.weaponIds.warbow = 'Compendium.materia-dnd.items.Item.5A1dzl2rhuXQnRGV';
    console.log("materia-dnd | Weapons: Added seven weapon types");
    console.log("materia-dnd | Weapons: Completed setup.");
});