import {
    Subject,
    BehaviorSubject
} from 'rxjs';

import coreService from "./coreService";
import statsService from "./statsService";
import router from "../router";

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
    statsService.resetStats();
    const wearablesIds =
        wearableToIds([
            Mask,
            Backpack,
            Chest,
            Gloves,
            Holster,
            Kneepads,
        ]);
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
    const buildData = [wearablesIds.join(':'), weapondsIds.join(':'), specializationIds.join(':')].join(':');
    statsService.afterEncoding();
    const encodedBuild = compressToEncodedURIComponent(buildData);
    const _router = router;
    if (_router.history.current.params.encodedBuild !== encodedBuild) {
        router.push({
            name: 'homeId',
            params: {
                encodedBuild: '' + encodedBuild
            }
        })
    }
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
        ids[i] += objectPropToNumber(wearable, 'core.StatValue', '-');
        ids[i] += objectPropToNumber(wearable, 'attributeOne.StatValue', '-');
        ids[i] += objectPropToNumber(wearable, 'attributeTwo.StatValue', '-');
        ids[i] += objectPropToNumber(wearable, 'mod.StatValue', '');
        statsService.addStatsFromwWearable(wearable);
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
        statsService.addStatsFromWeapon(weapon);
    }
    return ids;
}

function specializationToIds(specialization) {
    const ids = [];
    ids[0] = '';
    ids[0] += objectPropToNumber(specialization, 'id', '');
    statsService.addStatsFromSpecialization(specialization);
    return ids;
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
    urlDecoder,
    updatedInput$,
}