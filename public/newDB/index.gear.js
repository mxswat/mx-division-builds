const gear_items = require('./gear_items.json')
const fs = require('fs');

function strndrdize(string) {
  if (Number.isInteger(string)) {
    return string
  }
  // if is 'A' then return the wildcard
  if (string == 'A') {
    return '*'
  }
  // Remove special chars, and the replace spaces with _
  return string.replace(/[^a-zA-Z0-9 ]/g, "").replace(/[^A-Z0-9]+/ig, "_").toLowerCase()
}

const new_gear_items = []

for (let i = 0; i < gear_items.length; i++) {
  const gear_item = gear_items[i];
  const new_gear_item = {
    id: strndrdize(gear_item.Name),
    set: `${strndrdize(gear_item.Brand)}`,
    slots: [
      ...(
        Object.keys(gear_item.Slots)
          .filter(x => gear_item.Slots[x])
          .map(x => `${strndrdize(x)}`)
      )
    ],
    properties: [
      ...(gear_item.Cores.map(x => { return { core: `${strndrdize(x)}` } })),
      ...(gear_item.Attributes.map(x => { return { attribute: `${strndrdize(x)}` } })),
      ...(
        !!gear_item.Talents.join()
          ? gear_item.Talents.map(x => { return { talent: `${strndrdize(x)}` } })
          : []
      ),
      ...(
        Object.keys(gear_item.ModsPerSlot)
          .filter(x => gear_item.ModsPerSlot[x])
          .map(x => { return { [`mod_${strndrdize(x)}`]: '*' } }) // * because in TD2 mod can be used with any piece now
      )
    ],
    tags: [
      {
        [gear_item.Quality == 'Exotic'
          ? 'is_exotic'
          : gear_item.Quality == 'Named'
            ? 'is_named'
            : gear_item.Quality == 'Gearset'
              ? 'is_gear_set'
              : 'is_high_end']: true
      }
    ],
  }

  new_gear_items.push(new_gear_item)
}


console.log(new_gear_items)

fs.writeFile('./new_gear_items.json', JSON.stringify(new_gear_items), (err) => {
  if (err) throw err;
  console.log('Data written to file');
});

console.log('Done')
