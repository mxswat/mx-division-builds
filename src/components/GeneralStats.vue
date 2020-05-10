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
      Offensive {{coresCount.offensive}}
    </span>
    <div class="stats-list-2-col" v-if="stats">
      <div v-for="(stat, idx) in offensiveStats" v-bind:key="idx">
        {{stat.statName}}:
        <span>{{stat.value}}</span>
      </div>
    </div>
    <span class="section-title defensive">
      <img src="icons/defense1.png" class="image" />
      Defensive {{coresCount.defensive}}
    </span>
    <div class="stats-list-2-col" v-if="stats">
      <div v-for="(stat, idx) in defensiveStats" v-bind:key="idx">
        {{stat.statName}}:
        <span>{{stat.value}}</span>
      </div>
    </div>
    <span class="section-title utility">
      <img src="icons/tech1.png" class="image" />
      Utility {{coresCount.utility}}
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
import { combineLatest, map, timer } from "rxjs";
import { debounce } from "rxjs/operators";
import { utilityStats, offensiveStats, defensiveStats } from "../utils/utils";
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
      coresCount: {
        utility: 0,
        offensive: 0,
        defensive: 0
      }
    };
  },
  created() {
    const _vm = this;
    combineLatest(
      statsService.getStats$(),
      statsService.getBrands$()
    ).subscribe(([stats, brands]) => {
      _vm.updateStatsUI(stats, brands);
    });
  },
  methods: {
    updateStatsUI(stats, brands) {
      this.brands = brands;
      this.stats = stats;
      this.utilityStats = [];
      this.offensiveStats = [];
      this.defensiveStats = [];
      let utilityStatsIndexPrev = -1;
      let offensiveStatsIndexPrev = -1;
      let defensiveStatsIndexPrev = -1;
      for (const statName in this.stats) {
        // eslint-disable-next-line
        if (this.stats.hasOwnProperty(statName)) {
          const values = this.stats[statName];
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
      if (this.stats) {
        if (this.stats["Skill Tier"]) {
          this.coresCount.utility = this.stats["Skill Tier"].length;
        }
        if (this.stats["Weapon Damage"]) {
          this.coresCount.offensive = this.stats["Weapon Damage"].length;
        }
        if (this.stats["Armor"]) {
          this.coresCount.defensive = this.stats["Armor"].length;
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
// .brand-stats {
// }
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