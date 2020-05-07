<template>
  <div class="weapon-stats-container">
    <BasicTile class="primary no-anim">
      <SingleWeaponStats v-bind:name="'Primary'"></SingleWeaponStats>
    </BasicTile>
    <BasicTile class="secondary no-anim">
      <SingleWeaponStats v-bind:name="'Secondary'"></SingleWeaponStats>
    </BasicTile>
    <BasicTile class="sidearm no-anim">
      <SingleWeaponStats v-bind:name="'SideArm'"></SingleWeaponStats>
    </BasicTile>
  </div>
</template>

<script>
import SingleWeaponStats from "./SingleWeaponStats";
import BasicTile from "../BasicTile";

export default {
  name: "WeaponStats",
  components: {
    SingleWeaponStats,
    BasicTile
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.weapon-stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-template-rows: repeat(1, [row] auto);
  gap: 8px;
}

.primary,
.secondary,
.sidearm {
  background: rgba(0, 0, 0, 0.25);
}
</style>