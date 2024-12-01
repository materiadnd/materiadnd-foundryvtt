const STANDARD_TRAITS = ["Armor Training", "Saving Throws", "Skills", "Tool Proficiencies", "Weapon Proficiencies", "Multiclass Proficiencies"];

export class EnhancedJournalClassPageSheet extends dnd5e.applications.journal.JournalClassPageSheet {
  /**
   * Prepare table based on non-optional GrantItem advancement & ScaleValue advancement.
   * @param {Item5e} item                      Class item belonging to this journal.
   * @param {object} options
   * @param {number} [options.initialLevel=1]  Level at which the table begins.
   * @param {boolean} options.modernStyle      Is the modern style being displayed?
   * @returns {object}                         Prepared table.
   * @protected
   */
  async _getTable(item, { initialLevel=1, modernStyle }={}) {
    const hasFeatures = !!item.advancement.byType.ItemGrant;
    const scaleValues = (item.advancement.byType.ScaleValue ?? []);
    const spellProgression = await this._getSpellProgression(item);

    const headers = [[{content: game.i18n.localize("DND5E.Level")}]];
    if ( item.type === "class" ) headers[0].push({content: game.i18n.localize("DND5E.ProficiencyBonus")});
    if ( hasFeatures ) headers[0].push({content: game.i18n.localize("DND5E.Features")});
    headers[0].push(...scaleValues.map(a => ({content: a.title})));
    if ( spellProgression ) {
      if ( spellProgression.headers.length > 1 ) {
        headers[0].forEach(h => h.rowSpan = 2);
        headers[0].push(...spellProgression.headers[0]);
        headers[1] = spellProgression.headers[1];
      } else {
        headers[0].push(...spellProgression.headers[0]);
      }
    }

    const cols = [{ class: "level", span: 1 }];
    if ( item.type === "class" ) cols.push({class: "prof", span: 1});
    if ( hasFeatures ) cols.push({class: "features", span: 1});
    if ( scaleValues.length ) cols.push({class: "scale", span: scaleValues.length});
    if ( spellProgression ) cols.push(...spellProgression.cols);

    const prepareFeature = uuid => {
      const index = fromUuidSync(uuid);
      if ( index?.type !== "feat" ) return null;
      return dnd5e.utils.linkForUuid(uuid);
    };

    const rows = [];
    for ( const level of Array.fromRange((CONFIG.DND5E.maxLevel - (initialLevel - 1)), initialLevel) ) {
      let features = [];
      for ( const advancement of item.advancement.byLevel[level] ) {
        switch ( advancement.constructor.typeName ) {
          case "AbilityScoreImprovement":
            if (level != 1) {
                features.push(game.i18n.localize("DND5E.ADVANCEMENT.AbilityScoreImprovement.Title"));
            }
            continue;
          case "ItemGrant":
            if ( advancement.configuration.optional ) continue;
            features.push(...await Promise.all(advancement.configuration.items.map(i => prepareFeature(i.uuid))));
            break;
          case "Trait":
            if (advancement.classRestriction !== undefined) continue;
            if (!STANDARD_TRAITS.includes(advancement.title)) {
              features.push(`${advancement.titleForLevel(level)}`);
            }
            break;
          case "ItemChoice":
            if (advancement.classRestriction !== undefined) continue;
            features.push(`${advancement.titleForLevel(level)}`);
            break;
        }
      }
      features = features.filter(_ => _);

      // Level & proficiency bonus
      const cells = [{class: "level", content: modernStyle ? level : level.ordinalString()}];
      if ( item.type === "class" ) cells.push({class: "prof", content: `+${dnd5e.documents.Proficiency.calculateMod(level)}`});
      if ( hasFeatures ) cells.push({class: "features", content: features.join(", ")});
      scaleValues.forEach(s => cells.push({class: "scale", content: s.valueForLevel(level)?.display}));
      const spellCells = spellProgression?.rows[rows.length];
      if ( spellCells ) cells.push(...spellCells);

      // Skip empty rows on subclasses
      if ( item.type === "subclass" ) {
        let displayRow = features.length || spellCells;
        if ( rows.length ) displayRow ||= rows.at(-1).some((cell, index) =>
          (cell.class === "scale") && (cell.content !== cells[index].content)
        );
        else if ( scaleValues.length ) displayRow ||= cells.filter(c => (c.class === "scale") && c.content).length;
        if ( !displayRow ) continue;
      }

      rows.push(cells);
    }

    return { headers, cols, rows };
  }

  /**
   * Fetch data for each class feature listed.
   * @param {Item5e} item                       Class or subclass item belonging to this journal.
   * @param {object} options
   * @param {boolean} options.modernStyle       Is the modern style being displayed?
   * @param {boolean} [options.optional=false]  Should optional features be fetched rather than required features?
   * @returns {object[]}   Prepared features.
   * @protected
   */
  async _getFeatures(item, { modernStyle, optional=false }) {
    const prepareFeature = async (f, level) => {
      const document = await fromUuid(f.uuid);
      // if ( document?.type !== "feat" ) return null;
      let name = "";
      let description = "";
      if (document?.type !== "feat") {
        switch (document.constructor.typeName) {
          case "ItemChoice":
          case "Trait":
            name = document.title;
            description = document.hint;
            break;
          default:
            return null;
        }
      } else {
        name = document.name;
        description = document.system.description.value;
      }
      return {
        document,
        name: modernStyle ? game.i18n.format("JOURNALENTRYPAGE.DND5E.Class.Features.Name", {
          name: name, level: dnd5e.utils.formatNumber(level)
        }) : name,
        description: await TextEditor.enrichHTML(description, {
          relativeTo: item, secrets: false
        })
      };
    };

    let features = [];
    let choiceFeatureIds = [];
    for ( const level of Array.fromRange(CONFIG.DND5E.maxLevel, 1) ) {
      for ( const advancement of item.advancement.byLevel[level] ) {
        if (!!advancement.configuration.optional !== optional) continue;
        if (advancement.constructor.typeName == "Trait" && STANDARD_TRAITS.includes(advancement.title)) continue;
        if (advancement.title.startsWith("Starting")) continue;
        if (advancement.constructor.typeName == "ItemGrant") {
          features.push(...advancement.configuration.items.map(f => prepareFeature(f, advancement.level)));
        } else {
          if (advancement.constructor.typeName == "ItemChoice") {
            if (!choiceFeatureIds.includes(advancement._id)) { 
              choiceFeatureIds.push(advancement._id);
            } else{
              // skip subsequent instances of choices
              continue;
            }
          }
          features.push(prepareFeature(advancement, level));
        }
      }
    }
    features = await Promise.all(features);
    return features.filter(f => f);
  }

}