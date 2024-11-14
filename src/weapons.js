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
    CONFIG.DND5E.weaponIds.ballista = 'Compendium.materia-dnd.items.Item.h3S4h9KpVFyea2H8';
    CONFIG.DND5E.weaponIds.battleaxe = 'Compendium.materia-dnd.items.Item.4PEDhT0W73qVCQwG';
    CONFIG.DND5E.weaponIds.blowgun = 'Compendium.materia-dnd.items.Item.bn1XZJf1SvrIXJvi';
    CONFIG.DND5E.weaponIds.boomerang = 'Compendium.materia-dnd.items.Item.mvPDaAUuS9Dye5yi';
    CONFIG.DND5E.weaponIds.club = 'Compendium.materia-dnd.items.Item.IBOBg57h1rS5LT0L';
    CONFIG.DND5E.weaponIds.compositelongbow = 'Compendium.materia-dnd.items.Item.v7i46UArPyNRQB8q';
    CONFIG.DND5E.weaponIds.compositeshortbow = 'Compendium.materia-dnd.items.Item.1AXWbF5zkl7sQJMc';
    CONFIG.DND5E.weaponIds.compositewarbow = 'Compendium.materia-dnd.items.Item.x5MJJMG9LXBLSadC';
    CONFIG.DND5E.weaponIds.dagger = 'Compendium.materia-dnd.items.Item.QIC5XIOyKn6396Qb';
    CONFIG.DND5E.weaponIds.dart = 'Compendium.materia-dnd.items.Item.VbrOoD2OCdIEd8Bs';
    CONFIG.DND5E.weaponIds.dbscimitar = 'Compendium.materia-dnd.items.Item.wTC7m1DDYmMSdcd9';
    CONFIG.DND5E.weaponIds.flail = 'Compendium.materia-dnd.items.Item.kOfzQNSNQoFl8yiz';
    CONFIG.DND5E.weaponIds.glaive = 'Compendium.materia-dnd.items.Item.xA2wTVzzG00eTJSj';
    CONFIG.DND5E.weaponIds.greataxe = 'Compendium.materia-dnd.items.Item.KmystPqNBEGngdOM';
    CONFIG.DND5E.weaponIds.greatclub = 'Compendium.materia-dnd.items.Item.P1nagdTDpMWyqIWW';
    CONFIG.DND5E.weaponIds.greatsword = 'Compendium.materia-dnd.items.Item.qMd9ZUNXLPsZgUQt';
    CONFIG.DND5E.weaponIds.halberd = 'Compendium.materia-dnd.items.Item.efR9AzC00WjbY60F';
    CONFIG.DND5E.weaponIds.handaxe = 'Compendium.materia-dnd.items.Item.SdUjNMAAEUBR0kvv';
    CONFIG.DND5E.weaponIds.handcrossbow = 'Compendium.materia-dnd.items.Item.8vv7EXMWFdtZGfus';
    CONFIG.DND5E.weaponIds.heavycrossbow = 'Compendium.materia-dnd.items.Item.QsmzRiwrLZmlnVqS';
    CONFIG.DND5E.weaponIds.heavyspear = 'Compendium.materia-dnd.items.Item.tVgfZcZoi5Bvo3X7';
    CONFIG.DND5E.weaponIds.javelin = 'Compendium.materia-dnd.items.Item.l212lSqnrErx9OC6';
    CONFIG.DND5E.weaponIds.lance = 'Compendium.materia-dnd.items.Item.B9G1PNkA4zHecEsJ';
    CONFIG.DND5E.weaponIds.lightcrossbow = 'Compendium.materia-dnd.items.Item.wTnY23M2KdNeFQDD';
    CONFIG.DND5E.weaponIds.lighthammer = 'Compendium.materia-dnd.items.Item.jwz9F17FvGkcNWTk';
    CONFIG.DND5E.weaponIds.longbow = 'Compendium.materia-dnd.items.Item.6VTVw4Lf5RAiwtkk';
    CONFIG.DND5E.weaponIds.longknife = 'Compendium.materia-dnd.items.Item.IQZffUSyDTd2gwTT';
    CONFIG.DND5E.weaponIds.longsword = 'Compendium.materia-dnd.items.Item.fO9oK0nFPUoxJIJo';
    CONFIG.DND5E.weaponIds.mace = 'Compendium.materia-dnd.items.Item.ghgPVMU5TkJYzqgj';
    CONFIG.DND5E.weaponIds.maul = 'Compendium.materia-dnd.items.Item.6Ql58woJbZeevc7F';
    CONFIG.DND5E.weaponIds.morningstar = 'Compendium.materia-dnd.items.Item.ifCRSaXPLYHWos2d';
    CONFIG.DND5E.weaponIds.net = 'Compendium.materia-dnd.items.Item.Ro2Mx74rqY4ku0Zd';
    CONFIG.DND5E.weaponIds.pike = 'Compendium.materia-dnd.items.Item.BMXiuCpnW8vnvyxU';
    CONFIG.DND5E.weaponIds.quarterstaff = 'Compendium.materia-dnd.items.Item.UOPrbbHNNDxemOl2';
    CONFIG.DND5E.weaponIds.rapier = 'Compendium.materia-dnd.items.Item.xbdtYE56Z6DQAfnU';
    CONFIG.DND5E.weaponIds.rod = 'Compendium.materia-dnd.items.Item.qNvReIaQWeccai20';
    CONFIG.DND5E.weaponIds.scimitar = 'Compendium.materia-dnd.items.Item.aZS30KyhcTQ9YqIo';
    CONFIG.DND5E.weaponIds.shortbow = 'Compendium.materia-dnd.items.Item.7XatA2BiRkkSdvti';
    CONFIG.DND5E.weaponIds.shortspear = 'Compendium.materia-dnd.items.Item.DbEyNqIlA7PIi6Yw';
    CONFIG.DND5E.weaponIds.shortsword = 'Compendium.materia-dnd.items.Item.9OEHcK2D3AGNzvx6';
    CONFIG.DND5E.weaponIds.sickle = 'Compendium.materia-dnd.items.Item.VEzKW85cyci9w6cJ';
    CONFIG.DND5E.weaponIds.sling = 'Compendium.materia-dnd.items.Item.z2gJElinYn1QokNk';
    CONFIG.DND5E.weaponIds.spear = 'Compendium.materia-dnd.items.Item.2JJEeIYZbkLng5O3';
    CONFIG.DND5E.weaponIds.trident = 'Compendium.materia-dnd.items.Item.pzPGIVUhuWTgPtqZ';
    CONFIG.DND5E.weaponIds.warbow = 'Compendium.materia-dnd.items.Item.5A1dzl2rhuXQnRGV';
    CONFIG.DND5E.weaponIds.warhammer = 'Compendium.materia-dnd.items.Item.Cgm0d04iBdUgWuq8';
    CONFIG.DND5E.weaponIds.warpick = 'Compendium.materia-dnd.items.Item.VVtUBcU7iBs8klbM';
    CONFIG.DND5E.weaponIds.whip = 'Compendium.materia-dnd.items.Item.H6Okcdxn79hWb9ni';
    CONFIG.DND5E.weaponIds.yklwa = 'Compendium.materia-dnd.items.Item.RP4PZrElf7SrRHJf';
    console.log("materia-dnd | Weapons: Added weapon types");
    console.log("materia-dnd | Weapons: Completed setup.");
}