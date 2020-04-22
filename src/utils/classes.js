class GearBase {
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

class WeaponBase {
    // "Slot" = null;
    "Name" = null;
    "Base Damage" = null;
    "RPM" = null;
    "Mag Size" = null;
    "Quality" = null;
    "Optimal Range" = null;
    "Weapon Type" = null;
    "Reload Speed (ms)" = null;
    "HSD" = null;
    "Variant" = null;
    
    // Core is always the same per weapon category
    // "Core 1" = null;
    // "Core 1 Max" = null;
    // "Core 2" = null;
    // "Core 2 Max" = null;
    
    // Used in Encoding
    id = null;
    "Attribute 1" = null;
    "Talent" = null;
    "Optics" = null;
    "Under Barrel" = null;
    "Magazine" = null;
    "Muzzle" = null;

    filters = {
        "Core 1": null,
        "Core 1 Max": null,
        "Core 2": null,
        "Core 2 Max": null,
        "Attribute 1": null,
        "Talent": null,
        "Optics": null,
        "Under Barrel": null,
        "Magazine": null,
        "Muzzle": null,
    }
    constructor(weaponRaw) {
        console.log(weaponRaw);

    }
}

export {
    GearBase,
    WeaponBase
}

// TODO CHANGE ME