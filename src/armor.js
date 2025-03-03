export function AddMateriaArmor() {
    console.log("materia-dnd | Armor: Adding custom armor and shield types.");
    CONFIG.DND5E.armorIds.breastplate = 'Compendium.materia-dnd.items.Item.X7nnIdC081gjZe30';
    CONFIG.DND5E.armorIds.brigandine = 'Compendium.materia-dnd.items.Item.2CzwK7NTkGYPGQVg';
    CONFIG.DND5E.armorIds.chainmail = 'Compendium.materia-dnd.items.Item.39xChOi2TDLpCsqH';
    CONFIG.DND5E.armorIds.cuirass = 'Compendium.materia-dnd.items.Item.M0f5u7FLt9ierGbz';
    CONFIG.DND5E.armorIds.gambeson = 'Compendium.materia-dnd.items.Item.3mC7XVd9nDuogp91';
    CONFIG.DND5E.armorIds.halfplate = 'Compendium.materia-dnd.items.Item.IpWm4bv45PqJzYZi';
    CONFIG.DND5E.armorIds.hauberk = 'Compendium.materia-dnd.items.Item.EsZRntTx7vgRfEh1';
    CONFIG.DND5E.armorIds.hide = 'Compendium.materia-dnd.items.Item.SvAfqxMUDyyWyFJQ';
    CONFIG.DND5E.armorIds.jerkin = 'Compendium.materia-dnd.items.Item.bKmiINDMl8LjgPfm';
    CONFIG.DND5E.armorIds.lamellar = 'Compendium.materia-dnd.items.Item.6swObZ50ac9T81Ht';
    CONFIG.DND5E.armorIds.leather = 'Compendium.materia-dnd.items.Item.EPJDDYc60u9ARf2D';
    CONFIG.DND5E.armorIds.mailshirt = 'Compendium.materia-dnd.items.Item.u2OhBq9qi8b08CU5';
    CONFIG.DND5E.armorIds.padded = 'Compendium.materia-dnd.items.Item.nohkOiIXBX4ONISe';
    CONFIG.DND5E.armorIds.plate = 'Compendium.materia-dnd.items.Item.SrH5qKzOiVV4Opxr';
    CONFIG.DND5E.armorIds.ringmail = 'Compendium.materia-dnd.items.Item.ixdQKoSObyZMYPTY';
    CONFIG.DND5E.armorIds.scalemail = 'Compendium.materia-dnd.items.Item.SMsv6uHDL4quUjLs';
    CONFIG.DND5E.armorIds.splint = 'Compendium.materia-dnd.items.Item.yyy7xYloJS1YNaqd';
    CONFIG.DND5E.armorIds.studded = 'Compendium.materia-dnd.items.Item.6RB6SbCsqgl9m2cP';
    CONFIG.DND5E.shieldIds.buckler = 'Compendium.materia-dnd.items.Item.v9puBCt5FEyZokks';
    CONFIG.DND5E.shieldIds.shield = 'Compendium.materia-dnd.items.Item.YMppdTgy821JBZHn';
    CONFIG.DND5E.shieldIds.tower = 'Compendium.materia-dnd.items.Item.4SwPNdzTGgKSspED';
    console.log("materia-dnd | Armor: Added armor types and shield types.");
    console.log("materia-dnd | Armor: Adding custom armor calculations");
    // Arcane Armor calcs for various armors (INT replaces DEX)
    // Padded, Gambeson
    CONFIG.DND5E.armorClasses.arcaneArmorLight1 = {
        label: "Arcane Armor, 11 + dex",
        formula: "11 + @abilities.int.mod"
     };
     // Leather
    CONFIG.DND5E.armorClasses.arcaneArmorLight2 = {
        label: "Arcane Armor, 11 + dex (min 1)",
        formula: "11 + max(1, @abilities.int.mod)"
     };
     // Leather Jerkin
    CONFIG.DND5E.armorClasses.arcaneArmorLight3 = {
        label: "Arcane Armor, 12 + dex (min 1)",
        formula: "12 + max(1, @abilities.int.mod)"
     };
     // Studded Leather
    CONFIG.DND5E.armorClasses.arcaneArmorLight4 = {
        label: "Arcane Armor, 12 + dex",
        formula: "12 + @abilities.int.mod"
     };
     // Hide 
    CONFIG.DND5E.armorClasses.arcaneArmorMedium1 = {
        label: "Arcane Armor, 12 + dex (max 2)",
        formula: "12 + min(2, @abilities.int.mod)"
     };
     // Mail Shirt 
    CONFIG.DND5E.armorClasses.arcaneArmorMedium2 = {
        label: "Arcane Armor, 13 + dex (max 2)",
        formula: "13 + min(2, @abilities.int.mod)"
     };
     // Scale Mail, Lamellar, Hauberk, Breastplate
    CONFIG.DND5E.armorClasses.arcaneArmorMedium3 = {
        label: "Arcane Armor, 14 + dex (max 2)",
        formula: "14 + min(2, @abilities.int.mod)"
     };
     // Brigandine
    CONFIG.DND5E.armorClasses.arcaneArmorMedium4 = {
        label: "Arcane Armor, 15 + dex (max 2)",
        formula: "15 + min(2, @abilities.int.mod)"
     };
    console.log("materia-dnd | Armor: Added custom armor calculations");
    console.log("materia-dnd | Armor: Completed setup.");
}