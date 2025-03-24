export function AddMateriaArmor() {
    console.log("materia-dnd | Armor: Adding custom armor and shield types.");
    CONFIG.DND5E.armorIds.breastplate = 'Compendium.materia-dnd.items.Item.matIteBreastplat';
    CONFIG.DND5E.armorIds.brigandine = 'Compendium.materia-dnd.items.Item.matIteBrigandine';
    CONFIG.DND5E.armorIds.chainmail = 'Compendium.materia-dnd.items.Item.matIteChainMail0';
    CONFIG.DND5E.armorIds.cuirass = 'Compendium.materia-dnd.items.Item.matIteCuirass000';
    CONFIG.DND5E.armorIds.gambeson = 'Compendium.materia-dnd.items.Item.matIteGambeson00';
    CONFIG.DND5E.armorIds.halfplate = 'Compendium.materia-dnd.items.Item.matIteCuirass000';
    CONFIG.DND5E.armorIds.hauberk = 'Compendium.materia-dnd.items.Item.matIteHauberk000';
    CONFIG.DND5E.armorIds.hide = 'Compendium.materia-dnd.items.Item.matIteHideArmor0';
    CONFIG.DND5E.armorIds.jerkin = 'Compendium.materia-dnd.items.Item.matIteLeatherJer';
    CONFIG.DND5E.armorIds.lamellar = 'Compendium.materia-dnd.items.Item.matIteLamellarAr';
    CONFIG.DND5E.armorIds.leather = 'Compendium.materia-dnd.items.Item.matIteLeatherArm';
    CONFIG.DND5E.armorIds.mailshirt = 'Compendium.materia-dnd.items.Item.matIteMailShirt0';
    CONFIG.DND5E.armorIds.padded = 'Compendium.materia-dnd.items.Item.matItePaddedArmo';
    CONFIG.DND5E.armorIds.plate = 'Compendium.materia-dnd.items.Item.matItePlateArmor';
    CONFIG.DND5E.armorIds.ringmail = 'Compendium.materia-dnd.items.Item.matIteRingMail00';
    CONFIG.DND5E.armorIds.scalemail = 'Compendium.materia-dnd.items.Item.matIteScaleMail0';
    CONFIG.DND5E.armorIds.splint = 'Compendium.materia-dnd.items.Item.matIteSplintArmo';
    CONFIG.DND5E.armorIds.studded = 'Compendium.materia-dnd.items.Item.matIteStuddedLea';
    CONFIG.DND5E.shieldIds.buckler = 'Compendium.materia-dnd.items.Item.matIteBuckler000';
    CONFIG.DND5E.shieldIds.shield = 'Compendium.materia-dnd.items.Item.matIteShield0000';
    CONFIG.DND5E.shieldIds.tower = 'Compendium.materia-dnd.items.Item.matIteShieldTowe';
    console.log("materia-dnd | Armor: Added armor types and shield types.");
    console.log("materia-dnd | Armor: Adding custom armor calculations");
    // Arcane Armor calcs for various armors (INT replaces DEX)
    // Padded, Gambeson
    CONFIG.DND5E.armorClasses.arcaneArmorLight1 = {
        label: "Arcane Armor, 11 + int",
        formula: "11 + @abilities.int.mod"
     };
     // Leather
    CONFIG.DND5E.armorClasses.arcaneArmorLight2 = {
        label: "Arcane Armor, 11 + int (min 1)",
        formula: "11 + max(1, @abilities.int.mod)"
     };
     // Leather Jerkin
    CONFIG.DND5E.armorClasses.arcaneArmorLight3 = {
        label: "Arcane Armor, 12 + int (min 1)",
        formula: "12 + max(1, @abilities.int.mod)"
     };
     // Studded Leather
    CONFIG.DND5E.armorClasses.arcaneArmorLight4 = {
        label: "Arcane Armor, 12 + int",
        formula: "12 + @abilities.int.mod"
     };
     // Hide 
    CONFIG.DND5E.armorClasses.arcaneArmorMedium1 = {
        label: "Arcane Armor, 12 + int (max 2)",
        formula: "12 + min(2, @abilities.int.mod)"
     };
     // Mail Shirt 
    CONFIG.DND5E.armorClasses.arcaneArmorMedium2 = {
        label: "Arcane Armor, 13 + int (max 2)",
        formula: "13 + min(2, @abilities.int.mod)"
     };
     // Scale Mail, Lamellar, Hauberk, Breastplate
    CONFIG.DND5E.armorClasses.arcaneArmorMedium3 = {
        label: "Arcane Armor, 14 + int (max 2)",
        formula: "14 + min(2, @abilities.int.mod)"
     };
     // Brigandine
    CONFIG.DND5E.armorClasses.arcaneArmorMedium4 = {
        label: "Arcane Armor, 15 + int (max 2)",
        formula: "15 + min(2, @abilities.int.mod)"
     };
    console.log("materia-dnd | Armor: Added custom armor calculations");
    console.log("materia-dnd | Armor: Completed setup.");
}