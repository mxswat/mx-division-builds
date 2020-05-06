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


const utilityStats = [
    'Skill Tier',
    'Skill Damage',
    'Repair Skills',
    'Skill Haste',
    'Status Effects',
    'Pulse Haste',
    'Skill Health',
    'Sheild Health',
    'Skill Duration',
]

const offensiveStats = [
    'Weapon Damage',
    'Critical Hit Chance',
    'Critical Hit Damage',
    'Headshot Damage',
    'Damage to TOC',
    'Damage to Armor',
    'Damage to Health',
    'Assault Rifle Damage',
    'LMG Damage',
    'Marksman Rifle Damage',
    'Pistol Damage',
    'Rifle Damage',
    'Shotgun Damage',
    'SMG Damage',
    'Rate of Fire %',
    'Stability',
    'Accuracy',
    'Reload Speed %',
    'Mag Size %',
    'Optimal Range',
    'Swap Speed',
    'Weapon Handling',
    'Melee Damage',
    'Ammo Capacity',
]

const defensiveStats = [
    'Armor',
    'Armor Regeneration',
    'Hazard Protection',
    'Health',
    'Explosive Resistance',
    'Damage to Health',
    'Melee Damage',
    'Armor % on Kill',
    'Sheild Health',
    'Armor Regeneration %',
    'Protection from Elites',
    'Armor on Kill',
    'Incoming Repairs',
    'Bleed Resistance',
    'Blind Resistance',
    'Burn Resistance',
    'Disrupt Resistance',
    'Shock Resistance',
    'Skill Duration',
]

export {
    zipObject,
    csvToArrayWithKeys,
    typeToImgSrc,
    coreAttributes,
    qualityToCss,
    utilityStats,
    offensiveStats,
    defensiveStats
};