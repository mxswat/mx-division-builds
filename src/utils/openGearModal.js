import GearModal from "../components/GearModal";

const openGearModal = function (gearList, onModalClose) {
    window.vueInstance.$modal.show(
        GearModal, {
            gearData: gearList,
            onModalClose: onModalClose
        }, {
            adaptive: true,
            width: "75%",
            height: "90%"
        }
    );
}


export {
    openGearModal
}