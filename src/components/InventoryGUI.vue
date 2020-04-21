<template>
  <div class="main-area">
    <BasicTile class="primary"></BasicTile>
    <BasicTile class="secondary"></BasicTile>
    <BasicTile class="pistol"></BasicTile>
    <img class="img-mask mask" src="icons/mask.png" />
    <img class="img-backpack backpack" src="icons/backpack.png" />
    <img class="img-chest chest" src="icons/chest.png" />
    <img class="img-gloves gloves" src="icons/gloves.png" />
    <img class="img-holster holster" src="icons/holster.png" />
    <img class="img-kneepads kneepads" src="icons/kneepads.png" />
    <BasicTile class="mask" v-bind:name="'Mask'">
      <GearSlot v-bind:name="'Mask'" v-bind:init="initGearSlot[0]" v-bind:gearList="maskList"></GearSlot>
    </BasicTile>
    <BasicTile class="backpack" v-bind:name="'Backpack'">
      <GearSlot v-bind:name="'Backpack'" v-bind:init="initGearSlot[1]" v-bind:gearList="backpackList"></GearSlot>
    </BasicTile>
    <BasicTile class="chest" v-bind:name="'Chest'">
      <GearSlot v-bind:name="'Chest'" v-bind:init="initGearSlot[2]" v-bind:gearList="chestList"></GearSlot>
    </BasicTile>
    <BasicTile class="gloves" v-bind:name="'Gloves'">
      <GearSlot v-bind:name="'Gloves'" v-bind:init="initGearSlot[3]" v-bind:gearList="glovesList"></GearSlot>
    </BasicTile>
    <BasicTile class="holster" v-bind:name="'Holster'">
      <GearSlot v-bind:name="'Holster'" v-bind:init="initGearSlot[4]" v-bind:gearList="holsterList"></GearSlot>
    </BasicTile>
    <BasicTile class="kneepads" v-bind:name="'Kneepads'">
      <GearSlot v-bind:name="'Kneepads'" v-bind:init="initGearSlot[5]"  v-bind:gearList="kneepadsList"></GearSlot>
    </BasicTile>
    <BasicTile class="skill-one"></BasicTile>
    <BasicTile class="skill-two"></BasicTile>
    <BasicTile class="specialization"></BasicTile>
  </div>
</template>

<script>
import BasicTile from "./BasicTile";
import GearSlot from "./GearSlot";
import { GearBase } from "../utils/classes";
import { gearList } from "../utils/dataImporter";
import { gearEncoderMap, urlEncoder, urlDecoder } from "../utils/urlEncorder";

export default {
  name: "InventoryGUI",
  props: {
    encodedBuild: null
  },
  components: {
    BasicTile,
    GearSlot
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
      gear: [null, null, null, null, null, null],
      initGearSlot: [null, null, null, null, null, null]
    };
  },
  created() {
    this.initGearList();
    if (this.encodedBuild) {
      urlDecoder(this.encodedBuild).then(result => {
        // this.gear Do I really have to update it? TODO check next iteration
        this.initGearSlot = result;
      });
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
    gearChanged(slot, gear) {
      console.log("gearChanged", slot, gear);
      this.gear[gearEncoderMap[slot]] = gear;
      urlEncoder(this.gear);
    }
  }
};
</script>

<style scoped lang="scss">
.img-mask,
.img-backpack,
.img-chest,
.img-gloves,
.img-holster,
.img-kneepads {
  align-self: center;
  justify-self: center;
  opacity: 0.5;
}
</style>
