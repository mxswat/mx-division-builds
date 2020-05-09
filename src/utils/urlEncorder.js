import {
    Subject,
    BehaviorSubject
} from 'rxjs';

import coreService from "./coreService";

const gearEncoderMap = {
    Mask: 0,
    Backpack: 1,
    Chest: 2,
    Gloves: 3,
    Holster: 4,
    Kneepads: 5,
    Primary: 6,
    Secondary: 7,
    SideArm: 8,
    Specialization: 9,
    0: 'Mask',
    1: 'Backpack',
    2: 'Chest',
    3: 'Gloves',
    4: 'Holster',
    5: 'Kneepads',
    6: 'Primary',
    7: 'Secondary',
    8: 'SideArm',
    9: 'Specialization',
};

import {
    allDataPromies
} from "./dataImporter";
import {
    compressToEncodedURIComponent,
    decompressFromEncodedURIComponent
} from "lz-string";

import {
    getByString
} from "./utils";

const objectPropToNumber = function (object, path, separator) {
    return ('' + getByString(object, path)) + separator;
}

// I should use the vue router
const badUrl = location.origin.indexOf('github') > 0 ? '/mx-division-builds/#/' : '/#/';

coreService.subscribeAllSlotsData$().subscribe(([
    Mask,
    Backpack,
    Chest,
    Gloves,
    Holster,
    Kneepads,
    Primary,
    Secondary,
    SideArm,
    Specialization,
]) => {
    const wearablesIds =
        wearableToIds([
            Mask,
            Backpack,
            Chest,
            Gloves,
            Holster,
            Kneepads,
        ])
    const weapondsIds = weaponsToIds([Primary,
        Secondary,
        SideArm,
    ]);
    const specializationIds = specializationToIds(Specialization);
    console.log('newEncoder', {
        wearablesIds: wearablesIds,
        weapondsIds: weapondsIds,
        specializationIds: specializationIds,
    });
})

function wearableToIds(wearables) {
    let ids = []
    for (let i = 0; i < wearables.length; i++) {
        const wearable = wearables[i];
        ids[i] = '';
        ids[i] += objectPropToNumber(wearable, 'id', '-');
        ids[i] += objectPropToNumber(wearable, 'attributeOne.index', '-');
        ids[i] += objectPropToNumber(wearable, 'attributeTwo.index', '-');
        ids[i] += objectPropToNumber(wearable, 'core.index', '-');
        ids[i] += objectPropToNumber(wearable, 'mod.index', '-');
        ids[i] += objectPropToNumber(wearable, 'talent.index', '-');
        ids[i] += objectPropToNumber(wearable, 'core.StatValue', '-')
        ids[i] += objectPropToNumber(wearable, 'attributeOne.StatValue', '-')
        ids[i] += objectPropToNumber(wearable, 'attributeTwo.StatValue', '-')
        ids[i] += objectPropToNumber(wearable, 'mod.StatValue', '')
        console.log('wearable', ids[i])
    }
    return ids;
}

function weaponsToIds(weapons) {
    let ids = []
    for (let i = 0; i < weapons.length; i++) {
        const weapon = weapons[i];
        ids[i] = '';
        ids[i] += objectPropToNumber(weapon, 'id', '-');
        ids[i] += objectPropToNumber(weapon, "attribute 1.index", '-');
        ids[i] += objectPropToNumber(weapon, 'talent.index', '-');
        ids[i] += objectPropToNumber(weapon, 'optic.index', '-');
        ids[i] += objectPropToNumber(weapon, "under barrel.index", '-');
        ids[i] += objectPropToNumber(weapon, 'magazine.index', '-');
        ids[i] += objectPropToNumber(weapon, 'muzzle.index', '-');
        ids[i] += objectPropToNumber(weapon, "attribute 1.StatValue", '-')
        ids[i] += objectPropToNumber(weapon, "core 1.StatValue", '-')
        ids[i] += objectPropToNumber(weapon, "core 2.StatValue", '')
        console.log('weapon', ids[i]);
    }
    return ids;
}

function specializationToIds(specialization) {
    const ids = [];
    ids[0] = '';
    ids[0] += objectPropToNumber(specialization, 'id', '');
    return ids;
}

const urlEncoder = function (idArray) {
    let urlChunks = [];
    let statsChunks = [];
    for (let i = 0; i < idArray.length; i++) {
        urlChunks[i] = '';
        statsChunks[i] = '';
        if (i < 6) {
            const gear = idArray[i];
            urlChunks[i] += objectPropToNumber(gear, 'id', '-');
            urlChunks[i] += objectPropToNumber(gear, 'attributeOne.index', '-');
            urlChunks[i] += objectPropToNumber(gear, 'attributeTwo.index', '-');
            urlChunks[i] += objectPropToNumber(gear, 'core.index', '-');
            urlChunks[i] += objectPropToNumber(gear, 'mod.index', '-');
            urlChunks[i] += objectPropToNumber(gear, 'talent.index', '-');
            urlChunks[i] += objectPropToNumber(gear, 'core.StatValue', '-')
            urlChunks[i] += objectPropToNumber(gear, 'attributeOne.StatValue', '-')
            urlChunks[i] += objectPropToNumber(gear, 'attributeTwo.StatValue', '-')
            urlChunks[i] += objectPropToNumber(gear, 'mod.StatValue', '')
            console.log('gear', urlChunks[i])
        } else if (i < 9) {
            const weapon = idArray[i];
            urlChunks[i] += objectPropToNumber(weapon, 'id', '-');
            urlChunks[i] += objectPropToNumber(weapon, "attribute 1.index", '-');
            urlChunks[i] += objectPropToNumber(weapon, 'talent.index', '-');
            urlChunks[i] += objectPropToNumber(weapon, 'optic.index', '-');
            urlChunks[i] += objectPropToNumber(weapon, "under barrel.index", '-');
            urlChunks[i] += objectPropToNumber(weapon, 'magazine.index', '-');
            urlChunks[i] += objectPropToNumber(weapon, 'muzzle.index', '-');
            urlChunks[i] += objectPropToNumber(weapon, "attribute 1.StatValue", '-')
            urlChunks[i] += objectPropToNumber(weapon, "core 1.StatValue", '-')
            urlChunks[i] += objectPropToNumber(weapon, "core 2.StatValue", '')
            console.log('weapon', urlChunks[i])
        } else if (i < 10) {
            const specialization = idArray[i];
            urlChunks[i] += objectPropToNumber(specialization, 'id', '');
            console.log('specialization', urlChunks[i])
        }
    }
    const url = compressToEncodedURIComponent(urlChunks.join(':'));
    window.history.pushState("", "", badUrl + url)
}

const urlDecoder = function (encodedBuild) {
    Promise.all(allDataPromies).then(() => {
        console.log('Everything loaded and ready for decode');
        const splitted = decompressFromEncodedURIComponent(encodedBuild).split(':');
        for (let i = 0; i < splitted.length; i++) {
            const slotEncoded = splitted[i];
            coreService.sendSlotInit(gearEncoderMap[i], slotEncoded);
        }
    });
}

const decodedSlots = {
    Mask: new Subject(),
    Backpack: new Subject(),
    Chest: new Subject(),
    Gloves: new Subject(),
    Holster: new Subject(),
    Kneepads: new Subject(),
    Primary: new Subject(),
    Secondary: new Subject(),
    SideArm: new Subject(),
    Specialization: new Subject(),
}

const updatedInput$ = new Subject();
updatedInput$.subscribe((encodedBuild) => {
    urlDecoder(encodedBuild);
})

export {
    gearEncoderMap,
    urlEncoder,
    urlDecoder,
    updatedInput$,
}