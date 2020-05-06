<template>
  <div>
    <span>Gearset/Brand bonus</span>
    <div class="brand-gear-bonus">
      <template v-for="(stats, brand) in brands">
        <div class="brand-container" v-bind:key="brand">
          <span class="brand-name">{{brand}}</span>
          <span class="brand-stats" v-for="stat in stats" v-bind:key="stat">{{stat}}</span>
        </div>
      </template>
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
    }
  }
};
</script>

<style lang="scss" scoped>
.brand-gear-bonus {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: sticky;
  top: 0;
}
.brand-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-basis: calc(33.33% - 16px);
  padding: 8px;
}
.brand-name {
  margin-bottom: 8px;
}
.brand-stats {
  padding-left: 8px;
}
</style>