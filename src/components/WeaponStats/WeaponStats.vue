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
export default {
  name: "WeaponStats",
  components: {
    SingleWeaponStats,
    BasicTile
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