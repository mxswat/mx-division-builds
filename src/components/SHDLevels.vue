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
import { typeToImgSrc } from "../utils/utils";
import coreService from "../utils/coreService";
export default {
  name: "SHDLevels",
  components: { StatInput },
  data() {
    return {
      typeToImgSrc: typeToImgSrc,
      levels: [],
    };
  },
  created() {
    this.typeToImgSrc = typeToImgSrc;
    this.levels = [
      {
        name: "Weapon Damage",
        max: 10,
        value: 0,
      },
      {
        name: "Headshot Damage",
        max: 10,
        value: 0,
      },
      {
        name: "Critical Hit Chance",
        max: 10,
        value: 0,
      },
      {
        name: "Critical Hit Damage",
        max: 20,
        value: 0,
      },
      {
        name: "Armor",
        max: 20,
        value: 0,
      },
      {
        name: "Skill Haste",
        max: 10,
        value: 0,
      },
      {
        name: "Skill Damage",
        max: 10,
        value: 0,
      },
      {
        name: "Skill Duration",
        max: 10,
        value: 0,
      },
      {
        name: "Repair Skills",
        max: 10,
        value: 0,
      },
    ];
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