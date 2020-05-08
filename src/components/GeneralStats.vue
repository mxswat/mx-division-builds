<template>
  <div>
    <span class="section-title">Gearset/Brand bonus</span>
    <div class="brand-gear-bonus">
      <template v-for="(stats, brand) in brands">
        <div class="brand-container" v-bind:key="brand">
          <span class="brand-name">{{brand}}</span>
          <span class="brand-stats" v-for="stat in stats" v-bind:key="stat">{{stat}}</span>
        </div>
      </template>
    </div>
    <span class="section-title offensive">
      <img src="icons/offense1.png" class="image" />
      Offensive
    </span>
    <div class="stats-list-2-col" v-if="stats">
      <div v-for="(stat, idx) in offensiveStats" v-bind:key="idx">
        {{stat.statName}}:
        <span>{{stat.value}}</span>
      </div>
    </div>
    <span class="section-title defensive">
      <img src="icons/defense1.png" class="image" />
      Defensive
    </span>
    <div class="stats-list-2-col" v-if="stats">
      <div v-for="(stat, idx) in defensiveStats" v-bind:key="idx">
        {{stat.statName}}:
        <span>{{stat.value}}</span>
      </div>
    </div>
    <span class="section-title utility">
      <img src="icons/tech1.png" class="image" />
      Utility
    </span>
    <div class="stats-list-2-col" v-if="stats">
      <div v-for="(stat, idx) in utilityStats" v-bind:key="idx">
        {{stat.statName}}:
        <span>{{stat.value}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { statsProvider } from "../utils/statsCalculator";
import { combineLatest, map, timer } from "rxjs";
import { debounce } from "rxjs/operators";
import { utilityStats, offensiveStats, defensiveStats } from "../utils/utils";
export default {
  name: "GeneralStats",
  data() {
    return {
      brands: null,
      stats: null,
      utilityStats: [],
      offensiveStats: [],
      defensiveStats: []
    };
  },
  created() {
    const _vm = this;
    statsProvider
      .getStats()
      .pipe(debounce(() => timer(300)))
      .subscribe(allStats => {
        _vm.updateStatsUI(allStats);
      });
    // this.utilityStats = utilityStats;
    // this.offensiveStats = offensiveStats;
    // this.defensiveStats = defensiveStats;
  },
  methods: {
    updateStatsUI(allStats) {
      console.log(allStats);
      this.brands = allStats.brands;
      this.stats = allStats.stats;
      this.utilityStats = [];
      this.offensiveStats = [];
      this.defensiveStats = [];
      let utilityStatsIndexPrev = -1;
      let offensiveStatsIndexPrev = -1;
      let defensiveStatsIndexPrev = -1;
      for (const statName in allStats.stats) {
        // eslint-disable-next-line
        if (allStats.stats.hasOwnProperty(statName)) {
          const values = allStats.stats[statName];
          const utilityStatsIndex = utilityStats.indexOf(statName);
          const offensiveStatsIndex = offensiveStats.indexOf(statName);
          const defensiveStatsIndex = defensiveStats.indexOf(statName);
          const value = this.sumStatVals(values);
          if (value > 0) {
            if (utilityStatsIndex >= 0) {
              this.utilityStats.push({
                statName,
                value
              });
            } else if (offensiveStatsIndex >= 0) {
              this.offensiveStats.push({
                statName,
                value
              });
            } else if (defensiveStatsIndex >= 0) {
              this.defensiveStats.push({
                statName,
                value
              });
            }
          }
        }
      }
    },
    sumStatVals(vals) {
      return vals.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    }
  }
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
.brand-stats {
}
.stats-list-2-col {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  div {
    display: flex;
    flex-shrink: 1;
    flex-grow: 0;
    flex-basis: calc(50% - 8px);
    padding-right: 8px;
  }

  span {
    margin-left: auto;
  }
}
.brand-name {
  border-bottom: 1px solid white;
  margin-bottom: 8px;
}
.section-title {
  font-weight: 700;
  border-bottom: 1px solid white;
  width: 100%;
  margin-bottom: 16px;
  position: sticky;
  top: 0;
  background: #1a1e24;
  display: flex;
  align-items: center;
  padding: 8px 0px;
  .image {
    width: 25px;
    margin-right: 4px;
  }
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
</style>