<template>
  <div class="weapon-stat">
    <template v-if="weaponName">
      <span class="weapon-name-stat bold">{{ weaponName }}</span>
      <div class="toggle-chd-hsd">
        <Toggle
          @input="updatedToggle()"
          v-model="toggleHSD"
          :label="'Toggle Headshot'"
        ></Toggle>
        <Toggle
          @input="updatedToggle()"
          v-model="toggleCHD"
          :label="'Toggle Critical'"
        ></Toggle>
      </div>
      <span
        >Weapon damage <span> {{ roundValue(weaponDamage) }}</span></span
      >
      <span
        >Damage to Armored target
        <span>{{ roundValue(dmgToArmored) }}</span></span
      >
      <span
        >Damage to Out Of Cover target
        <span>{{ roundValue(dmgToOutOfCover) }}</span></span
      >
      <span
        >Damage to Armored OOC target
        <span>{{ roundValue(dmgToOutOfCoverArmored) }}</span></span
      >
      <span
        >Damage per magazine (AOOC)
        <span>{{ roundValue(dmgToOutOfCoverArmoredPerMag) }}</span></span
      >
      <span
        >Headshot Damage <span>{{ roundValue(hsd) }}%</span></span
      >
      <span
        >Critical Hit Damage <span>{{ roundValue(chd) }}%</span></span
      >
      <span
        >Critical Hit Chance <span>{{ roundValue(chc) }}/60%</span></span
      >
      <span
        >Damage To Target Out of Cover
        <span>{{ roundValue(dtooc) }}%</span></span
      >
      <span
        >Damage To Armor <span>{{ roundValue(dta) }}%</span></span
      >
      <span
        >RPM <span>{{ rpm }}</span></span
      >
      <span
        >Magazine Size <span>{{ roundValue(totalMagSize) }}</span></span
      >
      <span
        >Reload speed <span>{{ roundValue(reloadSpeed / 1000) }}s</span></span
      >
      <!-- <span
        >Damage (additive) increase by
        <span>{{ roundValue(damageIncrease) }}%</span></span
      > -->
    </template>
    <span class="weapon-name-stat bold" v-if="!weaponName"
      >No weapon selected</span
    >
  </div>
</template>

<script>
import DPSChartCore from "../../utils/DPSChartCore";
import statsService from "../../utils/statsService";
import Toggle from "../generic/Toggle";

export default {
  name: "SingleWeaponStats",
  props: {
    name: null,
  },
  components: {
    Toggle,
  },
  data() {
    return {
      stats: null,
      weaponName: null,
      chc: null,
      chd: null,
      weaponDamage: null,
      damageIncrease: null,
      dmgToArmored: 0,
      dmgToOutOfCover: 0,
      dmgToOutOfCoverArmored: 0,
      dmgToOutOfCoverArmoredPerMag: 0,
      dta: 0,
      dtooc: 0,
      hsd: 0,
      totalMagSize: 0,
      toggleHSD: false,
      toggleCHD: false,
    };
  },
  created() {
    statsService.getStats$().subscribe((stats) => {
      if (!stats) {
        return;
      }
      this.stats = stats;
      this.updateStatsUI(stats.Weapons[this.name]);

      // Turn off toggles because we received a new weapon
      this.toggleCHD = false;
      this.toggleHSD = false;
    });
  },
  methods: {
    updateStatsUI(stats) {
      const props = [
        "weaponName",
        "damageIncrease",
        "hsd",
        "chd",
        "chc",
        "weaponDamage",
        "dmgToArmored",
        "dmgToOutOfCover",
        "dmgToOutOfCoverArmored",
        "rpm",
        "totalMagSize",
        "dmgToOutOfCoverArmoredPerMag",
        "reloadSpeed",
      ];

      for (let i = 0; i < props.length; i++) {
        const prop = props[i];
        this[prop] = stats[prop];
      }
    },
    roundValue(number) {
      return Number(Number(number).toFixed(2)).toLocaleString();
    },
    updatedToggle() {
      const newStats = statsService.getWeaponStatsPerSlot(
        this.name,
        this.toggleCHD,
        this.toggleHSD
      );
      this.updateStatsUI(newStats);
    },
  },
};
</script>

<style lang="scss" scoped>
.weapon-stat {
  color: white;
  display: flex;
  flex-direction: column;
  > span {
    border-bottom: 1px solid white;
    padding: 8px;
    > span {
      float: right;
    }
  }
}

span.weapon-name-stat.bold {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background: #1a1e24;
  z-index: 1;
}

.toggle-chd-hsd {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: sticky;
  top: 41px;
  background: #1a1e24;
}
</style>