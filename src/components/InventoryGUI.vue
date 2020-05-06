<template>
  <div class="inventory-gui">
    <BasicTile class="specialization" v-bind:name="'Specialization'">
      <SpecializationSlot v-bind:init="initGearSlot[9]"></SpecializationSlot>
    </BasicTile>
    <img class="img-slot-bg primary" src="icons/main-weapon.png" />
    <img class="img-slot-bg secondary" src="icons/main-weapon.png" />
    <img class="img-slot-bg pistol" src="icons/sidearm.png" />
    <img class="img-slot-bg mask" src="icons/mask.png" />
    <img class="img-slot-bg backpack" src="icons/backpack.png" />
    <img class="img-slot-bg chest" src="icons/chest.png" />
    <img class="img-slot-bg gloves" src="icons/gloves.png" />
    <img class="img-slot-bg holster" src="icons/holster.png" />
    <img class="img-slot-bg kneepads" src="icons/kneepads.png" />
    <BasicTile class="primary" v-bind:name="'Primary'">
      <WeaponSlot v-bind:init="initGearSlot[6]" v-bind:name="'Primary'"></WeaponSlot>
    </BasicTile>
    <BasicTile class="secondary" v-bind:name="'Secondary'">
      <WeaponSlot v-bind:init="initGearSlot[7]" v-bind:name="'Secondary'"></WeaponSlot>
    </BasicTile>
    <BasicTile class="pistol" v-bind:name="'SideArm'">
      <WeaponSlot v-bind:init="initGearSlot[8]" v-bind:slotFilter="'S'" v-bind:name="'SideArm'"></WeaponSlot>
    </BasicTile>
    <BasicTile class="mask" v-bind:name="'Mask'">
      <GearSlot v-bind:name="'Mask'" v-bind:init="initGearSlot[0]" v-bind:gearList="maskList"></GearSlot>
    </BasicTile>
    <BasicTile class="backpack" v-bind:name="'Backpack'">
      <GearSlot
        v-bind:name="'Backpack'"
        v-bind:init="initGearSlot[1]"
        v-bind:gearList="backpackList"
      ></GearSlot>
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
      <GearSlot
        v-bind:name="'Kneepads'"
        v-bind:init="initGearSlot[5]"
        v-bind:gearList="kneepadsList"
      ></GearSlot>
    </BasicTile>
    <!-- <BasicTile class="skill-one"></BasicTile>
    <BasicTile class="skill-two"></BasicTile>
    <BasicTile class="skill-two"></BasicTile>-->
  </div>
</template>

<script>
import BasicTile from "./BasicTile";
import GearSlot from "./GearSlot";
import WeaponSlot from "./WeaponSlot";
import SpecializationSlot from "./SpecializationSlot";
import { GearBase } from "../utils/classes";
import { gearList } from "../utils/dataImporter";
import { gearEncoderMap, urlEncoder, urlDecoder } from "../utils/urlEncorder";
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
@import "../style/_include-media.scss";

.img-slot-bg {
  align-self: center;
  justify-self: center;
  opacity: 0.2;
}

.inventory-gui {
  display: grid;
  grid-template-columns: repeat(3, [col] minmax(0px, 1fr));
  grid-template-rows: repeat(4, [row] auto);
  gap: 8px 8px;

  @include media(">=tablet", "<=laptop") {
    grid-template-columns: repeat(2, [col] minmax(0px, 1fr));
  }
}

.specialization {
  grid-column: col 1 / span 3;
  grid-row: row 1;
}

.primary {
  grid-column: col 1 / span 1;
  grid-row: row 2;
}

.secondary {
  grid-column: col 2 / span 1;
  grid-row: row 2;
}

.pistol {
  grid-column: col 3 / span 1;
  grid-row: row 2;
}

.mask {
  grid-column: col 1 / span 1;
  grid-row: row 3;
}

.backpack {
  grid-column: col 2 / span 1;
  grid-row: row 3;
}

.chest {
  grid-column: col 3 / span 1;
  grid-row: row 3;
}

.gloves {
  grid-column: col 1 / span 1;
  grid-row: row 4;
}

.holster {
  grid-column: col 2 / span 1;
  grid-row: row 4;
}

.kneepads {
  grid-column: col 3 / span 1;
  grid-row: row 4;
}

$slots: (
  // specialization ((1, 1, 2), (1, 2, 1)),
  primary ((1, 2), (1, 2)),
  secondary ((2, 2), (2, 2)),
  pistol ((3, 2), (1, 3))
);

$increment: 0;
@for $idx from 1 through length($slots) {
  $slot: nth($slots, $idx);
  $slotClass: nth($slot, 1);
  $values: nth($slot, 2);
  .#{$slotClass} {
    @for $i from 1 through length($values) {
      $x: nth($values, $i);
      $col: nth($x, 1);
      $row: nth($x, 2);
      @if ($i == 3) {
        .#{$i} {
          color: red;
        }
      }
      @include media(">=tablet", "<=laptop") {
        grid-column: col #{$col} / span 1;
        grid-row: row #{$row};
      }
    }
  }
}
</style>
