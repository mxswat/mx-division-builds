const gearEncoderMap = {
    Mask: 0,
    Backpack: 1,
    Chest: 2,
    Gloves: 3,
    Holster: 4,
    Kneepads: 5
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

// I should use the vue router
const badUrl = location.origin.indexOf('github') > 0 ? '/mx-division-builds/#/' : '/#/';

const urlEncoder = function (gearArray) {
    let urlChunks = [];
    for (let i = 0; i < gearArray.length; i++) {
        const gear = gearArray[i];
        urlChunks[i] = '';
        urlChunks[i] += ('00' + getByString(gear, 'id')).slice(-3) + '-';
        urlChunks[i] += ('00' + getByString(gear, 'attributeOne.index')).slice(-3) + '-';
        urlChunks[i] += ('00' + getByString(gear, 'attributeTwo.index')).slice(-3) + '-';
        urlChunks[i] += ('00' + getByString(gear, 'core.index')).slice(-3) + '-';
        urlChunks[i] += ('00' + getByString(gear, 'mod.index')).slice(-3) + '-';
        urlChunks[i] += ('00' + getByString(gear, 'talent.index')).slice(-3);
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