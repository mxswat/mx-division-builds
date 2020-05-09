<template>
  <div class="inventory-gui">
    <BasicTile classes="specialization">
      <SpecializationSlot></SpecializationSlot>
    </BasicTile>
    <BasicTile classes="primary">
      <img class="img-slot-bg primary" src="icons/main-weapon.png" />
      <WeaponSlot name="Primary"></WeaponSlot>
    </BasicTile>
    <BasicTile classes="secondary">
      <img class="img-slot-bg secondary" src="icons/main-weapon.png" />
      <WeaponSlot name="Secondary"></WeaponSlot>
    </BasicTile>
    <BasicTile classes="pistol">
      <img class="img-slot-bg pistol" src="icons/sidearm.png" />
      <WeaponSlot name="SideArm" slotFilter="S"></WeaponSlot>
    </BasicTile>
    <BasicTile classes="mask">
      <img class="img-slot-bg mask" src="icons/mask.png" />
      <GearSlot name="Mask"></GearSlot>
    </BasicTile>
    <BasicTile classes="backpack">
      <img class="img-slot-bg backpack" src="icons/backpack.png" />
      <GearSlot name="Backpack"></GearSlot>
    </BasicTile>
    <BasicTile classes="chest">
      <img class="img-slot-bg chest" src="icons/chest.png" />
      <GearSlot name="Chest"></GearSlot>
    </BasicTile>
    <BasicTile classes="gloves">
      <img class="img-slot-bg gloves" src="icons/gloves.png" />
      <GearSlot name="Gloves"></GearSlot>
    </BasicTile>
    <BasicTile classes="holster">
      <img class="img-slot-bg holster" src="icons/holster.png" />
      <GearSlot name="Holster"></GearSlot>
    </BasicTile>
    <BasicTile classes="kneepads">
      <img class="img-slot-bg kneepads" src="icons/kneepads.png" />
      <GearSlot name="Kneepads"></GearSlot>
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
  urlDecoder,
  updatedInput$
} from "../utils/urlEncorder";

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
