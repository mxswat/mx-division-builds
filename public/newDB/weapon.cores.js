const weapons = require('./Weapons - Weapons.json')
const fs = require('fs');
const utils = require('./utils');

const weapon_cores = {}

for (let i = 0; i < weapons.length; i++) {
  const weapon = weapons[i];

  const id = utils.strndrdize(weapon['Core 1'])
  const new_core = {
    id: id,
    max: weapon['Core 1 Max'],
    min: 0,
    tags: ['offensive'],
    category: ['weapon_core_1'],
  }

  weapon_cores[id] = weapon_cores[id] || new_core
}

console.log(weapon_cores)

fs.writeFile('weapon-cores.json', JSON.stringify(Object.values(weapon_cores)), (err) => {
  if (err) throw err;
  console.log('Data written to file');
});

console.log('Done')
