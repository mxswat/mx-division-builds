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

// https://stackoverflow.com/a/27696695/10300983
/*eslint-disable */
const Base64 = (function () {
    var digitsStr =
        //   0       8       16      24      32      40      48      56     63
        //   v       v       v       v       v       v       v       v      v
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-";
    var digits = digitsStr.split('');
    var digitsMap = {};
    for (var i = 0; i < digits.length; i++) {
        digitsMap[digits[i]] = i;
    }
    return {
        fromInt: function (int32) {
            var result = '';
            while (true) {
                result = digits[int32 & 0x3f] + result;
                int32 >>>= 6;
                if (int32 === 0)
                    break;
            }
            return result;
        },
        toInt: function (digitsStr) {
            var result = 0;
            var digits = digitsStr.split('');
            for (var i = 0; i < digits.length; i++) {
                result = (result << 6) + digitsMap[digits[i]];
            }
            return result;
        }
    };
})();
window.Base64 = Base64 // For debug purpose only TODO: Delete me
/*eslint-enable */

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
        urlChunks[i] += getByString(gear, 'id');
        urlChunks[i] += getByString(gear, 'attributeOne.index');
        urlChunks[i] += getByString(gear, 'attributeTwo.index');
        urlChunks[i] += getByString(gear, 'core.index');
        urlChunks[i] += getByString(gear, 'mod.index');
        urlChunks[i] += getByString(gear, 'talent.index');
        urlChunks[i] = Base64.fromInt(urlChunks[i]);
    }
    const url = urlChunks.join(':');
    window.history.pushState("", "", badUrl + url)
}

const urlDecoder = function (encodedBuild) {
    return new Promise((resolve, reject) => {
        Promise.all(allDataPromies).then(() => {
            console.log('Everything loaded and ready for decode');
            const splitted = encodedBuild.split(':');
            const result = [];
            for (let i = 0; i < splitted.length; i++) {
                const gear = splitted[i];
                // https://stackoverflow.com/questions/8513032/less-than-10-add-0-to-number/8513046
                result.push(('000000' + Base64.toInt(gear)).slice(-7));
            }
            resolve(result);
        })
    });

}

export {
    gearEncoderMap,
    urlEncoder,
    urlDecoder
}