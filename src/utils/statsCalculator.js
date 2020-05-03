import {
    brandSetBonusesList
} from "./dataImporter";
/**
 * ----- Variables -----
 * baseDMG = Weapon damage
 * AWD = All red cores of a build
 * WD = Specific weapon damage
 * Weapon Increases talents = Optimist and similiar stuff
 * CHD = Critical Hit Damage
 * HSD = Headshot damage
 * Total additive talents from gear = Additive stuff like Focus and vigilance
 * AmpN = Every amplifier talent or attribute = DTA, DttOOC, DTA on the weapon, DttOOC on the weapon
 * 
 * ----- Formula -----
 * CRIT HS = baseDMG*(AWD + WD + Weapon Increases talents ) * (CHD + HSD) * (Total additive talents from gear) * AmpN * AmpN
 * CRIT BODY = baseDMG*(AWD + WD + Weapon Increases talents ) * (CHD) * (Total additive talents from gear) * AmpN * AmpN
 * HS = baseDMG*(AWD + WD + Weapon Increases talents ) * (HSD) * (Total additive talents from gear) * AmpN * AmpN
 * BODY = baseDMG*(AWD + WD + Weapon Increases talents ) * (Total additive talents from gear) * AmpN * AmpN
 */

/**
 * 
 * @param {*} baseDMG baseD = Weapon damage
 * @param {*} AWD A = All red cores of a build
 * @param {*} WD  = Specific weapon damage
 * @param {*} WIT Weapon Increases talents = Optimist and similiar stuff
 * @param {*} CHD Critical Hit Damage
 * @param {*} HSD Headshot damage
 * @param {*} TATfG Total additive talents from gear = Additive stuff like Focus and vigilance
 * @param {*} AMP Am = Every amplifier talent or attribute = DTA, DttOOC, DTA on the weapon, DttOOC on the weapon
 */
const criticalHeadShot = function (baseDMG, AWD, WD, WIT, CHD, HSD, TATfG, AMP) {
    const _baseDMG = baseDMG;
    const _AWD = AWD;
    const _WD = WD;
    const _WIT = WIT;
    const _CHD = CHD;
    const _HSD = HSD;
    const _TATfG = TATfG;
    const _AMP = AMP;
}

// Debounce this
const updateStats = async function (slots) {
    const brandSetBonuses = await brandSetBonusesList.BrandSetBonuses;
    // TODO Automatize get all the stats from mods and gear and other stuff
    let stats = {
        // Spec and brands
        'Assault Rifle Damage': [],
        'LMG Damage': [],
        'Marksman Rifle Damage': [],
        'Pistol Damage': [],
        'Rifle Damage': [],
        'Shotgun Damage': [],
        'SMG Damage': [],
        // Weird weapon specific stuff
        'Rate of Fire %': [],
        'Stability': [],
        'Accuracy': [],
        'Reload Speed %': [],
        'Mag Size %': [],
        'Optimal Range': [],
        'Swap Speed': [],
        // General
        'Weapon Damage': [],
        'Skill Tier': [],
        'Armor': [],
        'Weapon Handling': [],
        'Critical Hit Chance': [],
        'Critical Hit Damage': [],
        'Headshot Damage': [],
        'Armor Regeneration': [],
        'Hazard Protection': [],
        'Health': [],
        'Explosive Resistance': [],
        'Skill Damage': [],
        'Repair Skills': [],
        'Skill Haste': [],
        'Status Effects': [],
        'Damage to TOC': [],
        'Damage to Armor': [],
        'Pulse Haste': [],
        'Damage to Health': [],
        'Melee Damage': [],
        'Armor % on Kill': [],
        'Skill Health': [],
        'Sheild Health': [],
        'Ammo Capacity': [],
        'Armor Regeneration %': [],
        'Protection from Elites': [],
        'Armor on Kill': [],
        'Incoming Repairs': [],
        'Bleed Resistance': [],
        'Blind Resistance': [],
        'Burn Resistance': [],
        'Disrupt Resistance': [],
        'Shock Resistance': [],
        'Skill Duration': [],
    }

    let brands = {};

    let primaryWeapon

    for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        if (slot) {
            if (i < 6) {
                brands[slot.brand] = brands[slot.brand] || 0
                brands[slot.brand]++;
                if (slot.core) {
                    stats[slot.core.label].push(slot.core.StatValue ? slot.core.StatValue : slot.core.Max);
                }
                if (slot.attributeOne) {
                    stats[slot.attributeOne.Stat].push(slot.attributeOne.StatValue ? slot.attributeOne.StatValue : slot.attributeOne.Max);
                }
                if (slot.attributeTwo) {
                    stats[slot.attributeTwo.Stat].push(slot.attributeTwo.StatValue ? slot.attributeTwo.StatValue : slot.attributeTwo.Max);
                }
                if (slot.mod) {
                    stats[slot.mod.Stat].push(slot.mod.StatValue ? slot.mod.StatValue : slot.mod.Max)
                }
                // slot.talent.Talent
            } else if (i < 9) {
                // Not needed for now
                // I can calculate stuff specific per weapon later in the weapon stat component
            } else if (i < 10) {
                stats['Assault Rifle Damage'].push(15);
                stats['LMG Damage'].push(15);
                stats['Marksman Rifle Damage'].push(15);
                stats['Pistol Damage'].push(15);
                stats['Rifle Damage'].push(15);
                stats['Shotgun Damage'].push(15);
                stats['SMG Damage'].push(15);
            }
        }
    }

    for (const brand in brands) {
        // eslint-disable-next-line
        if (brands.hasOwnProperty(brand)) {
            const brandCount = brands[brand];
            for (let idx = 0; idx < brandCount; idx++) {
                const found = brandSetBonuses.find(
                    b => b.Brand == `${brand}${idx}`
                )
                if (found) {
                    stats[found.stat] = stats[found.stat] || []
                    stats[found.stat].push(found.val);
                }
            }
        }
    }

    console.log(stats);

}

export {
    updateStats
}