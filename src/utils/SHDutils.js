function getSHDLevels() {
    const userValues = localStorage.getItem('SHD-LEVELS-V2') ? JSON.parse(localStorage.getItem('SHD-LEVELS-V2')) : {};
    const defaults = [
        // name, type, max, value
        ["Weapon Damage", "O", 10, 0], 
        ["Headshot Damage", "O", 10, 0], 
        ["Critical Hit Chance", "O", 10, 0], 
        ["Critical Hit Damage", "O", 20, 0],
        // ----------- 
        ["Reload Speed %", "O", 10, 0], 
        ["Stability", "O", 10, 0], 
        ["Accuracy", "O", 10, 0],
        ["Ammo Capacity", "O", 20, 0],
        //------------- 
        ["Total Armor", "D", 10, 0], 
        ["Explosive Resistance", "D", 10, 0], 
        ["Hazard Protection", "D", 10, 0], 
        ["Health", "D", 10, 0], 
        //------------
        ["Skill Haste", "U", 10, 0], 
        ["Skill Damage", "U", 10, 0], 
        ["Skill Duration", "U", 20, 0], 
        ["Repair Skills", "U", 10, 0]
    ];
    const SHDLevels = [];
    for (let i = 0; i < defaults.length; i++) {
        const defaultVal = defaults[i];
        SHDLevels.push(
            {
                name: defaultVal[0],
                type: defaultVal[1],
                max: defaultVal[2],
                value: userValues[defaultVal[0]] || 0,
            }
        )
    }
    return SHDLevels;
}

function updateLocalSHDLevels(levels) {
    const userValues = {};
    for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        userValues[level.name] = level.value
    }
    localStorage.setItem('SHD-LEVELS-V2', JSON.stringify(userValues));
}

export {
    getSHDLevels,
    updateLocalSHDLevels
}