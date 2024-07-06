export class Constants {
    static MODULE_ID = 'materia-dnd';
    static ACTOR_DEFAULT_OWNER_KEY = 'default';
    static MINIMUM_OWNERSHIP_VALUE = 3; // 0 = None, 1 = Limited, 2 = Observer, 3 = Owner
    static TEMPLATES = {
        ITEM_RESTORE: `modules/${this.MODULE_ID}/templates/apps/item-restore.hbs`,
        SPELL_SEARCH: `modules/${this.MODULE_ID}/templates/apps/spell-search.hbs`,
        STAT_ROLLER: {
            APP: `modules/${this.MODULE_ID}/templates/apps/stat-roller/stat-roller.hbs`,
            ROLL_DISPLAY: `modules/${this.MODULE_ID}/templates/apps/stat-roller/roll-display.hbs`,
        }
    }
    static MESSAGES = {
        STAT_ROLLER: {
            BUTTONS: {
                ROLL_STARTING_STATS: `${this.MODULE_ID}.ui.stat-roller.buttons.roll-starting-stats`,
                SET_STAT_TO_EIGHT: `${this.MODULE_ID}.ui.stat-roller.buttons.set-stat-to-eight`,
                REROLL_ONE_STAT: `${this.MODULE_ID}.ui.stat-roller.buttons.reroll-one-stat`,
                START_OVER: `${this.MODULE_ID}.ui.stat-roller.buttons.start-over`,
                ASSIGN_STATS: `${this.MODULE_ID}.ui.stat-roller.buttons.assign-stats`
            },
            INSTRUCTIONS: {
                STARTING_ROLLS: `${this.MODULE_ID}.ui.stat-roller.messages.starting-rolls`,
                POST_STARTING_ROLLS: `${this.MODULE_ID}.ui.stat-roller.messages.post-starting-rolls`,
                SETTING_AN_EIGHT: `${this.MODULE_ID}.ui.stat-roller.messages.setting-an-eight`,
                AFTER_SETTING_EIGHT: `${this.MODULE_ID}.ui.stat-roller.messages.after-setting-eight`,
                AFTER_REROLL_VALID_STATS: `${this.MODULE_ID}.ui.stat-roller.messages.after-reroll-valid-stats`,
                AFTER_REROLL_INVALID_STATS: `${this.MODULE_ID}.ui.stat-roller.messages.after-reroll-invalid-stats`,
            }
        }
    }
}

export class ButtonFlags  {
    static Disabled = 0;
    static Enabled = 1;
}