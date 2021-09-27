const weapons = require('./Weapons - Weapons.json')

const newWeapons = []

function strndrdize(string) {
  if (Number.isInteger(string)) {
    return string
  }
  // Remove special chars, and the replace spaces with _
  return string.replace(/[^a-zA-Z ]/g, "").replace(/[^A-Z0-9]+/ig, "_").toLowerCase()
}

for (let i = 0; i < weapons.length; i++) {
  const weapon = weapons[i];

  const newWeapon = {
    id: weapon.Name.replace(/[^A-Z0-9]+/ig, "_").toLowerCase(),
    slot: [...((weapon.Slot == 'P') ? ['primary' , 'secondary'] : ['sidearm'])],
    attributes: [
      `type:${strndrdize(weapon['Weapon Type'])}`,
      `damage:${strndrdize(weapon['Base Damage'])}`,
      `rpm:${strndrdize(weapon['RPM'])}`,
      `range:${strndrdize(weapon['Optimal Range'])}`,
      `mag_size:${strndrdize(weapon['Mag Size'])}`,
      `reload_speed:${strndrdize(weapon['Reload Speed (ms)'])}`,
      `hsd:${strndrdize(weapon['HSD'])}`,
      `core:${strndrdize(weapon['Core 1'])}`,
      ...(weapon['Core 2'] ? [`core:${strndrdize(weapon['Core 2'])}`] : []),
      `attribute:${strndrdize(weapon['Attribute 1'])}`,
      `talent:${strndrdize(weapon['Talent'])}`,
      ...(weapon['Optics'].split(' / ').map(x => `mod_optics:${strndrdize(x)}`)),
      ...(weapon['Under Barrel'].split(' / ').map(x => `mod_underbarrel:${strndrdize(x)}`)),
      ...(weapon['Magazine'].split(' / ').map(x => `mod_magazine:${strndrdize(x)}`)),
      ...(weapon['Muzzle'].split(' / ').map(x => `mod_muzzle:${strndrdize(x)}`)),
    ],
    tags: [
      weapon.Quality == 'Exotic' 
        ? 'is_exotic'
        :  weapon.Quality == 'Named' 
            ? 'is_named'
            : 'is_high_end'
    ]
  }
  newWeapons.push(newWeapon)
}

console.log(newWeapons)
console.log('Done')
