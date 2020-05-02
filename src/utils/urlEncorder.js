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
    Specialization: 9
};

import {
    allDataPromies
} from "./dataImporter";
import {
    compressToEncodedURIComponent,
    decompressFromEncodedURIComponent
} from "lz-string";

// https://stackoverflow.com/a/6491621/10300983 modified to work with my code
const getByString = function (o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, ''); // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        // if (o && (k in o)) {
        if (o === Object(o) && k in o) {
            o = o[k];
        } else {
            return 0;
            // return; This was the original return
        }
    }
    return o;
}

const gearToId = function(object, path, separator) {
    return ('00' + getByString(object, path)).slice(-3) + separator;
}

// I should use the vue router
const badUrl = location.origin.indexOf('github') > 0 ? '/mx-division-builds/#/' : '/#/';

const urlEncoder = function (idArray) {
    let urlChunks = [];
    for (let i = 0; i < idArray.length; i++) {
        urlChunks[i] = '';
        if (i < 6) {
            
            /**
             * Encode value of stats edit into a new var like 'data-chunk'
             * Also I guess that having extra 0s is not necessary anymore
             * And use Hex decimals instead of integers
             */

            const gear = idArray[i];
            urlChunks[i] += gearToId(gear, 'id', '-');
            urlChunks[i] += gearToId(gear, 'attributeOne.index', '-');
            urlChunks[i] += gearToId(gear, 'attributeTwo.index', '-');
            urlChunks[i] += gearToId(gear, 'core.index', '-');
            urlChunks[i] += gearToId(gear, 'mod.index', '-');
            urlChunks[i] += gearToId(gear, 'talent.index', '');
        } else if (i < 9) {
            const weapon = idArray[i];
            urlChunks[i] += gearToId(weapon, 'id', '-');
            urlChunks[i] += gearToId(weapon, "attribute 1.index", '-');
            urlChunks[i] += gearToId(weapon, 'talent.index', '-');
            urlChunks[i] += gearToId(weapon, 'optic.index', '-');
            urlChunks[i] += gearToId(weapon, "under barrel.index", '-');
            urlChunks[i] += gearToId(weapon, 'magazine.index', '-');
            urlChunks[i] += gearToId(weapon, 'muzzle.index', '');
        } else if (i < 10) {
            const specialization = idArray[i];
            urlChunks[i] += gearToId(specialization, 'id', '');
        }

    }
    const url = compressToEncodedURIComponent(urlChunks.join(':'));
    window.history.pushState("", "", badUrl + url)
}

const urlDecoder = function (encodedBuild) {
    return new Promise((resolve, reject) => {
        Promise.all(allDataPromies).then(() => {
            console.log('Everything loaded and ready for decode');
            const splitted = decompressFromEncodedURIComponent(encodedBuild).split(':');
            resolve(splitted);
        })
    });

}

export {
    gearEncoderMap,
    urlEncoder,
    urlDecoder
}