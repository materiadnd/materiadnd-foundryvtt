import { LocusManagerApp } from "./apps/locus";

Hooks.on('renderItemSheet5e', (itemSheet, html, data) => {
    console.log('materia-dnd | Inititalizing Locus Mgr UI');
    // put toggle for settings here

    // filter on itemSheet.object.type:
    //   consumable  (wand)
    //   weapon      (all weapons, staves, etc.)
    //   equipment   (all armor, trinkets)
    //   tool     
    const buttonText = game.i18n.localize('MATERIA-DND.locus-manager.ui.charsheet-titlebar-button');
    let openButton = $(`<a class="open-locus-mgr"><i calss="fas fa-layer-group"></i> ${buttonText}</a>`);
    openButton.click(async (evt) => {
        var locusMgr = new LocusManagerApp();
        locusMgr.render(true);
    });
    html.closest('.app').find('.open-locus-mgr').remove();
    let titleElement = html.closest('.app').find('.window-title');
    openButton.insertAfter(titleElement);
})