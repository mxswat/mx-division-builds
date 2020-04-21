export class GearBase {
    // type = null
    id = null;
    quality = null;
    itemName = null;
    brand = null; // Use for Style later
    talent = null;
    core = null;
    attributeOne = null;
    attributeTwo = null;
    mod = null;
    filters = {
        core: null,
        attributeOne: null,
        attributeTwo: null,
        mod: null,
        talent: null,
    };
    constructor(gearRaw) {
        // this.type = gearRaw.Type not used at the moment
        // If named do filters and bla bla
        this.id = gearRaw.index;
        this.quality = gearRaw.Quality;
        this.itemName = gearRaw['Item Name'];
        this.brand = gearRaw.Brand;
        this.filters.core = gearRaw.Core;
        this.filters.attributeOne = gearRaw['Attribute 1'];
        this.filters.attributeTwo = gearRaw['Attribute 2'];
        this.filters.mod = gearRaw.Mod;
        this.filters.talent = gearRaw.Talent;
    }
}

// TODO CHANGE ME