<template>
  <div @click="onClick()" class="weapon-container">
    <template v-if="isWeaponSelected()">
      <div class="slot-element gear-name" v-on:click="openGearModal()">{{ currentWeapon.itemName}}</div>
    </template>
    <span class="no-element-selected" v-if="!isWeaponSelected()">
      <p>CHOSE YOUR WEAPON</p>
    </span>
  </div>
</template>

<script>
import { openWeaponsModal } from "../utils/modalService";
import { weaponsList } from "../utils/dataImporter";
import { WeaponBase } from "../utils/classes";

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
    },
    onModalClose(data) {
      this.currentWeapon = new WeaponBase(data);
    }
  },
  watch: {
    currentWeapon: {
      handler: function(val, oldVal) {
        this.$parent.gearChanged(val);
      },
      deep: true
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