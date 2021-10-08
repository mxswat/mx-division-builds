const mods = require('./GearMods - GearMods.json')
const fs = require('fs');
const utils = require('./utils');

const new_mods = []

const typeMaps = {
  'U': 'utility',
  'O': 'offensive',
  'D': 'defensive'
}

for (let i = 0; i < mods.length; i++) {
  const mod = mods[i];
  const mod_name =  utils.strndrdize(mod.Stat)
  new_mods.push({
    id: mod_name,
    max: mod.Max,
    tags: [typeMaps[mod.Type]],
    category: [
      'mod_chest',
      'mod_gloves',
      'mod_holster',
      'mod_kneepads',
      'mod_backpack',
      'mod_mask',
    ]
  })
}

console.log(new_mods)

fs.writeFile('./new_gear_mods.json', JSON.stringify(Object.values(new_mods)), (err) => {
  if (err) throw err;
  console.log('Data written to file');
});