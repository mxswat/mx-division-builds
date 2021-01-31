<template>
  <div id="chart-test"></div>
</template>

<script>
import Plotly from "plotly.js-dist";
import DPSChartCore from "../../utils/DPSChartCore";

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
export default {
  name: "DPSChart",
  data() {
    return {
      target: null,
    };
  },
  created() {
    DPSChartCore.subscribeToCombinedWeaponUpdates().subscribe((weapons) => {
      const weaponTraces = [];
      for (let i = 0; i < weapons.length; i++) {
        const weapon = weapons[i];
        if (weapon) {
          weaponTraces.push(weapon);
        }
      }

      Plotly.react(this.target, weaponTraces, DEFAULT_PLOT, DEFAULT_PLOT_2);
    });
  },
  mounted() {
    this.target = document.getElementById("chart-test");
    Plotly.newPlot(this.target, [], DEFAULT_PLOT, DEFAULT_PLOT_2);
  },
};
</script>

<style lang="scss">
div#chart-test {
  min-height: 600px;
}
</style>