const gear_attr = require('./GearAttributes - Attributes.json')
const fs = require('fs');
const utils = require('./utils');

const new_gear_attr = []
const typeMaps = {
  'U': 'utility',
  'O': 'offensive',
  'D': 'defensive'
}

for (let index = 0; index < gear_attr.length; index++) {
  const gear_attribute = gear_attr[index];
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
  new_gear_attr.push(new_attr)
}

fs.writeFile('./new-gear-attr.json', JSON.stringify(new_gear_attr), (err) => {
  if (err) throw err;
  console.log('Data written to file');
});


console.log(new_gear_attr)
console.log('done')