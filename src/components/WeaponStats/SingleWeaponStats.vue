<template>
  <div class="weapon-stat">
    Get all general stats, add on top of them the specific weapon Buff
    <span>Weapon Damage</span>
    <span>Critical Hit Chance</span>
    <span>Critical Hit Damage</span>
    <span>Crit Hit Aggregate</span>
    <span>Headshot Damage</span>
    <span>Damage to Armor</span>
    <span>Damage to Health</span>
    <span>Damage to TOC</span>
    <span>Rate of Fire %</span>
    <span>Mag Size %</span>
    <span>Extra Rounds</span>
    <span>Reload Speed %</span>
    <span>Stability</span>
    <span>Accuracy</span>
    <span>Optimal Range</span>
    <span>Swap Speed</span>
  </div>
</template>

<script>
export default {
  name: "SingleWeaponStats"
};
</script>

<style lang="scss" scoped>
.weapon-stat {
  color: white;
  display: flex;
  flex-direction: column;
  span {
    border-bottom: 1px solid white;
    padding: 8px;
  }
}
</style>