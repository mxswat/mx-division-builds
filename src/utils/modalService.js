import TableModal from "../components/TableModal";
import {
    gearHeaders,
    weaponsHeaders
} from "./agGridDefaults";

const openGearModal = function (gearList, onModalClose) {
    window.vueInstance.$modal.show(
        TableModal, {
            gearData: gearList,
            onModalClose: onModalClose,
            tableHeaders: gearHeaders
        }, {
            adaptive: true,
            width: "75%",
            height: "90%"
        }
    );
}

const openWeaponsModal = function (weaponLists, onModalClose) {
    window.vueInstance.$modal.show(
        TableModal, {
            gearData: weaponLists,
            onModalClose: onModalClose,
            tableHeaders: weaponsHeaders
        }, {
            adaptive: true,
            width: "75%",
            height: "90%"
        }
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
        Press the clean button and wait for the refresh, if you still have problems please report this issue at <a  style="color:" href="http://discord.gg/ShYner2">my discord server!</a>
        `,
        buttons: [{
                title: 'Clean',
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

export {
    openGearModal,
    openWeaponsModal,
    openSaveShareModal,
    openIssueModal
}