Build base

M1A Classic Base: 235060 / Baker's Dozen From Excell
M1A Classic Base: 235100 / Baker's Dozen From Game UI

AWD 92.8 (All reds on the gear)
Rifle Damage 37 (Specialization + GunDMG + Overlord)
CHD 113.3 ()
HSD 100
Coyote CHD 25 
TDO 5% M1A Attribute
TDO 8% Glove
TDOC 8% Kneepad
Focus 50
Vigilance 25

On named Elite With Armor (Shooting range) 5 Meters Distance Focus Max Charge
Damage:
Body 1153635
Body Crit 2749113
HS 2307271
HS CRIT 3902750


BANNED Formula

baseDMG*(AWD+WD+Weapon Increases talents)*(CHD + HSD) * (Total increases talents from Gear ???) * AmpN * AmpN
AmpN is an "Amplifies" talent or DtA, DtOOC, DtH

baseDMG * (1 + AWD + Rifle Damage + No Talent) * (1 + CHD + HSD + Coyote) * (1 + ????) * Focus * Vigilance * Glove * Kneepad * M1A_TOC

235060 * (1 + 0.928 + 0.37 + 0) * (1 + 1.133 + 1 + 0.25) * 1 * 1.5 * 1.25 * 1.08 * 1.08 * 1.05 = 4196322.291518155

235060 * (1 + 0.928 + 0.37 + 0) * (1 + 1.133 + 1 + 0.25) * (1 + 0.5 + 0.25) * 1.08 * 1.08 * 1.05 = 3916567

Max 2 digits
235060 * (1 + 0.92 + 0.37 + 0) * (1 + 1.13 + 1 + 0.25) * (1 + 0.5 + 0.25) * 1.08 * 1.08 * 1.05 = 389947


R1 Formula

final damage = (base dmg + (base dmg  * additive dmg = gear, shd levels, brand sets, spec)+(base dmg * weapon dmg talents)
(((((final damage + (final damage * critical damage) + (final damage * headshot damage) + (final damage * heashot damage talents ) + (final damage * ciritcal damage talents)) * (multiplicative damage))) * ( backpack + chest talent))

finalDamage = (235060 + (235060 * (0.928 + 0.37))) + 0; // UI Damage
CRIT-HS = (((((finalDamage + (finalDamage * (1.133 + 0.25)) + (finalDamage * 1) + (finalDamage * 0) + (finalDamage * 0)) * (1 + 0.08 + 0.08 + 0.05))) * ( 1 + 0.25 + 0.5)))
HS = (((((finalDamage + (finalDamage * 1) + (finalDamage * 0) + (finalDamage * 0)) * (1 + 0.08 + 0.08 + 0.05))) * ( 1 + 0.25 + 0.5)))
CRIT-BODY = (((((finalDamage + (finalDamage * (1.133 + 0.25)) + (finalDamage * 0) + (finalDamage * 0)) * (1 + 0.08 + 0.08 + 0.05))) * ( 1 + 0.25 + 0.5)))
BODY = (((((finalDamage + (finalDamage * 0) + (finalDamage * 0)) * (1 + 0.08 + 0.08 + 0.05))) * ( 1 + 0.25 + 0.5)))

R1 Formula + MX
finalDamage = (235060 + (235060 * (0.928 + 0.37))) + 0; // UI Damage
BODY = (((((finalDamage + (finalDamage * 0) + (finalDamage * 0)) * (1 + 0.08 + 0.08 + 0.05))) * ( 1 + 0.25 + 0.5)))
