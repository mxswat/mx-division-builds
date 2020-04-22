<template>
  <div @click="onClick()" class="weapon-container">
    <span class="no-element-selected" v-if="!isWeaponSelected()">
      <p>CHOSE YOUR WEAPON</p>
    </span>
  </div>
</template>

<script>
import { openWeaponsModal } from "../utils/modalService";
import { weaponsList } from "../utils/dataImporter";

export default {
  name: "WeaponSlot",
  data() {
    return {
      weaponsList: null,
      currentWeapon: null
    };
  },
  created() {
    weaponsList.Weapons.then(weapons => {
      this.weaponsList = weapons;
    });
  },
  methods: {
    isWeaponSelected() {
      return this.currentWeapon && this.currentWeapon.itemName;
    },
    onClick() {
      if (!this.isWeaponSelected()) {
        this.openWeaponsModal();
      }
    },
    openWeaponsModal() {
      openWeaponsModal(this.weaponsList, this.onModalClose);
    }
  }
};
</script>

<style lang="scss">
.weapon-container {
  height: 100%;
  color: white;
}
</style>