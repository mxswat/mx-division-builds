import Papa from "papaparse";
import {
    csvToArrayWithKeys
} from './utils';

const currentDBVersion = 1;

function getFromGoogleDrive(dataSources, listToPopulate) {
    for (let i = 0; i < dataSources.length; i++) {
        const key = dataSources[i].key;
        const url = dataSources[i].url;
        const localDBVersionKey = `localDBversion-${key}`;
        const localDBversion = Number(localStorage.getItem(localDBVersionKey));
        if (!localDBversion || localDBversion < currentDBVersion) {
            localStorage.setItem(localDBVersionKey, currentDBVersion);
            listToPopulate[key] = new Promise((resolve, reject) => {
                Papa.parse(url, {
                    download: true,
                    complete: function (incomingData, fileName) {
                        // console.log("Parsing complete:", incomingData, fileName);
                        const headers = incomingData.data.shift();
                        let result = csvToArrayWithKeys(headers, incomingData.data)
                        localStorage.setItem(key, JSON.stringify(result));
                        resolve(result);
                    },
                    error: function returnError(params) {
                        reject('Too many request, probably because of using CORS any where');
                    }
                });
            })
        } else {
            const localData = localStorage.getItem(key);
            listToPopulate[key] = Promise.resolve(JSON.parse(localData));
        }
    }
    // console.log(listToPopulate);
}

const weaponsData = {
    Weapons: null,
    WeaponAttributes: null,
    WeaponMods: null,
    WeaponTalents: null
};

const weaponsDataSource = [{
    key: 'Weapons',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRcPVplM-DEzkjImVGWGrHfqNTYuz-e6ONp-6e5PULADZPeco7idUHJa47ZEV_AaoAoikCtzwRxpV09/pub?output=csv'
},
{
    key: 'WeaponAttributes',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQLm3_ypkmAuuAHZ0uTfpZmEm19DjTEhwNtuH3m00-EM2fHbj_jrk-nm2pcMcZUunp3wVOV_JMaMYd4/pub?output=csv'
},
{
    key: 'WeaponMods',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR6qLETyBTl4WNH8lpHo5wMOjFz3XSRnVknew1GbM2zCMY6U1EVZ5SKyflgja8uWzEkvFXa59hrB2Vm/pub?gid=1315660561&single=true&output=csv'
},
{
    key: 'WeaponTalents',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSNOjJ5YpeNF28qwwffwyCJLqfoXCmnwkvcCLHJfc_eDUL6oEAMgd0aJJGSaYECveRWnBqDFJBNUQ6d/pub?output=csv'
},
];
getFromGoogleDrive(weaponsDataSource, weaponsData);

const specializationList = {
    Specialization: null
};

const specializationListSource = [{
    key: 'Specialization',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTHwYMNAuAnSwMdRZFQv5ULk8QOxQn94o3fCZxSUErUfmzoFQCrd41VoFR8IG1PEgnNgHV8WLysdepN/pub?output=csv'
}];

getFromGoogleDrive(specializationListSource, specializationList);

const gearData = {
    Chest: null,
    Gloves: null,
    Holster: null,
    Kneepads: null,
    Backpack: null,
    Mask: null,
    Attributes: null,
    GearMods: null,
    GearTalents: null,
    BrandSetBonuses: null,
};

const wearableSource = [{
    key: 'Chest',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDlfmrpQYBmwHpBf1qMbBufc47cX-DuratgGK22WQCHeG7PYjPO7nScWag4dakrPgj5gjFYDveNQrN/pub?output=csv'
},
{
    key: 'Gloves',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpw_aHvN9IUfnjE2Ho70KZ-bJqZmKovsVuPBggkbtpqbSX82slObIRcl0u82tXeIztnL2wAQ4L_jGM/pub?output=csv'
},
{
    key: 'Holster',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSJ1_Ar4eCdvb9XlgClSmxSNs8ilY8ecRb7QX20X_6NF3TeJNnRNLVOrzgxyoge4Arq1OzvxwGsZBad/pub?output=csv'
},
{
    key: 'Kneepads',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLypQ-q9ljPhLCJTGqL5vIaNqiAAMDfF8bzrbEi-Tquxj4hNZhD10lDrmhQ1JcLVCyIaib6OQgdvGN/pub?output=csv'
},
{
    key: 'Backpack',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRMG0EQyPzT1pq3V0eeosoTBVoQnjau6QqAQaguXCv3rGAa2UERqZmlkJceDLMR5mzl5XKQe6XOmcAM/pub?output=csv'
},
{
    key: 'Mask',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTuq4IcNINb2aR-yMn-oG1F7zM4Bdo3twa4LXjr3WVSEB2oSjB_T6MBa84yYO4tFIOlIwSA9kSzp63v/pub?output=csv'
},
{
    key: 'Attributes',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQdeBxM0F_-aSuGz8qjdn8K5wuV48p4mzwbw10vjsshrus_b7iOmYJhI8p8q1T6-0W53GTQFbrffMes/pub?output=csv'
},
{
    key: 'GearMods',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSkeQl0E8FLDdqYdH4q2Br6oyEZqqeGjIeU9KngsGWR2HJ_k3oyWhAxlOGNLuyMJj82-314yBj_u-h8/pub?output=csv'
},
{
    key: 'GearTalents',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTX_6lhgAseVURudnhRQduu64IVbGTdE66kImMkq0SN1QlseS4Udcqn4QBHi3Hb2Rgl_v6mAWTYcAWT/pub?output=csv'
},
{
    key: 'BrandSetBonuses',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5SjdRZqnZXMoq08qIekMFEV6FB37hxYkrg2q0DyTol6mvD60yLyWdyJrvybnr32_80h86Y-_NXJOh/pub?output=csv'
},
];

getFromGoogleDrive(wearableSource, gearData);

const allDataPromies = [
    ...Object.values(gearData),
    ...Object.values(weaponsData),
    ...Object.values(specializationList),
]

export {
    allDataPromies,
    gearData,
    weaponsData,
    specializationList,
};