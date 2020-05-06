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
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 8px 8px;
  grid-template-areas: "primary secondary sidearm";
}

.primary,
.secondary,
.sidearm {
  background: rgba(0, 0, 0, 0.25);
}
</style>