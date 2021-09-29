const gear_talent = require('./WeaponTalents - WeaponTalents.json')
const fs = require('fs');
const utils = require('../utils');

const new_talents = []

for (let i = 0; i < gear_talent.length; i++) {
  const talent = gear_talent[i];

  const new_talent = {
    id: utils.strndrdize(talent.Name),
    tags: [
      ...(talent.Quality == "N" || talent.Quality == "E" || talent.Quality == "S"  ? ['is_hidden'] : []),
      'is_weapon_talent',
      ...( talent['Assault Rifle'] ? [`slot_lock:${utils.strndrdize('Assault Rifle')}`] : []),
      ...( talent.Rifle ? [`slot_lock:${utils.strndrdize('Rifle')}`] : []),
      ...( talent['Marksman Rifle'] ? [`slot_lock:${utils.strndrdize('Marksman Rifle')}`] : []),
      ...( talent.SMG ? [`slot_lock:${utils.strndrdize('SMG')}`] : []),
      ...( talent.LMG ? [`slot_lock:${utils.strndrdize('LMG')}`] : []),
      ...( talent.Pistol ? [`slot_lock:${utils.strndrdize('Pistol')}`] : []),
      ...( talent.Shotgun ? [`slot_lock:${utils.strndrdize('Shotgun')}`] : []),
    ]
  }

  new_talents.push(new_talent)
}


fs.writeFile('./new-weap-talents.json', JSON.stringify(new_talents), (err) => {
  if (err) throw err;
  console.log('Data written to file');
});