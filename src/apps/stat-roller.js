import { ButtonFlags, Constants } from "../constants.js";

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
        let actorId = app.actor.id;
        const buttonText = game.i18n.localize('MATERIA-DND.ui.stat-roller.charsheet-titlebar-button');
        let openButton = $(`<a class="open-stat-roller"><i class="fa-solid fa-dice"></i> ${buttonText}</a>`);
        openButton.on("click", async (event) => {
            var statRollerApp = new StatRollerApp(actorId);
            statRollerApp.render(true);
        });
        html.closest('.app').find('.open-stat-roller').remove();
        let titleElement = html.closest('.app').find('.window-title');
        openButton.insertAfter(titleElement);
    }
}

class StatRollerApp extends Application {
    constructor(actorId) {
        super();
        this.actorId = actorId;
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
        data.buttonStates = this.buttonStates;
        data.discardedRoll = this.discardedRoll;
        data.rolls = this.rolls;
        return data;
    }

    activateListeners(html) {
        html.find(".roll-starting-stats-button").on("click", ev => this._rollStartingStats());
        html.find(".assign-stats-button").on("click", ev => this._assignStatsAndClose(html));

        html.find(".stat-selector").change( ev => this._onStatSelectorChange(ev, html.find('.stat-selector')));
    }

    _initialize() {
        loadTemplates({
            rollDisplay: Constants.TEMPLATES.STAT_ROLLER.ROLL_DISPLAY
        });
        this.buttonStates = {
            'roll-starting-stats-button': ButtonFlags.Enabled,
            'set-stat-to-eight-button': ButtonFlags.Disabled,
            'reroll-one-stat-button': ButtonFlags.Disabled,
            'start-over-button': ButtonFlags.Disabled,
            'assign-stats-button': ButtonFlags.Disabled,
        }
        Handlebars.registerHelper('isEnabled', function(btnName) {
            if (btnName in this.buttonStates) {
                if (this.buttonStates[btnName] === ButtonFlags.Enabled) {
                    return "enabled";
                } else if (this.buttonStates[btnName] === ButtonFlags.Disabled) {
                    return "disabled";
                } else {
                    return "";
                }
            } else {
                return "";
            }
        });
    }

    async _rollStartingStats() {
        if (this.buttonStates['roll-starting-stats-button'] == ButtonFlags.Enabled) {
            let candidateRolls = [];
            for (let i=1; i <= 7; i++) {
                let roll = new Roll("4d6kh3");
                await roll.evaluate();
                console.log(`materia-dnd | Stat Roller: Roll ${i} = ${roll.total}`);
                candidateRolls.push(roll);
            }
            candidateRolls.sort((a, b) => a.total - b.total);
            this.discardedRoll = candidateRolls.shift();
            this.rolls = candidateRolls;
            // now we assess what the next state is
            this.buttonStates['roll-starting-stats-button'] = ButtonFlags.Disabled;  // cannot roll new stats
            this.buttonStates['set-stat-to-eight-button'] = ButtonFlags.Enabled;     // can always set something to eight
            // if the stats include a negative modifier already, can assign stats
            if (candidateRolls[0].total < 10) {
                this.buttonStates['assign-stats-button'] = ButtonFlags.Enabled;
            } else {
                this.buttonStates['assign-stats-button'] = ButtonFlags.Disabled;
            }
            this.render(true);
        }
    }

    _onStatSelectorChange(ev, statSelectors) {
        let selectorId = ev.target.id;
        let selectedStat = ev.target.value;
        for (var i = 0; i < statSelectors.length; i++) {
            if (statSelectors[i].id !== selectorId && statSelectors[i].value == selectedStat) {
                statSelectors[i].value = 'Empty';
            }
        }
    }

    async _assignStatsAndClose(html) {
        if (this.buttonStates['assign-stats-button'] === ButtonFlags.Enabled) {
            let statSelectors = html.find('.stat-selector');
            let accruedStats = {};
            for (var i=0; i < statSelectors.length; i++) {
                accruedStats[statSelectors[i].value] = parseInt(html.find(`#roll-${i}-total`)[0].innerHTML.replace('Total: ', ''));
            }
            if (Object.keys(accruedStats).length === 6) {
                let actor = game.actors.get(this.actorId);
                if (actor === null) {
                    ui.notifications.warn("Unable to find appropriate actor");
                } else {
                    let updateData = {};
                    for (let stat in accruedStats) {
                        if (stat === "Empty") {
                            ui.notifications.error("Assign all ability scores before applying.");
                            return;
                        }
                        updateData[`system.abilities.${stat}.value`] = accruedStats[stat];
                    }
                    actor.update(updateData);
                }
                this.close();
            } else {
                ui.notifications.error("Assign all all ability scores before applying.");
            }
        }
    }
}