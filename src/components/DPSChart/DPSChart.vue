<template>
  <div>
    <span class="section-title"> Damage over Time - Visualization </span>
    <div class="toggles">
      <Toggle
        style="max-width: 126px"
        @input="updatedColorBlind()"
        v-model="isColorblind"
        :label="'Color blind?'"
      ></Toggle>
    </div>
    <div id="chart-test"></div>
    <span> Click on the trace on the legend to hide or show it! </span>
  </div>
</template>

<script>
import Plotly from "plotly.js-dist";
import DPSChartCore from "../../utils/DPSChartCore";
import Toggle from "../generic/Toggle";
const DEFAULT_PLOT = {
  margin: { t: 25, b: 25, l: 50, r: 50 },
  plot_bgcolor: "#1a1e24",
  paper_bgcolor: "#1a1e24",
  font: { color: "white" },
  yaxis: {
    gridcolor: "#ffffff66",
    title: {
      text: "Damage",
    },
  },
  xaxis: {
    gridcolor: "#ffffff66",
    title: {
      text: "Seconds - Flat lines is the reload time",
    },
  },
  legend: { orientation: "h" },
};
const DEFAULT_PLOT_2 = { showSendToCloud: true, responsive: true };
const dashStyles = ["solid", "dashdot", "dot"];
const colors = ["#E69F00", "#56B4E9", "#009E73"];
export default {
  name: "DPSChart",
  components: { Toggle },
  data() {
    return {
      target: null,
      isColorblind: false,
      cacheCoreTraces: [],
      cacheExtraTraces: [],
    };
  },
  created() {
    DPSChartCore.subscribeToCoreWeaponsTrace().subscribe((weapons) => {
      this.cacheCoreTraces = weapons;
      this.updateChart(weapons);
    });
  },
  mounted() {
    this.target = document.getElementById("chart-test");
    Plotly.newPlot(this.target, [], DEFAULT_PLOT, DEFAULT_PLOT_2);
  },
  methods: {
    updateChart(weapons) {
      const weaponTraces = [];
      for (let i = 0; i < weapons.length; i++) {
        const weapon = weapons[i];
        if (weapon) {
          weapon.line = {
            dash: this.isColorblind ? dashStyles[i] : undefined,
            color: colors[i],
          };
          weaponTraces.push(weapon);
        }
      }

      Plotly.react(this.target, weaponTraces, DEFAULT_PLOT, DEFAULT_PLOT_2);
    },
    updatedColorBlind() {
      this.updateChart(this.cacheCoreTraces);
    },
  },
};
</script>

<style lang="scss">
div#chart-test {
  min-height: 600px;
}

.toggles {
  display: flex;
}
</style>