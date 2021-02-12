const zipObject = (keys, values) =>
    keys.reduce((acc, key, idx) => {
        acc[key] = values[idx];
        return acc;
    }, {});

/**
 * Gets a CSV converted to array using PapaParse
 * input is like header = ['a'], data = [[1],[2],[3]]
 * and output it like [{a:1},{a:2},{a:3}]
 * @param {*} headers 
 * @param {*} data 
 */
const csvToArrayWithKeys = (headers, data, globalMapping) => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
        const dataRow = data[i];
        const object = zipObject(headers, dataRow);
        // Never start form 0 because I'm lazy to handle the url conversion if all indexes are 0
        // TODO Handle it in code clean up sprint
        // Nevermind maybe i'll actualy use the 0 as "empty"
        object['index'] = i + 1;
        result.push(object);
    }
    return result;
}


// https://stackoverflow.com/a/6491621/10300983 modified to work with my code
const getByString = function (o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, ''); // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        // if (o && (k in o)) {
        if (o === Object(o) && k in o) {
            o = o[k];
        } else {
            return 0;
            // return; This was the original return
        }
    }
    return o;
}

const getUniqueObject = function (object) {
    // Generate unique object, otherwise when you change one value it will change it on the other slots too
    return JSON.parse(JSON.stringify(object));
}

const typeToImgSrc = {
    core: {
        'O': 'icons/offense1.png',
        'U': 'icons/tech1.png',
        'D': 'icons/defense1.png',
    },
    attribute: {
        'O': 'icons/offense2.png',
        'U': 'icons/tech2.png',
        'D': 'icons/defense2.png',
    },
    mod: {
        'O': 'icons/offense3_2.png',
        'U': 'icons/tech3_2.png',
        'D': 'icons/defense3_2.png',
    }
}

const qualityToCss = {
    "High End": "high-end",
    Named: "named",
    Exotic: "exotic",
    Gearset: "gearset"
};

const coreAttributes = [{
    label: "Weapon Damage",
    value: 15,
    Max: 15,
    Type: "O",
    index: 1
},
{
    label: "Skill Tier",
    value: 1,
    Max: 1,
    Type: "U",
    index: 0
},
{
    label: "Armor",
    value: 170000,
    Max: 170000,
    Type: "D",
    index: 2
}
];

const WEAPON_PROP_ENUM = {
    ATTRIBUTE_1: 'attribute 1',
    BASE_DAMAGE: 'base damage',
    CORE_1: 'core 1',
    CORE_2: 'core 2',
    FILTERS: 'filters',
    HSD: 'hsd',
    ID: 'id',
    MAG_SIZE: 'mag size',
    MAGAZINE: 'magazine',
    MUZZLE: 'muzzle',
    NAME: 'name',
    OPTIC: 'optic',
    OPTIMAL_RANGE: 'optimal range',
    QUALITY: 'quality',
    RELOAD_SPEED: 'reload speed (ms)',
    RPM: 'rpm',
    TALENT: 'talent',
    UNDER_BARREL: 'under barrel',
    VARIANT: 'variant',
    WEAPON_TYPE: 'weapon type',
}

const STATS_ENUM = {
    CRITICAL_HIT_DAMAGE: "Critical Hit Damage",
    DAMAGE_TO_ARMOR: "Damage to Armor",
    DAMAGE_TO_TOC: "Damage to TOC",
    CRITICAL_HIT_CHANCE: "Critical Hit Chance",
    HEADSHOT_DAMAGE: "Headshot Damage",
    WEAPON_DAMAGE: "Weapon Damage",
    TOTAL_ARMOR: "Total Armor",
    RELOAD_SPEED_PERC: "Reload Speed %",
    MAGAZINE_SIZE_PERC: "Magazine Size %",
    WEAPON_HANDLING: "Weapon Handling"
}

const UI_WEAPON_SLOT_ENUM = {
    'Primary': 0,
    'Secondary': 1,
    'SideArm': 2,
    0: 'Primary',
    1: 'Secondary',
    2: 'SideArm',
}

const QualityPriority = {
    Exotic: 0,
    Named: 1,
    Gearset: 2,
    "High End": 3,
};


function groupArrayOfObjectsByKey(list, key) {
    return list.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

export {
    getByString,
    zipObject,
    csvToArrayWithKeys,
    typeToImgSrc,
    coreAttributes,
    qualityToCss,
    getUniqueObject,
    WEAPON_PROP_ENUM,
    STATS_ENUM,
    UI_WEAPON_SLOT_ENUM,
    QualityPriority,
    groupArrayOfObjectsByKey
};