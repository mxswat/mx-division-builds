<template>
  <div class="SHD-levels-inner">
    <span class="section-title">
      <img src="icons/shd_big.png" class="image" />
      SHD Levels
    </span>
    <div class="levels">
      <div class="item" v-for="(level, idx) in levels" v-bind:key="idx">
        <span class="level-name">{{ level.name }}</span>
        <StatInput v-model="level.value" v-bind:max="level.max"></StatInput>
      </div>
    </div>
  </div>
</template>

<script>
// https://thedivision.fandom.com/wiki/SHD_Level
import StatInput from "./StatInput";
import coreService from "../utils/coreService";
import { getSHDLevels } from "../utils/SHDutils";
export default {
  name: "SHDLevels",
  components: { StatInput },
  data() {
    return {
      levels: [],
    };
  },
  created() {
    this.levels = getSHDLevels();
    coreService.updateSHDLevels(this.levels);
  },
  updated() {
    coreService.updateSHDLevels(this.levels);
  },
};
</script>

<style lang="scss">
.SHD-levels-inner {
  display: flex;
  flex-direction: column;
  .levels {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 8px 8px;
  }
  .level-name {
    flex: 3;
  }
  .item {
    display: flex;
  }
}
</style>