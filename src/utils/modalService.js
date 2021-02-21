import GearSelectionModal from "../components/Modals/GearSelectionModal";
import WeaponSelectionModal from "../components/Modals/WeaponSelectionModal";
import ScreenshotModal from "../components/Modals/ScreenshotModal";

import {
    gearHeaders,
    weaponsHeaders
} from "./agGridDefaults";

function noScroll(params) {
    document.body.classList.add('no-scroll');
}

function yesScroll(params) {
    document.body.classList.remove('no-scroll');
}

const defaultEvents = {
    'before-open': noScroll,
    'before-close': yesScroll
};

const openGearModal = function (gearList, onModalClose) {
    window.vueInstance.$modal.show(
        GearSelectionModal, {
        gearData: gearList,
        onModalClose: onModalClose,
        tableHeaders: gearHeaders
    }, {
        adaptive: true,
        width: "75%",
        height: "90%"
    },
        defaultEvents
    );
}

const openWeaponsModal = function (weaponLists, onModalClose) {
    window.vueInstance.$modal.show(
        WeaponSelectionModal, {
        gearData: weaponLists,
        onModalClose: onModalClose,
        tableHeaders: weaponsHeaders
    }, {
        adaptive: true,
        width: "75%",
        height: "90%"
    },
        defaultEvents
    );
}

const openSaveShareModal = function () {
    const bookmarkIt = 'You can add this build to your bookmarks by pressing ' + (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL') + ' + D on your keyboard.'
    window.vueInstance.$modal.show('dialog', {
        title: 'Save & share',
        text: `Hi, to save your build just bookmark it </br>
        ${bookmarkIt} </br>
        To share the build just send the URL of the page or click the copy button
        `,
        buttons: [{
            title: 'Copy',
            handler: () => {
                const el = document.createElement('textarea');
                el.value = document.location.href;
                el.setAttribute('readonly', '');
                el.style.position = 'absolute';
                el.style.left = '-9999px';
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
                document.getElementsByClassName('vue-dialog-button')[0].innerText = 'Copied!'
            }
        },
        {
            title: 'Close'
        }
        ]
    })
}

const openIssueModal = function () {
    window.vueInstance.$modal.show('dialog', {
        title: 'Have you tried turning it off and on again? - Most of IT guys',
        text: `Are you having issues on the site? </br>
            Press the clean button and wait for the refresh, if you still have problems please report this issue at 
            <a target="_blank" style="color:" href="http://discord.gg/ShYner2">my discord server</a> 
            or <a target="_blank" style="color:" href="https://github.com/mxswat/mx-division-builds/issues">GitHub</a>`,
        buttons: [{
            title: 'Clean local DB',
            handler: () => {
                window.localStorage.clear();
                location.reload();
            }
        },
        {
            title: 'Close'
        }
        ]
    })
}

const openScreenshotModal = function () {
    window.vueInstance.$modal.show(
        ScreenshotModal, {
    }, {
        adaptive: true,
        width: "75%",
        height: "90%"
    }
    );
}

const openSafariIOSModal = function () {
    window.vueInstance.$modal.show('dialog', {
        title: 'iOS and Safari',
        text: `Hi, I see you are using iOS and Safari, if you have issues with the tool please use Chrome. </br>
            I don't have an iPhone so I can't debug and solve Safari related issuses.
            I hope you understand <br> 
            If you still have problems there might be some problem related to you OS version please report this issue at 
            <a target="_blank" style="color:" href="http://discord.gg/ShYner2">my discord server</a> `,
        buttons: [
            {
                title: "I don't have issues",
                handler: () => {
                    localStorage.setItem('iOS-Safari-OK', 'ok');
                    location.reload();
                }
            },
            {
                title: 'I understand and I will use chrome',
            }
        ],
        defaultEvents
    })
}

export {
    openGearModal,
    openWeaponsModal,
    openSaveShareModal,
    openIssueModal,
    openScreenshotModal,
    openSafariIOSModal
}