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
    <span class="section-title">All Stats</span>
    <div class="all-stats-list">
      <div v-for="(vals, stat) in stats" v-bind:key="stat">
        {{stat}}:
        <span>{{sumStatVals(vals)}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { statsProvider } from "../utils/statsCalculator";
import { combineLatest, map, timer } from "rxjs";
import { debounce } from "rxjs/operators";
export default {
  name: "GeneralStats",
  data() {
    return {
      brands: null,
      stats: null
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
  },
  methods: {
    updateStatsUI(allStats) {
      console.log(allStats);
      this.brands = allStats.brands;
      this.stats = allStats.stats;
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
.all-stats-list {
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
  display: block;
  margin-bottom: 16px;
  position: sticky;
  top: 0;
  background: #1a1e24;
  padding: 8px 0px;
}
</style>