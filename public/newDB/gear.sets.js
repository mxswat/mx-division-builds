const sets = require('./BrandSetBonuses - BrandSetBonuses.json')
const fs = require('fs');
const utils = require('./utils');

const new_sets = {}

for (let i = 0; i < sets.length; i++) {
  const set = sets[i];
  const set_name =  utils.strndrdize(set.Brand.slice(0, -1))
  
  let stat0 = {}
  stat0[utils.strndrdize(set.stat)] = set.val
  
  let stat1 = null
  if (set.stat1) {
    stat1 = {}
    stat1[utils.strndrdize(set.stat1)] = set.val1
  }

  if (set.Talent) {
    stat0 = {}
    stat0[utils.strndrdize(set.Talent)] = true
  }

  const tiers = [{
    ...stat0,
    ...stat1
  }]

  if (new_sets[set_name]) {
    new_sets[set_name].tiers.push(tiers[0])
  } else {
    const tier_starts_at = Number(set.Brand.slice(-1))
    const new_set = {
      id: set_name,
      tiers: (tier_starts_at === 0 ? tiers : [{}, ...tiers])
    }
    new_sets[set_name] = new_set
  }
}

console.log(new_sets)

fs.writeFile('./new_gear_sets.json', JSON.stringify(Object.values(new_sets)), (err) => {
  if (err) throw err;
  console.log('Data written to file');
});