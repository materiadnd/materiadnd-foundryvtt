import { Constants } from "./constants.js"

export class Settings { 
    static SETTINGS = {
        ADD_ARMOR_TYPES: 'add-armor-types',
        ADD_MATERIA_CONDITIONS: 'add-materia-conditions',
        ADD_THIRD_PACT_CASTER: 'add-third-pact-caster',
        ADD_WEAPONS_AND_WEAPON_PROPS: 'add-weapons-and-weapon-props',
        ADD_SPELL_PREP_COUNTER: 'add-spell-prep-counter',
        ADD_EXHAUSTION_HANDLING: 'add-exhaustion-handling',
        AUTO_ITEM_USE_TRACKER_ENABLED: 'auto-item-use-tracker-enabled',
        WILD_SHAPE_TRANSFORM_HANDLER_ENABLED: 'wild-shape-transform-handler-enabled',
        ENABLE_ITEM_RESTORE: 'enable-item-restore',
        REPLACE_SOURCE_PACKS: 'replace-source-packs',
        SPELL_SEARCH_INDEX: 'spell-search-index',
        ENABLE_SPELL_SEARCH: 'enable-spell-search',
        SPELL_SEARCH_PACK_NAME: 'spell-search-pack-name'
    }

    static initialize() {
        game.settings.register(Constants.MODULE_ID, this.SETTINGS.ADD_ARMOR_TYPES, {
            name: `MATERIA-DND.settings.${this.SETTINGS.ADD_ARMOR_TYPES}.Name`,
            hint: `MATERIA-DND.settings.${this.SETTINGS.ADD_ARMOR_TYPES}.Hint`,
            config: true,
            scope: 'world',
            default: true,
            type: Boolean,
            onChange: () => {},
            requiresReload: true,
        });
        game.settings.register(Constants.MODULE_ID, this.SETTINGS.ADD_MATERIA_CONDITIONS, {
            name: `MATERIA-DND.settings.${this.SETTINGS.ADD_MATERIA_CONDITIONS}.Name`,
            hint: `MATERIA-DND.settings.${this.SETTINGS.ADD_MATERIA_CONDITIONS}.Hint`,
            config: true,
            scope: 'world',
            default: true,
            type: Boolean,
            onChange: () => {},
            requiresReload: true,
        });
        game.settings.register(Constants.MODULE_ID, this.SETTINGS.ADD_THIRD_PACT_CASTER, {
            name: `MATERIA-DND.settings.${this.SETTINGS.ADD_THIRD_PACT_CASTER}.Name`,
            hint: `MATERIA-DND.settings.${this.SETTINGS.ADD_THIRD_PACT_CASTER}.Hint`,
            config: true,
            scope: 'world',
            default: true,
            type: Boolean,
            onChange: () => {},
            requiresReload: true,
        });
        game.settings.register(Constants.MODULE_ID, this.SETTINGS.ADD_WEAPONS_AND_WEAPON_PROPS, {
            name: `MATERIA-DND.settings.${this.SETTINGS.ADD_WEAPONS_AND_WEAPON_PROPS}.Name`,
            hint: `MATERIA-DND.settings.${this.SETTINGS.ADD_WEAPONS_AND_WEAPON_PROPS}.Hint`,
            config: true,
            scope: 'world',
            default: true,
            type: Boolean,
            onChange: () => {},
            requiresReload: true,
        });
        game.settings.register(Constants.MODULE_ID, this.SETTINGS.ADD_SPELL_PREP_COUNTER, {
            name: `MATERIA-DND.settings.${this.SETTINGS.ADD_SPELL_PREP_COUNTER}.Name`,
            hint: `MATERIA-DND.settings.${this.SETTINGS.ADD_SPELL_PREP_COUNTER}.Hint`,
            config: true,
            scope: 'world',
            default: true,
            type: Boolean,
            onChange: () => {},
            requiresReload: true,
        });
        game.settings.register(Constants.MODULE_ID, this.SETTINGS.ADD_EXHAUSTION_HANDLING, {
            name: `MATERIA-DND.settings.${this.SETTINGS.ADD_EXHAUSTION_HANDLING}.Name`,
            hint: `MATERIA-DND.settings.${this.SETTINGS.ADD_EXHAUSTION_HANDLING}.Hint`,
            config: true,
            scope: 'world',
            default: true,
            type: Boolean,
            onChange: () => {},
            requiresReload: true,
        });
        game.settings.register(Constants.MODULE_ID, this.SETTINGS.AUTO_ITEM_USE_TRACKER_ENABLED, {
            name: `MATERIA-DND.settings.${this.SETTINGS.AUTO_ITEM_USE_TRACKER_ENABLED}.Name`,
            hint: `MATERIA-DND.settings.${this.SETTINGS.AUTO_ITEM_USE_TRACKER_ENABLED}.Hint`,
            config: true,
            scope: 'world',
            default: true,
            type: Boolean,
            onChange: () => {},
            requiresReload: true,
        });
        game.settings.register(Constants.MODULE_ID, this.SETTINGS.WILD_SHAPE_TRANSFORM_HANDLER_ENABLED, {
            name: `MATERIA-DND.settings.${this.SETTINGS.WILD_SHAPE_TRANSFORM_HANDLER_ENABLED}.Name`,
            hint: `MATERIA-DND.settings.${this.SETTINGS.WILD_SHAPE_TRANSFORM_HANDLER_ENABLED}.Hint`,
            config: true,
            scope: 'world',
            default: true,
            type: Boolean,
            onChange: () => {},
            requiresReload: true,
        });
        game.settings.register(Constants.MODULE_ID, this.SETTINGS.ENABLE_ITEM_RESTORE, {
            name: `MATERIA-DND.settings.${this.SETTINGS.ENABLE_ITEM_RESTORE}.Name`,
            hint: `MATERIA-DND.settings.${this.SETTINGS.ENABLE_ITEM_RESTORE}.Hint`,
            config: true,
            scope: 'world',
            default: true,
            type: Boolean,
            onChange: () => {},
            requiresReload: true,
        });
        game.settings.register(Constants.MODULE_ID, this.SETTINGS.REPLACE_SOURCE_PACKS, {
            name: `MATERIA-DND.settings.${this.SETTINGS.REPLACE_SOURCE_PACKS}.Name`,
            hint: `MATERIA-DND.settings.${this.SETTINGS.REPLACE_SOURCE_PACKS}.Hint`,
            config: true,
            scope: 'world',
            default: true,
            type: Boolean,
            onChange: () => {},
            requiresReload: true,
        });
        game.settings.register(Constants.MODULE_ID, this.SETTINGS.SPELL_SEARCH_INDEX, {
            name: `MATERIA-DND.settings.${this.SETTINGS.SPELL_SEARCH_INDEX}.Name`,
            config: false,
            scope: 'client',
            type: String,
        });
        game.settings.register(Constants.MODULE_ID, this.SETTINGS.ENABLE_SPELL_SEARCH, {
            name: `MATERIA-DND.settings.${this.SETTINGS.ENABLE_SPELL_SEARCH}.Name`,
            hint: `MATERIA-DND.settings.${this.SETTINGS.ENABLE_SPELL_SEARCH}.Hint`,
            config: true,
            scope: 'world',
            default: true,
            type: Boolean,
            onChange: () => {},
            requiresReload: true,
        });
        game.settings.register(Constants.MODULE_ID, this.SETTINGS.SPELL_SEARCH_PACK_NAME, {
            name: `MATERIA-DND.settings.${this.SETTINGS.SPELL_SEARCH_PACK_NAME}.Name`,
            hint: `MATERIA-DND.settings.${this.SETTINGS.SPELL_SEARCH_PACK_NAME}.Hint`,
            config: true,
            scope: 'world',
            default: 'materia-dnd',
            type: String,
            onChange: () => {},
            requiresReload: true,
        });
    }
}