<template>
  <div class="inventory-gui">
    <BasicTile class="specialization" v-bind:name="'Specialization'">
      <SpecializationSlot></SpecializationSlot>
    </BasicTile>
    <BasicTile class="primary" v-bind:name="'Primary'">
      <img class="img-slot-bg primary" src="icons/main-weapon.png" />
      <WeaponSlot v-bind:name="'Primary'"></WeaponSlot>
    </BasicTile>
    <BasicTile class="secondary" v-bind:name="'Secondary'">
      <img class="img-slot-bg secondary" src="icons/main-weapon.png" />
      <WeaponSlot v-bind:name="'Secondary'"></WeaponSlot>
    </BasicTile>
    <BasicTile class="pistol" v-bind:name="'SideArm'">
      <img class="img-slot-bg pistol" src="icons/sidearm.png" />
      <WeaponSlot v-bind:name="'SideArm'"></WeaponSlot>
    </BasicTile>
    <BasicTile class="mask" v-bind:name="'Mask'">
      <img class="img-slot-bg mask" src="icons/mask.png" />
      <GearSlot v-bind:name="'Mask'"></GearSlot>
    </BasicTile>
    <BasicTile class="backpack" v-bind:name="'Backpack'">
      <img class="img-slot-bg backpack" src="icons/backpack.png" />
      <GearSlot v-bind:name="'Backpack'"></GearSlot>
    </BasicTile>
    <BasicTile class="chest" v-bind:name="'Chest'">
      <img class="img-slot-bg chest" src="icons/chest.png" />
      <GearSlot v-bind:name="'Chest'"></GearSlot>
    </BasicTile>
    <BasicTile class="gloves" v-bind:name="'Gloves'">
      <img class="img-slot-bg gloves" src="icons/gloves.png" />
      <GearSlot v-bind:name="'Gloves'"></GearSlot>
    </BasicTile>
    <BasicTile class="holster" v-bind:name="'Holster'">
      <img class="img-slot-bg holster" src="icons/holster.png" />
      <GearSlot v-bind:name="'Holster'"></GearSlot>
    </BasicTile>
    <BasicTile class="kneepads" v-bind:name="'Kneepads'">
      <img class="img-slot-bg kneepads" src="icons/kneepads.png" />
      <GearSlot v-bind:name="'Kneepads'"></GearSlot>
    </BasicTile>
  </div>
</template>

<script>
import BasicTile from "./BasicTile";
import GearSlot from "./GearSlot";
import WeaponSlot from "./WeaponSlot";
import SpecializationSlot from "./SpecializationSlot";
import { GearBase } from "../utils/classes";
import { gearList } from "../utils/dataImporter";
import {
  gearEncoderMap,
  urlEncoder,
  urlDecoder,
  updatedInput$
} from "../utils/urlEncorder";
import { updateStats } from "../utils/statsCalculator";

export default {
  name: "InventoryGUI",
  props: {
    encodedBuild: null
  },
  components: {
    BasicTile,
    GearSlot,
    WeaponSlot,
    SpecializationSlot
  },
  data() {
    return {};
  },
  created() {
    if (this.encodedBuild) {
      updatedInput$.next(this.encodedBuild);
    }
  },
  methods: {}
};
</script>

<style scoped lang="scss">
// https://carterbancroft.com/sass-and-webpack/ thanks <3
@use "sass:math";
@import "../style/_include-media.scss";

.inventory-gui {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 8px 8px;
}

.specialization {
  grid-column: 1 / -1;
}
</style>
