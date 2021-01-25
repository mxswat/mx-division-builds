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
    <div class="stats-list-3-col" v-if="stats">
      <div v-for="(stat, idx) in offensiveStats" v-bind:key="idx">
        {{stat.key}}:
        <span>{{stat.value}}</span>
      </div>
    </div>
    <span class="section-title defensive">
      <img src="icons/defense1.png" class="image" />
      Defensive {{coresCount.defensive}}
    </span>
    <div class="stats-list-3-col" v-if="stats">
      <div v-for="(stat, idx) in defensiveStats" v-bind:key="idx">
        {{stat.key}}:
        <span>{{stat.value}}</span>
      </div>
    </div>
    <span class="section-title utility">
      <img src="icons/tech1.png" class="image" />
      Utility {{coresCount.utility}}
    </span>
    <div class="stats-list-3-col" v-if="stats">
      <div v-for="(stat, idx) in utilityStats" v-bind:key="idx">
        {{stat.key}}:
        <span>{{stat.value}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { combineLatest } from "rxjs";
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
    statsService.getStats$().subscribe((stats) => {
      _vm.updateStatsUI(stats);
    });
  },
  methods: {
    updateStatsUI(stats) {
      if (!stats) {
        return
      }
      this.brands = stats.brands;
      this.stats = stats;
      this.utilityStats = Object.entries(stats.Utility).map(([key, value]) => ({key,value}));
      this.offensiveStats = Object.entries(stats.Offensive).map(([key, value]) => ({key,value}));
      this.defensiveStats = Object.entries(stats.Defensive).map(([key, value]) => ({key,value}));
      this.coresCount.offensive = stats.Cores.Offensive;
      this.coresCount.defensive = stats.Cores.Defensive;
      this.coresCount.utility  = stats.Cores.Utility;
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
.stats-list-3-col {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  div {
    display: flex;
    flex-shrink: 1;
    flex-grow: 0;
    flex-basis: calc(33% - 8px);
    padding-right: 8px;
    min-width: 180px;
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