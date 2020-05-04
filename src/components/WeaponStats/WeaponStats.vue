<template>
  <div class="weapon-stats-container">
    <BasicTile class="primary no-anim">
      <SingleWeaponStats></SingleWeaponStats>
    </BasicTile>
    <BasicTile class="secondary no-anim">
      <SingleWeaponStats></SingleWeaponStats>
    </BasicTile>
    <BasicTile class="sidearm no-anim">
      <SingleWeaponStats></SingleWeaponStats>
    </BasicTile>
  </div>
</template>

<script>
import SingleWeaponStats from "./SingleWeaponStats";
import BasicTile from "../BasicTile";
import { statsProvider } from "../../utils/statsCalculator";
import { GearProvider } from "../../utils/gearService";

export default {
  name: "WeaponStats",
  components: {
    SingleWeaponStats,
    BasicTile
  },
  created() {
    statsProvider.getStats().subscribe(stats => {
      console.log('stats', stats);
    });
    GearProvider.subscribeGear("Primary").subscribe(Primary => {
      console.log("Primary", Primary);
    });
    GearProvider.subscribeGear("Secondary").subscribe(Secondary => {
      console.log("Secondary", Secondary);
    });
    GearProvider.subscribeGear("SideArm").subscribe(SideArm => {
      console.log("SideArm", SideArm);
    });
  }
};
</script>

<style lang="scss" scoped>
.weapon-stats-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 8px 8px;
  grid-template-areas: "primary secondary sidearm";
}

.primary,
.secondary,
.sidearm {
  background: #151515;
}
</style>