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
 * @param {*} AMP Every amplifier talent or attribute = DTA, DttOOC, DTA on the weapon, DttOOC on the weapon
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