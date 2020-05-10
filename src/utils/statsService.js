import {
    BehaviorSubject,
    timer
} from 'rxjs';

import {
    brandSetBonusesList
} from "./dataImporter";

import {
    debounce
} from "rxjs/operators";

const stats$ = new BehaviorSubject();
const brands$ = new BehaviorSubject();
let stats = {};
let brands = {};

class StatsService {
    resetStats() {
        stats = {};
        brands = {};
    }
    getStats$() {
        return stats$.asObservable()
            .pipe(debounce(() => timer(300)));
    }

    getBrands$() {
        return brands$.asObservable()
            .pipe(debounce(() => timer(300)));
    }

    afterEncoding() {
        this.updateBrandsStats().then(() => {
            stats$.next(stats);
            brands$.next(brands);
        })
    }

    async updateBrandsStats() {
        const brandSetBonuses = await brandSetBonusesList.BrandSetBonuses;
        for (const brand in brands) {
            // eslint-disable-next-line
            if (brands.hasOwnProperty(brand)) {
                const brandCount = brands[brand].length;
                for (let idx = 0; idx < brandCount; idx++) {
                    const found = brandSetBonuses.find(
                        b => b.Brand == `${brand}${idx}`
                    )
                    if (found) {
                        brands[brand][idx] = `${found.stat} +${found.val}`;
                        stats[found.stat] = stats[found.stat] || []
                        stats[found.stat].push(found.val);
                    }
                }
            }
        }
    }

    addStatsFromWeapon(weapon) {}

    addStatsFromwWearable(wearable) {
        if (wearable) {
            brands[wearable.brand] = brands[wearable.brand] || []
            brands[wearable.brand].push(null);
            const wearableEdgeCase = this.wearableEdgeCase(wearable)
            if (wearableEdgeCase > -1) {
                this.handleWearableEdgeCase(wearable, wearableEdgeCase);
            }

            if (wearable.core) {
                stats[wearable.core.label] = stats[wearable.core.label] || [];
                stats[wearable.core.label].push(wearable.core.StatValue ? wearable.core.StatValue : wearable.core.Max);
            }
            if (wearable.attributeOne) {
                stats[wearable.attributeOne.Stat] = stats[wearable.attributeOne.Stat] || [];
                stats[wearable.attributeOne.Stat].push(wearable.attributeOne.StatValue ? wearable.attributeOne.StatValue : wearable.attributeOne.Max);
            }
            if (wearable.attributeTwo) {
                stats[wearable.attributeTwo.Stat] = stats[wearable.attributeTwo.Stat] || [];
                stats[wearable.attributeTwo.Stat].push(wearable.attributeTwo.StatValue ? wearable.attributeTwo.StatValue : wearable.attributeTwo.Max);
            }
            if (wearable.mod) {
                stats[wearable.mod.Stat] = stats[wearable.mod.Stat] || [];
                stats[wearable.mod.Stat].push(wearable.mod.StatValue ? wearable.mod.StatValue : wearable.mod.Max)
            }
        }
    }

    wearableEdgeCase(wearable) {
        const edgeCases = ["Acosta's Go-Bag"]
        return edgeCases.indexOf(wearable.itemName);
    }

    handleWearableEdgeCase(wearable, wearableEdgeCaseID) {
        switch (wearableEdgeCaseID) {
            case 0:
                brands['Exotic'][1] = 'Repair Skills  +10%';
                brands['Exotic'][2] = 'Status Effects +10%';
                stats['Status Effects'] = stats['Status Effects'] || [];
                stats['Status Effects'].push('10');
                stats['Repair Skills'] = stats['Repair Skills'] || [];
                stats['Repair Skills'].push('10');
                break;
            default:
                break;
        }
    }

    addStatsFromSpecialization(specialization) {
        stats['Assault Rifle Damage'] = stats['Assault Rifle Damage'] || [];
        stats['LMG Damage'] = stats['LMG Damage'] || [];
        stats['Marksman Rifle Damage'] = stats['Marksman Rifle Damage'] || [];
        stats['Pistol Damage'] = stats['Pistol Damage'] || [];
        stats['Rifle Damage'] = stats['Rifle Damage'] || [];
        stats['Shotgun Damage'] = stats['Shotgun Damage'] || [];
        stats['SMG Damage'] = stats['SMG Damage'] || [];
        stats['Assault Rifle Damage'].push(15);
        stats['LMG Damage'].push(15);
        stats['Marksman Rifle Damage'].push(15);
        stats['Pistol Damage'].push(15);
        stats['Rifle Damage'].push(15);
        stats['Shotgun Damage'].push(15);
        stats['SMG Damage'].push(15);
    }

}

const statsService = new StatsService();

export default statsService;