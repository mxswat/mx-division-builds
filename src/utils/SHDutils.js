function getSHDLevels() {
    return [
        {
            name: "Weapon Damage",
            max: 10,
            value: 0,
            type: 'O'
        },
        {
            name: "Headshot Damage",
            max: 10,
            value: 0,
            type: 'O'
        },
        {
            name: "Critical Hit Chance",
            max: 10,
            value: 0,
            type: 'O'
        },
        {
            name: "Critical Hit Damage",
            max: 20,
            value: 0,
            type: 'O'
        },
        {
            name: "Total Armor",
            max: 20,
            value: 0,
            type: 'D'
        },
        {
            name: "Skill Haste",
            max: 10,
            value: 0,
            type: 'U'
        },
        {
            name: "Skill Damage",
            max: 10,
            value: 0,
            type: 'U'
        },
        {
            name: "Skill Duration",
            max: 10,
            value: 0,
            type: 'U'
        },
        {
            name: "Repair Skills",
            max: 10,
            value: 0,
            type: 'U'
        },
    ];
}

export {
    getSHDLevels
}