import Papa from "papaparse";
import {
    csvToArrayWithKeys
} from './utils';

const currentDBVersion = 1;

const wipeLocalStorage = !!localStorage.getItem('localDBversion')
if (wipeLocalStorage) {
    window.localStorage.clear(); //clear all localstorage after new per sheet versioning
}

function getFromGoogleDrive(dataSources, listToPopulate) {
    for (let i = 0; i < dataSources.length; i++) {
        const key = dataSources[i].key;
        const url = newUrlBuilder(dataSources[i].url);
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

/**
 * Changed because CORS is broken right now on google SHEETS https://support.google.com/docs/thread/56845119?hl=en&msgid=64018659
 * Sheet1 is which sheet i'm loading in order the custom name does not work
 * @param {*} key key is the string in the Gdrive sheet URL, in particular after /d/ and before /edit 
 */
function newUrlBuilder(key) {
    return `https://docs.google.com/spreadsheets/d/${key}/gviz/tq?tqx=out:csv&sheet=Sheet1`
}

const weaponsDataSource = [{
    key: 'Weapons',
    url: '12hCYqKgm1dY4Lk-alwwGCc6-YYd2fd2kZnpqNWiugZg'
},
{
    key: 'WeaponAttributes',
    url: '1SjpqM6Zx-JGl7JxBBs19CjQVjzSLAxG-AqToLggPtxE'
},
{
    key: 'WeaponMods',
    url: '1HTeu33nQ9gZoGdoSJTvI38qAKq8_aX1xxN590Rl8LXw'
},
{
    key: 'WeaponTalents',
    url: '1Je9EjrgwXqv0Ehh1xUmCzQtbYfpoWBR_nUEiMUAql-U'
},
];
getFromGoogleDrive(weaponsDataSource, weaponsData);

const specializationList = {
    Specialization: null
};

const specializationListSource = [{
    key: 'Specialization',
    url: '1sDygGjqldslj9MrDzQRg3JDSiIaEnnkqTvvkeO_eMg8'
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
    url: '1VKEn9sarM3pJIUib7cl4zw-L3CCEgylSKJqh6-Ry29E'
},
{
    key: 'Gloves',
    url: '16cTJWwqrsjRccroeS9zFuY-sAhOyWEUgaTiFWCyyCz8'
},
{
    key: 'Holster',
    url: '11wqBX2umxym_GARhBIebMBQ1LdwcWRUDSPy0d1V3o0U'
},
{
    key: 'Kneepads',
    url: '1QNIlpAx5cPvp0ZtlWiv3NJijUxe-wYu-8BwRfThXn98'
},
{
    key: 'Backpack',
    url: '1mdnKkX2C6CVK0BGC7EJPpK6lgQYKhl_sqrbAGqGTk58'
},
{
    key: 'Mask',
    url: '1R5fGkOaT3pBMIh954b-eGIuhz0RcUh-8dXM6HAd7BP8'
},
{
    key: 'Attributes',
    url: '18Z_jX_jPBUDa5oIoQ6aQWd9M7avPYLAWuN88Rqb_hS4'
},
{
    key: 'GearMods',
    url: '1hF6JiKyJBMuZB3glun-nXAynEtzqEnJ6zeCeofTVNko'
},
{
    key: 'GearTalents',
    url: '1HkJBxyUpJSxsPNd2s120P-_v5QWJ1t7a19JLDFqNi4E'
},
{
    key: 'BrandSetBonuses',
    url: '1csi8qk1U5g0zGjez3wIIBV-9Wc-VpQBPFwM3AdK2_oo'
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