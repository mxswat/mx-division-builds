<template>
  <div class="inventory-gui">
    <BasicTile class="specialization" v-bind:name="'Specialization'">
      <SpecializationSlot v-bind:init="initGearSlot[9]"></SpecializationSlot>
    </BasicTile>
    <BasicTile class="primary" v-bind:name="'Primary'">
      <img class="img-slot-bg primary" src="icons/main-weapon.png" />
      <WeaponSlot v-bind:init="initGearSlot[6]" v-bind:name="'Primary'"></WeaponSlot>
    </BasicTile>
    <BasicTile class="secondary" v-bind:name="'Secondary'">
      <img class="img-slot-bg secondary" src="icons/main-weapon.png" />
      <WeaponSlot v-bind:init="initGearSlot[7]" v-bind:name="'Secondary'"></WeaponSlot>
    </BasicTile>
    <BasicTile class="pistol" v-bind:name="'SideArm'">
      <img class="img-slot-bg pistol" src="icons/sidearm.png" />
      <WeaponSlot v-bind:init="initGearSlot[8]" v-bind:slotFilter="'S'" v-bind:name="'SideArm'"></WeaponSlot>
    </BasicTile>
    <BasicTile class="mask" v-bind:name="'Mask'">
      <img class="img-slot-bg mask" src="icons/mask.png" />
      <GearSlot v-bind:name="'Mask'" v-bind:init="initGearSlot[0]" v-bind:gearList="maskList"></GearSlot>
    </BasicTile>
    <BasicTile class="backpack" v-bind:name="'Backpack'">
      <img class="img-slot-bg backpack" src="icons/backpack.png" />
      <GearSlot
        v-bind:name="'Backpack'"
        v-bind:init="initGearSlot[1]"
        v-bind:gearList="backpackList"
      ></GearSlot>
    </BasicTile>
    <BasicTile class="chest" v-bind:name="'Chest'">
      <img class="img-slot-bg chest" src="icons/chest.png" />
      <GearSlot v-bind:name="'Chest'" v-bind:init="initGearSlot[2]" v-bind:gearList="chestList"></GearSlot>
    </BasicTile>
    <BasicTile class="gloves" v-bind:name="'Gloves'">
      <img class="img-slot-bg gloves" src="icons/gloves.png" />
      <GearSlot v-bind:name="'Gloves'" v-bind:init="initGearSlot[3]" v-bind:gearList="glovesList"></GearSlot>
    </BasicTile>
    <BasicTile class="holster" v-bind:name="'Holster'">
      <img class="img-slot-bg holster" src="icons/holster.png" />
      <GearSlot v-bind:name="'Holster'" v-bind:init="initGearSlot[4]" v-bind:gearList="holsterList"></GearSlot>
    </BasicTile>
    <BasicTile class="kneepads" v-bind:name="'Kneepads'">
      <img class="img-slot-bg kneepads" src="icons/kneepads.png" />
      <GearSlot
        v-bind:name="'Kneepads'"
        v-bind:init="initGearSlot[5]"
        v-bind:gearList="kneepadsList"
      ></GearSlot>
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
    return {
      maskList: Array,
      backpackList: Array,
      chestList: Array,
      glovesList: Array,
      holsterList: Array,
      kneepadsList: Array,
      weaponsList: Array,
      // Only for debug purpose
      gear: [null, null, null, null, null, null, null, null, null, null],
      // TODO this system must be changed, too ugly
      initGearSlot: [null, null, null, null, null, null, null, null, null, null]
    };
  },
  created() {
    this.initGearList();
    if (this.encodedBuild) {
      updatedInput$.next(this.encodedBuild);
      // urlDecoder(this.encodedBuild).then(result => {
      //   // this.gear Do I really have to update it? TODO check next iteration
      //   this.initGearSlot = result;
      // });
    }
  },
  methods: {
    initGearList() {
      Promise.all([
        gearList.Chest,
        gearList.Gloves,
        gearList.Holster,
        gearList.Kneepads,
        gearList.Backpack,
        gearList.Mask
      ]).then(values => {
        this.chestList = values[0];
        this.glovesList = values[1];
        this.holsterList = values[2];
        this.kneepadsList = values[3];
        this.backpackList = values[4];
        this.maskList = values[5];
      });
    },
    slotChanged(slot, gear) {
      // console.log("slotChanged", slot, gear);
      this.gear[gearEncoderMap[slot]] = gear;
      updateStats(this.gear);
      urlEncoder(this.gear);
    }
  }
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
