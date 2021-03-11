<template>
  <div>
    <span class="section-title">Gearset/Brand bonus</span>
    <div class="brand-gear-bonus">
      <template v-for="(stats, brand) in brands">
        <div class="brand-container" v-bind:key="brand">
          <span class="brand-name">{{ brand }}</span>
          <span class="brand-stats" v-for="stat in stats" v-bind:key="stat">{{
            stat
          }}</span>
        </div>
      </template>
    </div>
    <span class="section-title offensive">
      <img alt="" src="icons/offense1.png" class="image" />
      Offensive Cores {{ coresCount.offensive }} | All weapons damage:
      {{ allWeaponDamage }} %
    </span>
    <div class="stats-list-3-col" v-if="stats">
      <div v-for="(stat, idx) in offensiveStats" v-bind:key="idx">
        {{ stat.key }}:
        <span>{{ roundValue(stat.value) }}</span>
      </div>
    </div>
    <span class="section-title defensive">
      <img alt="" src="icons/defense1.png" class="image" />
      Defensive Cores {{ coresCount.defensive }} | Armor: {{ armorValue }}
    </span>
    <div class="stats-list-3-col" v-if="stats">
      <div v-for="(stat, idx) in defensiveStats" v-bind:key="idx">
        {{ stat.key }}:
        <span>{{ roundValue(stat.value) }}</span>
      </div>
    </div>
    <span class="section-title utility">
      <img alt="" src="icons/tech1.png" class="image" />
      Utility Cores {{ coresCount.utility }}
    </span>
    <div class="stats-list-3-col" v-if="stats">
      <div v-for="(stat, idx) in utilityStats" v-bind:key="idx">
        {{ stat.key }}:
        <span>{{ roundValue(stat.value) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { STATS_ENUM } from "../utils/utils";
import statsService from "../utils/statsService";
export default {
  name: "GeneralStats",
  data() {
    return {
      brands: null,
      stats: null,
      utilityStats: [],
      offensiveStats: [],
      defensiveStats: [],
      allWeaponDamage: 0,
      armorValue: 0,
      coresCount: {
        utility: 0,
        offensive: 0,
        defensive: 0,
      },
    };
  },
  created() {
    const _vm = this;
    statsService.getStats$().subscribe((stats) => {
      _vm.updateStatsUI(stats);
    });
  },
  methods: {
    updateStatsUI(stats) {
      if (!stats) {
        return;
      }
      this.brands = stats.brands;
      this.stats = stats;
      this.utilityStats = Object.entries(stats.Utility).map(([key, value]) => ({
        key,
        value,
      }));
      this.offensiveStats = Object.entries(
        stats.Offensive
      ).map(([key, value]) => ({ key, value }));
      this.defensiveStats = Object.entries(
        stats.Defensive
      ).map(([key, value]) => ({ key, value }));
      this.coresCount.offensive = stats.Cores.Offensive.length;
      this.coresCount.defensive = stats.Cores.Defensive.length;
      this.coresCount.utility = stats.Cores.Utility.length;
      this.allWeaponDamage =
        stats.Cores.Offensive.length > 0
          ? stats.Cores.Offensive.reduce((a, b) => a + b)
          : 0;
      this.allWeaponDamage += stats.Offensive[STATS_ENUM.WEAPON_DAMAGE] || 0;
      const allArmorCores =
        stats.Cores.Defensive.length > 0
          ? stats.Cores.Defensive.reduce((a, b) => a + b)
          : 0;
      //660014 is the base Armor Value for a LVL40 agent
      this.armorValue =
        (660014 + allArmorCores) *
        (1 + stats.Defensive[STATS_ENUM.TOTAL_ARMOR] / 100);
      this.armorValue = this.roundValue(this.armorValue, 0);
    },
    sumStatVals(vals) {
      return vals.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    },
    roundValue(number, fractionDigits = 2) {
      return Number(number.toFixed(fractionDigits)).toLocaleString();
    },
  },
};
</script>

<style lang="scss" scoped>
.brand-gear-bonus {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.brand-container {
  display: flex;
  flex-direction: column;
  flex-shrink: 1;
  flex-grow: 0;
  flex-basis: calc(50% - 8px);
  margin-right: 8px;
  margin-bottom: 8px;
}
// .brand-stats {
// }
.stats-list-3-col {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  div {
    display: flex;
    flex-shrink: 1;
    flex-grow: 0;
    flex-basis: calc(33% - 8px);
    min-width: 180px;
    margin-right: 8px;
    border-bottom: 1px solid white;
    padding: 4px 0px;
  }

  span {
    margin-left: auto;
    text-align: left;
    min-width: 30px;
  }
}
.brand-name {
  border-bottom: 1px solid white;
  margin-bottom: 8px;
}

.offensive {
  color: #ce474d;
}
.defensive {
  color: #82abd6;
}
.utility {
  color: #f7d07c;
}

span.brand-stats {
  white-space: pre-wrap;
}
</style>