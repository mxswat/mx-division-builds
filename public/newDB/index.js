const weapons = require('./Weapons - Weapons.json')

const newWeapons = []

function strndrdize(string) {
  return string.replace(/[^A-Z0-9]+/ig, "_").toLowerCase()
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
      weapon['Core 2'] && `core:${strndrdize(weapon['Core 2'])}`,
      `attribute:${strndrdize(weapon['Attribute 1'])}`,
      `talent:${strndrdize(weapon['Talent'])}`,
    ],
    tags: [

    ]
  }
  newWeapons.push(newWeapon)
}

console.log(newWeapons)
console.log('Done')
