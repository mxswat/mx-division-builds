exports.strndrdize = function strndrdize(string)  {
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