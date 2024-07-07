import { ButtonFlags, Constants } from "../constants.js";

export function StatRollerRenderActorSheetHandler(app, html, actor) {
    // only display for PC sheets
    if (app.actor.type != 'character') { return; }
    // check if the user is either a GM or an owner of the actor
    let isOwner = false;
    // if they're a GM or if the default permission is owner, we're good
    if (game.user.isGM || app.actor.ownership[Constants.ACTOR_DEFAULT_OWNER_KEY] >= Constants.MINIMUM_OWNERSHIP_VALUE) {
        isOwner = true;
    } else {
        // otherwise, check if exists in perm list and if meets ownership min val
        if (game.userId in app.actor.ownership && app.actor.ownership[game.userId] >= Constants.MINIMUM_OWNERSHIP_VALUE ) {
            isOwner = true;
        }
    }
    if (!isOwner) { return; }
    // we only want to display if all of the following are true:
    // 1. the stats are not currently rolled (ie, they are currently all 10s)
    // 2. there is no class with levels on this character
    if (!Object.entries(app.actor.system.abilities).some( x => x[1].value != 10 ) &&
        !actor.items.some( x => x?.type == 'class' && x?.system.levels > 0)) {
        let actorId = app.actor.id;
        const buttonText = game.i18n.localize(`${Constants.MODULE_ID}.ui.stat-roller.charsheet-titlebar-button`);
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

function sumRolls(rolls) {
    return rolls.map(val => val.isIgnored ? 0 : val.roll.total).reduce((acc, val) => acc + val, 0);
}

class StatRollData {
    constructor(roll, index, isIgnored = false) {
        this.roll = roll;
        this.index = index;
        this.isIgnored = isIgnored;
        this.isManual = false;
    }
}


class StatRollerApp extends Application {
    constructor(actorId) {
        super();
        this.actorId = actorId;
        this.rollClickEight = true;  // flag so we know what clicking on a roll means
        this._initialize();
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;
        const overrides = {
            height: "auto",
            width: "920",
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
        data.buttonText = this.buttonText;
        data.message = this.message;
        data.rolls = this.rolls;
        data.rollsActive = this.rollsActive;
        return data;
    }

    activateListeners(html) {
        html.find(".roll-starting-stats-button").on("click", ev => this._rollStartingStats());
        html.find(".set-stat-to-eight-button").on("click", ev => this._promptForStatToMakeEight());
        html.find(".reroll-one-stat-button").on("click", ev => this._promptForStatToReroll());
        html.find(".assign-stats-button").on("click", ev => this._assignStatsAndClose(html));
        html.find(".start-over-button").on("click", ev => this.close());

        html.find(".roller-roll-display").on("click", ev => this._handleRollClick(ev));

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
        this.buttonText = {
            'roll_starting_stats_button': game.i18n.localize(Constants.MESSAGES.STAT_ROLLER.BUTTONS.ROLL_STARTING_STATS),
            'set_stat_to_eight_button': game.i18n.localize(Constants.MESSAGES.STAT_ROLLER.BUTTONS.SET_STAT_TO_EIGHT),
            'reroll_one_stat_button': game.i18n.localize(Constants.MESSAGES.STAT_ROLLER.BUTTONS.REROLL_ONE_STAT),
            'start_over_button': game.i18n.localize(Constants.MESSAGES.STAT_ROLLER.BUTTONS.START_OVER),
            'assign_stats_button': game.i18n.localize(Constants.MESSAGES.STAT_ROLLER.BUTTONS.ASSIGN_STATS),
        }
        this.message = game.i18n.localize(Constants.MESSAGES.STAT_ROLLER.INSTRUCTIONS.STARTING_ROLLS);
        this.rollsActive = false;
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
                let statRollData = new StatRollData(roll, i);
                candidateRolls.push(statRollData);
            }
            candidateRolls.sort((a, b) => a.roll.total - b.roll.total);
            candidateRolls[0].isIgnored = true;
            // now we assess what the next state is
            this.buttonStates['roll-starting-stats-button'] = ButtonFlags.Disabled;  // cannot roll new stats
            this.buttonStates['set-stat-to-eight-button'] = ButtonFlags.Enabled;     // can always set something to eight
            // if the stats include a negative modifier already, can assign stats
            if (candidateRolls[0].total < 10) {
                this.buttonStates['assign-stats-button'] = ButtonFlags.Enabled;
            } else {
                this.buttonStates['assign-stats-button'] = ButtonFlags.Disabled;
            }
            // re-sort by index
            candidateRolls.sort((a, b) => a.index - b.index);
            this.rolls = candidateRolls;
            this.message = game.i18n.localize(Constants.MESSAGES.STAT_ROLLER.INSTRUCTIONS.POST_STARTING_ROLLS);
            this.render(true);
        }
    }

    _promptForStatToMakeEight() {
        if (this.buttonStates['set-stat-to-eight-button'] === ButtonFlags.Enabled) {
            this.message = game.i18n.localize(Constants.MESSAGES.STAT_ROLLER.INSTRUCTIONS.SETTING_AN_EIGHT);
            this.buttonStates['set-stat-to-eight-button'] = ButtonFlags.Disabled;
            this.buttonStates['assign-stats-button'] = ButtonFlags.Disabled;
            this.rollsActive = true;
            this.render(true);
        }
    }

    async _handleRollClick(ev) {
        if (this.rollsActive) {
            let rollContainer = ev.target.closest('.active-roll');
            let index = parseInt(rollContainer.id.match(/\d/)[0]);
            if (this.rollClickEight) {
                this._setStatToEight(index);
            } else {
                await this._rerollStat(index);
            }
        }
    }

    _setStatToEight(index) {
        let selectedRoll = this.rolls[index-1];
        selectedRoll.isManual = true;
        selectedRoll.roll.terms[0].results.forEach(x => { x.active = false; x.discarded = true; });
        selectedRoll.roll._total = 8;
        this.rollsActive = false;
        this.message = game.i18n.localize(Constants.MESSAGES.STAT_ROLLER.INSTRUCTIONS.AFTER_SETTING_EIGHT);
        this.buttonStates['reroll-one-stat-button'] = ButtonFlags.Enabled;
        if (sumRolls(this.rolls) >= 70) {
            this.buttonStates['assign-stats-button'] = ButtonFlags.Enabled;
        }
        this.rollClickEight = false;  // now if we click a roll, it is for a reroll
        this.render(true);
    }

    _promptForStatToReroll() {
        if (this.buttonStates['reroll-one-stat-button'] === ButtonFlags.Enabled) {
            this.message = game.i18n.localize(Constants.MESSAGES.STAT_ROLLER.INSTRUCTIONS.REROLL_PROMPT);
            this.buttonStates['reroll-one-stat-button'] = ButtonFlags.Disabled;
            this.buttonStates['assign-stats-button'] = ButtonFlags.Disabled;
            this.rollsActive = true;
            this.render(true);
        }
    }

    async _rerollStat(index) {
            let roll = new Roll("4d6kh3");
            await roll.evaluate();
            let statRollData = new StatRollData(roll, index-1);
            this.rolls.splice(index-1, 1, statRollData);
            this.rollsActive = false;
            if (sumRolls(this.rolls) >= 70) {
                this.message = game.i18n.localize(Constants.MESSAGES.STAT_ROLLER.INSTRUCTIONS.AFTER_REROLL_VALID_STATS);
                this.buttonStates['assign-stats-button'] = ButtonFlags.Enabled;
            } else {
                this.message = game.i18n.localize(Constants.MESSAGES.STAT_ROLLER.INSTRUCTIONS.AFTER_REROLL_INVALID_STATS);
                this.buttonStates['start-over-button'] = ButtonFlags.Enabled;
                this.buttonStates['assign-stats-button'] = ButtonFlags.Disabled;
            }
            this.render(true);
    }

    async _assignStatsAndClose(html) {
        if (this.buttonStates['assign-stats-button'] === ButtonFlags.Enabled) {
            let statSelectors = html.find('.stat-selector');
            let accruedStats = {};
            for (var i=0; i < statSelectors.length; i++) {
                let index = parseInt(statSelectors[i].id.match(/\d/)[0]);
                accruedStats[statSelectors[i].value] = this.rolls[index-1].roll.total;
            }
            if (Object.keys(accruedStats).length === 6) {
                let actor = game.actors.get(this.actorId);
                if (actor === null) {
                    ui.notifications.warn(game.i18n.localize(Constants.MESSAGES.STAT_ROLLER.ERROR.UNABLE_TO_FIND_ACTOR));
                } else {
                    let updateData = {};
                    for (let stat in accruedStats) {
                        if (stat === "Empty") {
                            ui.notifications.error(game.i18n.localize(Constants.MESSAGES.STAT_ROLLER.ERROR.ASSIGN_ABILITY_SCORES));
                            return;
                        }
                        updateData[`system.abilities.${stat}.value`] = accruedStats[stat];
                    }
                    actor.update(updateData);
                }
                this.close();
            } else {
                ui.notifications.error(game.i18n.localize(Constants.MESSAGES.STAT_ROLLER.ERROR.ASSIGN_ABILITY_SCORES));
            }
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
}