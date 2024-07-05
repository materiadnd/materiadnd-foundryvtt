import { Constants } from "../constants.js";

export function StatRollerRenderActorSheetHandler(app, html, actor) {
    // only display for PC sheets
    if (app.actor.type != 'character') { return; }
    // check if the user is either a GM or an owner of the actor
    let isOwner = false;
    // if they're a GM or if the default permission is owner, we're good
    if (game.user.isGM || actor.ownership[Constants.ACTOR_DEFAULT_OWNER_KEY] >= Constants.MINIMUM_OWNERSHIP_VALUE) {
        isOwner = true;
    } else {
        // otherwise, check if exists in perm list and if meets ownership min val
        if (game.userId in actor.ownership && actor.ownership[game.userId] >= Constants.MINIMUM_OWNERSHIP_VALUE ) {
            isOwner = true;
        }
    }
    if (!isOwner) { return; }
    // we only want to display if all of the following are true:
    // 1. the stats are not currently rolled (ie, they are currently all 10s)
    // 2. there is no class with levels on this character
    if (!Object.entries(actor.system.abilities).some( x => x[1].value != 10 ) &&
        !actor.items.some( x => x?.type == 'class' && x?.system.levels > 0)) {
        const buttonText = game.i18n.localize('MATERIA-DND.ui.stat-roller.charsheet-titlebar-button');
        let openButton = $(`<a class="open-stat-roller"><i class="fa-solid fa-dice"></i> ${buttonText}</a>`);
        openButton.on("click", async (event) => {
            var statRollerApp = new StatRollerApp();
            statRollerApp.setActor(actor._id);
            statRollerApp.render(true);
        });
        html.closest('.app').find('.open-stat-roller').remove();
        let titleElement = html.closest('.app').find('.window-title');
        openButton.insertAfter(titleElement);
    }
}

class StatRollerApp extends Application {
    constructor() {
        super();
        this._initialize();
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;
        const overrides = {
            height: "auto",
            width: "auto",
            template: Constants.TEMPLATES.STAT_ROLLER.APP,
            title: "Stat Roller",
            resizable: true,
            userId: game.userId,
        };
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        return mergedOptions;
    }

    getData() {
        let data = {};
        data.rolls = this.rolls;
        return data;
    }

    activateListeners(html) {
    }

    setActor(actorId) {
        this.actorId = actorId;
    }

    _initialize() {
    }
}