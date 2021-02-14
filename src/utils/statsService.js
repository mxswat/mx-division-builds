import {
    BehaviorSubject,
    timer
} from 'rxjs';

import {
    gearData
} from "./dataImporter";

import {
    debounce
} from "rxjs/operators";

import { WEAPON_PROP_ENUM, STATS_ENUM, UI_WEAPON_SLOT_ENUM } from "./utils";
import DPSChartCore from "./DPSChartCore";
import TTKCoreService from "./TTKCore";

const stats$ = new BehaviorSubject();

class Stats {
    Offensive = {}
    Defensive = {}
    Utility = {}
    Cores = {
        Offensive: [],
        Defensive: [],
        Utility: [],
    }
    brands = {}
    cores = []
    Weapons = {
        Primary: null,
        Secondary: null,
        SideArm: null,
    }
    constructor() {

    }
}

let stats = new Stats();

const keyBy = (array, key) => (array || []).reduce((r, x) => ({ ...r, [key ? x[key] : x]: x }), {});

const statTypes = {
    'O': 'Offensive',
    'D': 'Defensive',
    'U': 'Utility',
}

class StatsService {
    brandSetBonuses = null;
    statsMapping = null;
    SHDLevels = null

    dataCache = null;

    resetStats() {
        stats = new Stats();
    }

    getStats$() {
        // TODO
        // https://stackoverflow.com/questions/43043517/filter-all-null-values-from-an-observablet
        // .filter(user => user !== null).distinctUntilChanged();
        return stats$.asObservable()
            .pipe(debounce(() => timer(150)));
    }

    async updateStats(data) {
        this.resetStats()
        this.dataCache = data;
        this.brandSetBonuses = this.brandSetBonuses || await gearData.BrandSetBonuses;
        if (!this.statsMapping) {
            const statsMapping = await gearData.StatsMapping
            this.statsMapping = this.statsMapping || keyBy(statsMapping, 'Stat');
        }

        this.addStatsFromGear(data.gear);
        this.addStatsFromSHD(data.SHDLevels);

        if (data.specialization) {
            this.addStatsFromSpecialization(data.specialization);
        }

        this.handleBrandEdgeCase(stats.brands);

        // ALWAYS calc weapon damage AFTER all the gear stats

        // Not my best code, but it is good enough
        for (const slotKey in UI_WEAPON_SLOT_ENUM) {
            // isNaN(Number(slotKey)) is to ignore the number side of the Enum
            if (Object.hasOwnProperty.call(UI_WEAPON_SLOT_ENUM, slotKey) && isNaN(Number(slotKey))) {
                const idx = UI_WEAPON_SLOT_ENUM[slotKey];
                stats.Weapons[slotKey] = this.getWeaponStats(data.weapons[idx], slotKey);
                if (stats.Weapons[slotKey].weaponName)
                    DPSChartCore.addCoreWeaponTrace(slotKey, stats.Weapons[slotKey]);
                    TTKCoreService.addCoreWeaponData(slotKey, stats.Weapons[slotKey])
            }
        }

        stats$.next(stats);
    }

    async addStatsFromGear(gearArr) {
        for (let i = 0; i < gearArr.length; i++) {
            const gear = gearArr[i];
            if (gear) {
                // Add to brands OBJ
                stats.brands[gear.brand] = stats.brands[gear.brand] || []
                stats.brands[gear.brand].push(null);
                if (gear.core) {
                    stats.Cores[statTypes[gear.core.Type]].push(gear.core.StatValue || gear.core.Max);
                }
                const keys = ['attributeOne', 'attributeTwo', 'mod',]
                for (let keyI = 0; keyI < keys.length; keyI++) {
                    const key = keys[keyI];
                    const stat = gear[key]
                    if (stat) {
                        const val = stat.StatValue || Number(stat.Max);
                        const savedVal = stats[statTypes[stat.Type]][stat.Stat] || 0;
                        stats[statTypes[stat.Type]][stat.Stat] = savedVal + val;
                    }
                }
                if (this.isEdgeCaseGear(gear)) {
                    this.handleWearableEdgeCase(gear)
                }
            }
        }

        for (const brand in stats.brands) {
            // eslint-disable-next-line
            if (stats.brands.hasOwnProperty(brand)) {
                const brandCount = stats.brands[brand].length;
                const brandBuffs = []
                for (let idx = 0; idx < brandCount; idx++) {
                    const found = this.brandSetBonuses.find(
                        b => b.Brand == `${brand}${idx}`
                    )
                    if (found) {
                        brandBuffs.push(`${found.stat} ${found.val}`);
                        const statType = this.statsMapping[found.stat].Type;
                        const prevVal = stats[statTypes[statType]][found.stat] || 0;
                        stats[statTypes[statType]][found.stat] = Number(prevVal) + Number(found.val);
                        // Horrible, TODO: Change me
                        if (found.stat1) {
                            brandBuffs.push(`${found.stat1} ${found.val1}`);
                            const statType = this.statsMapping[found.stat1].Type;
                            const prevVal = stats[statTypes[statType]][found.stat1] || 0;
                            stats[statTypes[statType]][found.stat1] = Number(prevVal) + Number(found.val1);
                        }
                    }
                }
                stats.brands[brand] = brandBuffs;
            }
        }
    }

    addStatsFromSHD(SHDLevels) {
        for (let i = 0; i < SHDLevels.length; i++) {
            const SHDLevel = SHDLevels[i];
            const val = SHDLevel.value;
            const savedVal = stats[statTypes[SHDLevel.type]][SHDLevel.name] || 0;
            stats[statTypes[SHDLevel.type]][SHDLevel.name] = savedVal + val;
        }
    }

    /**
     * 
     * @param {Object} slot 
     * @param {number} crit 
     * @param {number} headshot 
     */
    getWeaponStatsPerSlot(slot, manualCriticalChance, headshotChance) {
        return this.getWeaponStats(this.dataCache.weapons[UI_WEAPON_SLOT_ENUM[slot]], slot, manualCriticalChance, headshotChance);
    }

    getWeaponStats(weapon, slot, manualCriticalChance = 0, headshotChance = 0) {
        const weaponStats = {
            weaponName: null,
            damageIncrease: null,
            hsd: null,
            chd: null,
            chc: null,
            weaponDamage: null,
            dmgToArmored: null,
            dmgToOutOfCover: null,
            dmgToOutOfCoverArmored: null,
            rpm: null,
            totalMagSize: null,
            dmgToOutOfCoverArmoredPerMag: null,
            reloadSpeed: null,
            timeToEmptyMagazine: null
        };

        if (!weapon) {
            return weaponStats;
        }

        weaponStats.weaponName = weapon[WEAPON_PROP_ENUM.NAME];
        const weaponCore1 = weapon[WEAPON_PROP_ENUM.CORE_1];
        const weaponCore2 = weapon[WEAPON_PROP_ENUM.CORE_2];
        const weaponAttribute1 = weapon["attribute 1"];
        const weaponCoreType = weaponCore1.stat;
        const weaponBaseDamage = Number(
            weapon[WEAPON_PROP_ENUM.BASE_DAMAGE]
        );
        const AWD =
            stats.Cores.Offensive.length > 0
                ? stats.Cores.Offensive.reduce((a, b) => a + b)
                : 0; // All weapon damages from cores
        const weaponSpecificDamage =
            (stats.Offensive[weaponCoreType] || 0) + // Damage from the brands and SHD(?)(To test)
            (weaponCore1.StatValue || weaponCore1.max); // Get the weapon CORE 1
        const genericWeaponDamage =
            stats.Offensive[STATS_ENUM.WEAPON_DAMAGE] || 0; // SHD Levels and Walker brand

        weaponStats.damageIncrease = AWD + weaponSpecificDamage + genericWeaponDamage;

        weaponStats.hsd =
            Number(weapon.hsd) +
            this.getStatValueFromGunMods(weapon, STATS_ENUM.HEADSHOT_DAMAGE);
        weaponStats.hsd += this.getStatValueFromGunAndGear(
            weaponCore2,
            weaponAttribute1,
            stats.Offensive,
            STATS_ENUM.HEADSHOT_DAMAGE
        );

        // 25 is the innate CHD of every gun
        weaponStats.chd =
            25 +
            this.getStatValueFromGunMods(
                weapon,
                STATS_ENUM.CRITICAL_HIT_DAMAGE
            );
        weaponStats.chd += this.getStatValueFromGunAndGear(
            weaponCore2,
            weaponAttribute1,
            stats.Offensive,
            STATS_ENUM.CRITICAL_HIT_DAMAGE
        );
        weaponStats.chc =
            0 +
            this.getStatValueFromGunMods(
                weapon,
                STATS_ENUM.CRITICAL_HIT_CHANCE
            );
        weaponStats.chc += this.getStatValueFromGunAndGear(
            weaponCore2,
            weaponAttribute1,
            stats.Offensive,
            STATS_ENUM.CRITICAL_HIT_CHANCE
        );

        weaponStats.weaponDamage = this.flatWeaponDamage(
            weaponBaseDamage,
            AWD,
            weaponSpecificDamage,
            genericWeaponDamage
        );

        weaponStats.weaponDamage = this.addCHDAndOrHSDOnTopOfFlatDamage(
            weaponStats.weaponDamage,
            weaponStats.chd,
            weaponStats.hsd,
            headshotChance,
            manualCriticalChance
        );

        weaponStats.dta = this.getStatValueFromGunAndGear(
            weaponCore2,
            weaponAttribute1,
            stats.Offensive,
            STATS_ENUM.DAMAGE_TO_ARMOR
        );
        weaponStats.dmgToArmored = this.calcDmgToArmored(weaponStats.weaponDamage, weaponStats.dta);

        weaponStats.dtooc = this.getStatValueFromGunAndGear(
            weaponCore2,
            weaponAttribute1,
            stats.Offensive,
            STATS_ENUM.DAMAGE_TO_TOC
        );
        weaponStats.dmgToOutOfCover = this.calcDmgToOutOfCover(
            weaponStats.weaponDamage,
            weaponStats.dtooc
        );

        weaponStats.dmgToOutOfCoverArmored = this.calcDmgToOutOfCover(
            weaponStats.dmgToArmored,
            weaponStats.dtooc
        );


        let RPM_multiplier = this.getStatValueFromGunAndGear(
            weaponCore2,
            weaponAttribute1,
            stats.Offensive,
            STATS_ENUM.RATE_OF_FIRE_PERC
        );
        // add Rate of Fire % 
        weaponStats.rpm = weapon[WEAPON_PROP_ENUM.RPM];


        let flatMagazineSize = Number(weapon[WEAPON_PROP_ENUM.MAG_SIZE]);
        flatMagazineSize += this.getAdditionalMagSizeFromTheMagazine(
            weapon[WEAPON_PROP_ENUM.MAGAZINE],
            stats.Offensive[STATS_ENUM.MAG_SIZE]
        );

        const MagazineSizeModifier = this.getStatValueFromGunAndGear(
            weaponCore2,
            weaponAttribute1,
            stats.Offensive,
            STATS_ENUM.MAGAZINE_SIZE_PERC
        )

        weaponStats.totalMagSize = (flatMagazineSize * (1 + (MagazineSizeModifier / 100)));

        weaponStats.dmgToOutOfCoverArmoredPerMag =
            weaponStats.dmgToOutOfCoverArmored * weaponStats.totalMagSize;

        let reloadSpeedModifier = this.getStatValueFromGunMods(weapon, STATS_ENUM.WEAPON_HANDLING);
        reloadSpeedModifier += this.getStatValueFromGunAndGear(
            weaponCore2,
            weaponAttribute1,
            stats.Offensive,
            STATS_ENUM.RELOAD_SPEED_PERC
        )
        reloadSpeedModifier += this.getReloadSpeedModifier(
            weapon[WEAPON_PROP_ENUM.MAGAZINE],
            stats.Offensive[STATS_ENUM.RELOAD_SPEED_PERC]
        );
        weaponStats.reloadSpeed = this.calcReloadSpeed(
            weapon[WEAPON_PROP_ENUM.RELOAD_SPEED],
            reloadSpeedModifier
        );

        weaponStats.timeToEmptyMagazine = (weaponStats.totalMagSize / (weaponStats.rpm / 60)) * 1000;

        return weaponStats;
    }

    edgeCaseGear = ["Acosta's Go-Bag"]
    isEdgeCaseGear(gear) {
        return this.edgeCaseGear.includes(gear.itemName);
    }

    handleWearableEdgeCase(gear) {
        switch (this.edgeCaseGear.indexOf(gear.itemName)) {
            case 0:
                stats.brands['Exotic'][1] = 'Repair Skills  +10%';
                stats.brands['Exotic'][2] = 'Status Effects +10%';
                addValueToStat(stats.Utility, 'Status Effects', 10)
                addValueToStat(stats.Utility, 'Repair Skills', 10)
                break;
            default:
                break;
        }
    }

    edgeCaseBrands = ['Empress International']
    handleBrandEdgeCase(brands) {
        for (let i = 0; i < this.edgeCaseBrands.length; i++) {
            const edgeCaseBrand = this.edgeCaseBrands[i];
            if (brands[edgeCaseBrand]) {
                switch (edgeCaseBrand) {
                    case 'Empress International':
                        if (brands[edgeCaseBrand].length > 2) {
                            const skillEfficencyBuffs = ['Status Effects', 'Repair Skills', 'Skill Damage', 'Skill Health', 'Skill Haste', 'Skill Duration']
                            skillEfficencyBuffs.forEach((val) => {
                                addValueToStat(stats.Utility, val, 10)
                            })
                        }
                        delete stats.Utility['Skill Efficiency'];
                        break;
                    default:
                        break;
                }
            }
        }
    }

    addStatsFromSpecialization(specialization) {
        // if there is a specialization, add +15 to all weapons
        [
            'Assault Rifle Damage',
            'LMG Damage',
            'Marksman Rifle Damage',
            'Pistol Damage',
            'Rifle Damage',
            'Shotgun Damage',
            'SMG Damage'
        ].forEach((dmg) => {
            addValueToStat(stats.Offensive, dmg, 15)
        })

        if (specialization.name.includes('Technician')) {
            stats.Cores.Utility.push(1)
            if (specialization.name.includes('Damage')) {
                addValueToStat(stats.Utility, 'Skill Damage', 10)
            } else {
                addValueToStat(stats.Utility, 'Repair Skills', 10)
            }
        }
    }

    flatWeaponDamage(
        weaponBaseDamage,
        AWD,
        weaponSpecificDamage,
        genericWeaponDamage
    ) {
        return (
            weaponBaseDamage *
            (1 + (AWD + weaponSpecificDamage + genericWeaponDamage) / 100)
        ).toFixed(0);
    }
    calcDmgToArmored(flatDamage, DTA) {
        return Number((flatDamage * (1 + DTA / 100)).toFixed(0));
    }
    calcDmgToOutOfCover(flatDamage, DTOOC) {
        return Number((flatDamage * (1 + DTOOC / 100)).toFixed(0));
    }
    getStatValueFromGunAndGear(
        weaponCore2,
        weaponAttribute1,
        statsObj,
        statName
    ) {
        let value = statsObj[statName] || 0;
        if (weaponCore2 && weaponCore2.stat === statName) {
            value += weaponCore2.StatValue || Number(weaponCore2.max);
        }
        if (weaponAttribute1 && weaponAttribute1.Stat === statName) {
            value += weaponAttribute1.StatValue || Number(weaponAttribute1.Max);
        }
        return value;
    }
    getStatValueFromGunMods(weapon, statName) {
        let value = 0;
        const modSlots = ["optic", "under barrel", "magazine", "muzzle"];
        modSlots.forEach((mod) => {
            const modEl = weapon[mod];
            if (!modEl) {
                return;
            }
            if (modEl.neg === statName) {
                value += Number(modEl.valNeg);
            }
            if (modEl.pos === statName) {
                value += Number(modEl.valPos);
            }
        });
        return value;
    }

    addCHDAndOrHSDOnTopOfFlatDamage(flatDamage, chd, hsd, headshotChance = 0, critChance = 0) {
        let toAdd = 0;
        hsd = Number(hsd);
        chd = Number(chd);
        toAdd += headshotChance > 0 ? hsd * (headshotChance / 100) : 0;
        toAdd += critChance > 0 ? chd * (critChance / 100) : 0;
        // (1 + CHC * CHD + HsD * headshot chance)
        return (flatDamage * (1 + toAdd / 100)).toFixed(0);
    }

    getAdditionalMagSizeFromTheMagazine(magazine) {
        if (!magazine) {
            return 0;
        } else if (magazine.pos == "Extra Rounds") {
            return Number(magazine.valPos);
        }

        return 0;
    }

    calcReloadSpeed(weapReloadSpeed, reloadSpeedModifier) {
        let reloadSpeedBase = weapReloadSpeed;
        return reloadSpeedBase / (1 + reloadSpeedModifier / 100);
    }

    getReloadSpeedModifier(magazine, statsReloadSpeed) {
        let modifier = statsReloadSpeed || 0;
        if (!magazine) {
            // boh
        } else if (magazine.pos == "Reload Speed %") {
            modifier += Number(magazine.valPos);
        } else if (magazine.neg == "Reload Speed %") {
            modifier += Number(magazine.valNeg);
        }
        return modifier;
    }
}


function addValueToStat(statToIncrease, key, value) {
    statToIncrease[key] = statToIncrease[key] ? statToIncrease[key] + value : value;
}


const statsService = new StatsService();

export default statsService;