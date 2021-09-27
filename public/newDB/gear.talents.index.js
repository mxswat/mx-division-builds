const gear_talent = require('./GearTalents - GearTalents.json')
const fs = require('fs');
const utils = require('./utils');

const new_talents = []

for (let i = 0; i < gear_talent.length; i++) {
  const talent = gear_talent[i];

  const new_talent = {
    id: utils.strndrdize(talent.Talent),
    tags: [
      ...(talent.Quality == "N" || talent.Quality == "E" || talent.Quality == "S"  ? ['is_hidden'] : []),
      'is_gear_talent',
      `slot_lock:${utils.strndrdize(talent.Slot)}`
    ]
  }

  new_talents.push(new_talent)
}


fs.writeFile('./new-gear-talents.json', JSON.stringify(new_talents), (err) => {
  if (err) throw err;
  console.log('Data written to file');
});