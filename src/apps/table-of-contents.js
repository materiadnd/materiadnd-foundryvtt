/**
 * Compendium that renders pages as a table of contents.
 */
export class MateriaTableOfContentsCompendium extends dnd5e.applications.journal.TableOfContentsCompendium {
  /** @inheritDoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["table-of-contents", "phb"]
    });
  }
}