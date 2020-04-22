import TableModal from "../components/TableModal";
import { gearHeaders, weaponsHeaders } from "./agGridDefaults";

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


export {
    openGearModal,
    openWeaponsModal
}