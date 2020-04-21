const zipObject = (keys, values) =>
    keys.reduce((acc, key, idx) => {
        acc[key] = values[idx];
        return acc;
    }, {});

/**
 * Gets a CSV converted to array using PapaParse
 * input is like header = ['a'], data = [[1],[2],[3]]
 * and output it like [{a:1},{a:2},{a:3}]
 * @param {*} headers 
 * @param {*} data 
 */
const csvToArrayWithKeys = (headers, data) => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
        const dataRow = data[i];
        const object = zipObject(headers, dataRow);
        // Never start form 0 because I'm lazy to handle the url conversion if all indexes are 0
        // TODO Handle it in code clean up sprint
        // Nevermind maybe i'll actualy use the 0 as "empty"
        object['index'] = i + 1; 
        result.push(object);
    }
    return result;
}

const typeToImgSrc = {
    'O': 'icons/offence.png',
    'U': 'icons/utility.png',
    'D': 'icons/defence.png',
}

export {
    zipObject,
    csvToArrayWithKeys,
    typeToImgSrc
};