import Papa from "papaparse";
import {
    csvToArrayWithKeys,
    getAppRootPath,
    groupArrayOfObjectsByKey
} from './utils';
let IsEverythingLoadedPromiseResolve, IsEverythingLoadedPromiseReject;

const IsEverythingLoadedPromise = new Promise(function (resolve, reject) {
    IsEverythingLoadedPromiseResolve = resolve;
    IsEverythingLoadedPromiseReject = reject;
});

const ClientDBVersion = Number(localStorage.getItem('localDBversion')) || 0;
let RemoteDBVersion = null;

function getFromGoogleDrive(dataSources, listToPopulate) {
    for (let i = 0; i < dataSources.length; i++) {
        const DataTableName = dataSources[i].key;
        const url = dataSources[i].url;
        if (!ClientDBVersion || ClientDBVersion < RemoteDBVersion) {
            listToPopulate[DataTableName] = new Promise((resolve, reject) => {
                Papa.parse(url, {
                    download: true,
                    complete: function (incomingData, fileName) {
                        try {
                            // console.log("Parsing complete:", incomingData, fileName);
                            const headers = incomingData.data.shift();
                            let result = csvToArrayWithKeys(headers, incomingData.data)
                            localStorage.setItem(DataTableName, JSON.stringify(result));
                            resolve(result);
                        } catch (error) {
                            reject('Something when wrong during the download of one data table');
                        }
                    },
                    error: function returnError(params) {
                        reject('Something when wrong during the download of one data table');
                    }
                });
            })
        } else {
            const localData = localStorage.getItem(DataTableName);
            listToPopulate[DataTableName] = Promise.resolve(JSON.parse(localData));
        }
    }
}

const urls = ['gear', 'weapons']

const VendorPromises = Promise.all(urls.map(url => fetch(`${getAppRootPath()}vendors/${url}.json?${new Date().toISOString()}`)
    .then(e => e.json())))
    .then(data => {
        const gear = data[0].map(g => {
            return {
                Name: g.rarity.includes('named') ? g.name : g.brand,
                Slot: g.slot,
                Vendor: g.vendor
            }
        })

        const weapons = data[1].map(g => {
            return {
                Name: g.rarity.includes('named') ? g.name.replace(/-.*/i, '').trim() : g.name,
                Vendor: g.vendor
            }
        })
        const gearBySlot = groupArrayOfObjectsByKey(gear, 'Slot')
        return {
            Gear: gearBySlot,
            Weapons: weapons
        };
    });

// DB.version path
const path = getAppRootPath() + 'DB.Version';

// Disable browser cache for the DB version using new Date
fetch(`${path}?${new Date().toISOString()}`, { method: 'GET', })
    .then(response => response.blob())
    .then(blob => blob.text())
    .then((DownloadedDBVersion) => {
        RemoteDBVersion = Number(DownloadedDBVersion);
        if (DownloadedDBVersion > ClientDBVersion) {
            window.localStorage.clear(); //clear all localstorage after new per sheet versioning
        }
        getFromGoogleDrive(wearableSource, gearData);
        getFromGoogleDrive(weaponsDataSource, weaponsData);
        getFromGoogleDrive(specializationListSource, specializationList);

        Promise.all([
            ...Object.values(gearData),
            ...Object.values(weaponsData),
            ...Object.values(specializationList),
            VendorPromises
        ])
            .then(() => {
                localStorage.setItem('localDBversion', RemoteDBVersion);
                IsEverythingLoadedPromiseResolve();
            })
            .catch(() => {
                IsEverythingLoadedPromiseReject()
                window.localStorage.clear();
                // location.reload();
            })
    })

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

const specializationList = {
    Specialization: null
};

const specializationListSource = [{
    key: 'Specialization',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTHwYMNAuAnSwMdRZFQv5ULk8QOxQn94o3fCZxSUErUfmzoFQCrd41VoFR8IG1PEgnNgHV8WLysdepN/pub?output=csv'
}];


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
    StatsMapping: null,
    BrandsData: null
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
{
    key: 'StatsMapping',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0o0aUj35N-35i5zLcNey-bkAvB2xyqas8Qf6jaX0Flx-maPXM07R_-EGUZDghl6wcPOQnwba0Re9X/pub?gid=0&single=true&output=csv'
},
{
    key: 'BrandsData',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR2ScvK8DaAjgJ0WDuZmdFGACub4hiHM461kEj3XvhHR9WbZkKpLQFe1XmCklQu2g0NIN1EV5GFFDvv/pub?output=csv'
}
];

export {
    IsEverythingLoadedPromise,
    gearData,
    weaponsData,
    specializationList,
    VendorPromises as VendorData
};