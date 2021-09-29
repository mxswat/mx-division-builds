const attr = require('./WeaponAttributes - WeaponAttributes.json')
const fs = require('fs');
const utils = require('../utils');

const new_weaps_attr = []
const typeMaps = {
  'U': 'utility',
  'O': 'offensive',
  'D': 'defensive'
}

for (let index = 0; index < attr.length; index++) {
  const gear_attribute = attr[index];
  const new_attr = {
    id: utils.strndrdize(gear_attribute.Stat),
    max: gear_attribute.Max,
    min: 0,
    ...(gear_attribute.Quality == "N" || gear_attribute.Quality == "E"
      ? { based_on: utils.strndrdize(gear_attribute.Stat) }
      : {}
    ),
    tags: [
      'is_gear_attribute',
      ...(gear_attribute.Quality == "N" || gear_attribute.Quality == "E" ? ['is_hidden'] : []),
      `type:${typeMaps[gear_attribute.Type]}`,
      'value_type:percentage',
    ]
  }
  new_weaps_attr.push(new_attr)
}

fs.writeFile('./new-weap-attr.json', JSON.stringify(new_weaps_attr), (err) => {
  if (err) throw err;
  console.log('Data written to file');
});


console.log(new_weaps_attr)
console.log('done')