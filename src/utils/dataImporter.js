import Papa from "papaparse";
import {
    csvToArrayWithKeys
} from './utils';

// TODO Remind me Download CSV file from Github (RAW)
function sourceFilesToVariables(sourceList, listToPopulate, path) {
    for (let i = 0; i < sourceList.length; i++) {
        const sourceRow = sourceList[i];
        const varName = sourceRow.slice(0, sourceRow.length - 4); // Remove.csv
        listToPopulate[varName] = new Promise((resolve, reject) => {
            Papa.parse(`${path}${sourceRow}`, {
                download: true,
                complete: function (incomingData, fileName) {
                    // console.log("Parsing complete:", incomingData, fileName);
                    const headers = incomingData.data.shift();
                    let result = csvToArrayWithKeys(headers, incomingData.data)
                        // .filter((el) => {
                        //     // TODO Remove me
                        //     return el.Quality !== 'Named' &&
                        //         el.Quality !== 'N' &&
                        //         el.Quality !== 'E' &&
                        //         el.Quality !== 'Exotic' ? true : false;
                        // })
                    // console.log(result);
                    resolve(result);
                },
            });
        })
    }
    // console.log(listToPopulate);
}


const gearList = {
    Chest: null,
    Gloves: null,
    Holster: null,
    Kneepads: null,
    Backpack: null,
    Mask: null,
    Weapons: null
};

const gearListSource = [
    'Chest.csv',
    'Gloves.csv',
    'Holster.csv',
    'Kneepads.csv',
    'Mask.csv',
    'Backpack.csv',
    // 'Weapons.csv',
]
const gearPath = './csv/gear/';
sourceFilesToVariables(gearListSource, gearList, gearPath);

const gearAttributesList = {
    Attributes: null
};
const gearAttributesListSource = ['Attributes.csv'];
const gearAtributesPath = './csv/gear/';

sourceFilesToVariables(gearAttributesListSource, gearAttributesList, gearAtributesPath);

const gearModsList = {
    GearMods: null
};
const gearModsListSource = ['GearMods.csv'];
const gearModsPath = './csv/gear/';

sourceFilesToVariables(gearModsListSource, gearModsList, gearModsPath);

const gearTalentsList = {
    GearTalents: null
};
const gearTalentsListSource = ['GearTalents.csv'];
const gearTalentsPath = './csv/gear/';

sourceFilesToVariables(gearTalentsListSource, gearTalentsList, gearTalentsPath);

export {
    gearList,
    gearTalentsList,
    gearAttributesList,
    gearModsList
};