export function AddMateriaWeapons() {
    console.log("materia-dnd | Weapons: Setting up weapon properties and custom weapon types.");
    // Weapon Types
    CONFIG.DND5E.itemProperties.deft = {
        label: 'Deft',
        isPhysical: 'true'
    };
    CONFIG.DND5E.validProperties.weapon.add('deft');
    CONFIG.DND5E.itemProperties.bandolier = {
        label: 'Bandolier',
        isPhysical: 'true'
    };
    CONFIG.DND5E.validProperties.weapon.add('bandolier');
    CONFIG.DND5E.itemProperties.concealed = {
        label: 'Concealed',
        isPhysical: 'true'
    };
    CONFIG.DND5E.validProperties.weapon.add('concealed');
    CONFIG.DND5E.itemProperties.siege = {
        label: 'Siege',
        isPhysical: 'true'
    };
    CONFIG.DND5E.validProperties.weapon.add('siege');
    console.log("materia-dnd | Weapons: Added four weapon properties");
    // Weapons
    // with v4 it seems that we have to define ALL the weapons due to how the source
    // pack stuff works, this is better for us anyway as we do re-declare all the items
    CONFIG.DND5E.weaponIds.ballista = 'Compendium.materia-dnd.items.Item.matIteBallista00';
    CONFIG.DND5E.weaponIds.battleaxe = 'Compendium.materia-dnd.items.Item.matIteBattleaxe0';
    CONFIG.DND5E.weaponIds.blowgun = 'Compendium.materia-dnd.items.Item.matIteBlowgun000';
    CONFIG.DND5E.weaponIds.boomerang = 'Compendium.materia-dnd.items.Item.matIteBoomerang0';
    CONFIG.DND5E.weaponIds.club = 'Compendium.materia-dnd.items.Item.matIteClub000000';
    CONFIG.DND5E.weaponIds.compositelongbow = 'Compendium.materia-dnd.items.Item.matIteLongbowCom';
    CONFIG.DND5E.weaponIds.compositeshortbow = 'Compendium.materia-dnd.items.Item.matIteShortbowCo';
    CONFIG.DND5E.weaponIds.compositewarbow = 'Compendium.materia-dnd.items.Item.matIteWarbowComp';
    CONFIG.DND5E.weaponIds.dagger = 'Compendium.materia-dnd.items.Item.matIteDagger0000';
    CONFIG.DND5E.weaponIds.dart = 'Compendium.materia-dnd.items.Item.matIteDart000000';
    CONFIG.DND5E.weaponIds.dbscimitar = 'Compendium.materia-dnd.items.Item.matIteDBScimitar';
    CONFIG.DND5E.weaponIds.flail = 'Compendium.materia-dnd.items.Item.matIteFlail00000';
    CONFIG.DND5E.weaponIds.glaive = 'Compendium.materia-dnd.items.Item.matIteGlaive0000';
    CONFIG.DND5E.weaponIds.greataxe = 'Compendium.materia-dnd.items.Item.matIteGreataxe00';
    CONFIG.DND5E.weaponIds.greatclub = 'Compendium.materia-dnd.items.Item.matIteGreatclub0';
    CONFIG.DND5E.weaponIds.greatsword = 'Compendium.materia-dnd.items.Item.matIteGreatsword';
    CONFIG.DND5E.weaponIds.halberd = 'Compendium.materia-dnd.items.Item.matIteHalberd000';
    CONFIG.DND5E.weaponIds.handaxe = 'Compendium.materia-dnd.items.Item.matIteHandaxe000';
    CONFIG.DND5E.weaponIds.handcrossbow = 'Compendium.materia-dnd.items.Item.matIteHandCrossb';
    CONFIG.DND5E.weaponIds.heavycrossbow = 'Compendium.materia-dnd.items.Item.matIteHeavyCross';
    CONFIG.DND5E.weaponIds.heavyspear = 'Compendium.materia-dnd.items.Item.matIteSpearHeavy';
    CONFIG.DND5E.weaponIds.javelin = 'Compendium.materia-dnd.items.Item.matIteJavelin000';
    CONFIG.DND5E.weaponIds.lance = 'Compendium.materia-dnd.items.Item.matIteLance00000';
    CONFIG.DND5E.weaponIds.lightcrossbow = 'Compendium.materia-dnd.items.Item.matIteLightCross';
    CONFIG.DND5E.weaponIds.lighthammer = 'Compendium.materia-dnd.items.Item.matIteLightHamme';
    CONFIG.DND5E.weaponIds.longbow = 'Compendium.materia-dnd.items.Item.matIteLongbow000';
    CONFIG.DND5E.weaponIds.longknife = 'Compendium.materia-dnd.items.Item.matIteLongknife0';
    CONFIG.DND5E.weaponIds.longsword = 'Compendium.materia-dnd.items.Item.matIteLongsword0';
    CONFIG.DND5E.weaponIds.mace = 'Compendium.materia-dnd.items.Item.matIteMace000000';
    CONFIG.DND5E.weaponIds.maul = 'Compendium.materia-dnd.items.Item.matIteMaul000000';
    CONFIG.DND5E.weaponIds.morningstar = 'Compendium.materia-dnd.items.Item.matIteMorningsta';
    CONFIG.DND5E.weaponIds.net = 'Compendium.materia-dnd.items.Item.matIteNet0000000';
    CONFIG.DND5E.weaponIds.pike = 'Compendium.materia-dnd.items.Item.matItePike000000';
    CONFIG.DND5E.weaponIds.quarterstaff = 'Compendium.materia-dnd.items.Item.matIteQuartersta';
    CONFIG.DND5E.weaponIds.rapier = 'Compendium.materia-dnd.items.Item.matIteRapier0000';
    CONFIG.DND5E.weaponIds.rod = 'Compendium.materia-dnd.items.Item.matIteRod0000000';
    CONFIG.DND5E.weaponIds.scimitar = 'Compendium.materia-dnd.items.Item.matIteScimitar00';
    CONFIG.DND5E.weaponIds.shortbow = 'Compendium.materia-dnd.items.Item.matIteShortbow00';
    CONFIG.DND5E.weaponIds.shortspear = 'Compendium.materia-dnd.items.Item.matIteShortspear';
    CONFIG.DND5E.weaponIds.shortsword = 'Compendium.materia-dnd.items.Item.matIteShortsword';
    CONFIG.DND5E.weaponIds.sickle = 'Compendium.materia-dnd.items.Item.matIteSickle0000';
    CONFIG.DND5E.weaponIds.sling = 'Compendium.materia-dnd.items.Item.matIteSling00000';
    CONFIG.DND5E.weaponIds.spear = 'Compendium.materia-dnd.items.Item.matIteSpear00000';
    CONFIG.DND5E.weaponIds.trident = 'Compendium.materia-dnd.items.Item.matIteTrident000';
    CONFIG.DND5E.weaponIds.warbow = 'Compendium.materia-dnd.items.Item.matIteWarbow0000';
    CONFIG.DND5E.weaponIds.warhammer = 'Compendium.materia-dnd.items.Item.matIteWarhammer0';
    CONFIG.DND5E.weaponIds.warpick = 'Compendium.materia-dnd.items.Item.matIteWarPick000';
    CONFIG.DND5E.weaponIds.whip = 'Compendium.materia-dnd.items.Item.matIteWhip000000';
    CONFIG.DND5E.weaponIds.yklwa = 'Compendium.materia-dnd.items.Item.matIteYklwa00000';
    console.log("materia-dnd | Weapons: Added weapon types");
    console.log("materia-dnd | Weapons: Completed setup.");
}