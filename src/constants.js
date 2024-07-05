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
}