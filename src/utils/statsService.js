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

const stats$ = new BehaviorSubject();
let stats = {
    Offensive: {},
    Defensive: {},
    Utility: {},
    Brands: {},
    Cores: {},
    brands: {},
    cores: []
};

const keyBy = (array, key) => (array || []).reduce((r, x) => ({ ...r, [key ? x[key] : x]: x }), {});

class StatsService {
    brandSetBonuses = null;
    statsMapping = null;

    resetStats() {
        stats = {
            Offensive: {},
            Defensive: {},
            Utility: {},
            Brands: {},
            Cores: {},
            brands: {},
            cores: []
        };
    }

    getStats$() {
        return stats$.asObservable()
            .pipe(debounce(() => timer(300)));
    }

    async updateStats(data) {
        this.resetStats()
        this.brandSetBonuses = this.brandSetBonuses || await gearData.BrandSetBonuses;
        if (!this.statsMapping) {
            const statsMapping = await gearData.StatsMapping
            this.statsMapping = this.statsMapping || keyBy(statsMapping, 'Stat');
        }
        this.addStatsFromGear(data.gear)

        stats$.next(stats);
    }

    addStatsFromWeapon(weapon) { }

    async addStatsFromGear(gearArr) {
        const statTypes = {
            'O': 'Offensive',
            'D': 'Defensive',
            'U': 'Utility',
        }
        for (let i = 0; i < gearArr.length; i++) {
            const gear = gearArr[i];
            if (gear) {
                // Add to brands OBJ
                stats.brands[gear.brand] = stats.brands[gear.brand] || []
                stats.brands[gear.brand].push(null);
                if (gear.core) {
                    stats.cores.push(gear.core);
                }
                const keys = ['attributeOne', 'attributeTwo', 'mod',]
                for (let keyI = 0; keyI < keys.length; keyI++) {
                    const key = keys[keyI];
                    const stat = gear[key]
                    if (stat) {
                        const val = stat.StatValue || Number(stat.Max);
                        const prevVal = stats[statTypes[stat.Type]][stat.Stat] || 0;
                        stats[statTypes[stat.Type]][stat.Stat] = prevVal + val;
                    }
                }
            }
        }

        for (const brand in stats.brands) {
            // eslint-disable-next-line
            if (stats.brands.hasOwnProperty(brand)) {
                const brandCount = stats.brands[brand].length;
                for (let idx = 0; idx < brandCount; idx++) {
                    const found = this.brandSetBonuses.find(
                        b => b.Brand == `${brand}${idx}`
                    )
                    if (found) {
                        stats.brands[brand][idx] = `${found.stat} ${found.val}`;
                        const statType = this.statsMapping[found.stat].Type;
                        const prevVal = stats[statTypes[statType]][found.stat] || 0;
                        stats[statTypes[statType]][found.stat] = prevVal + Number(found.val);
                    }
                }
            }
        }
        console.log(stats)
    }

    // wearableEdgeCase(wearable) {
    //     const edgeCases = ["Acosta's Go-Bag"]
    //     return edgeCases.indexOf(wearable.itemName);
    // }

    // handleWearableEdgeCase(wearable, wearableEdgeCaseID) {
    //     switch (wearableEdgeCaseID) {
    //         case 0:
    //             brands['Exotic'][1] = 'Repair Skills  +10%';
    //             brands['Exotic'][2] = 'Status Effects +10%';
    //             stats['Status Effects'] = stats['Status Effects'] || [];
    //             stats['Status Effects'].push('10');
    //             stats['Repair Skills'] = stats['Repair Skills'] || [];
    //             stats['Repair Skills'].push('10');
    //             break;
    //         default:
    //             break;
    //     }
    // }

    // addStatsFromSpecialization(specialization) {
    //     if (specialization) {
    //         stats['Assault Rifle Damage'] = stats['Assault Rifle Damage'] || [];
    //         stats['LMG Damage'] = stats['LMG Damage'] || [];
    //         stats['Marksman Rifle Damage'] = stats['Marksman Rifle Damage'] || [];
    //         stats['Pistol Damage'] = stats['Pistol Damage'] || [];
    //         stats['Rifle Damage'] = stats['Rifle Damage'] || [];
    //         stats['Shotgun Damage'] = stats['Shotgun Damage'] || [];
    //         stats['SMG Damage'] = stats['SMG Damage'] || [];
    //         stats['Assault Rifle Damage'].push(15);
    //         stats['LMG Damage'].push(15);
    //         stats['Marksman Rifle Damage'].push(15);
    //         stats['Pistol Damage'].push(15);
    //         stats['Rifle Damage'].push(15);
    //         stats['Shotgun Damage'].push(15);
    //         stats['SMG Damage'].push(15);
    //     }
    // }
}

const statsService = new StatsService();

export default statsService;