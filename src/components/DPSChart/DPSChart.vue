<template>
  <div id="chart-test"></div>
</template>

<script>
import Plotly from "plotly.js-dist";

export default {
  name: "DPSChart",
  mounted() {
    const divTarget = document.getElementById("chart-test");
    Plotly.newPlot(
      divTarget,
      [],
      {
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
      },
      { showSendToCloud: true, responsive: true }
    );
  },
};
</script>

<style lang="scss">
div#chart-test {
  min-height: 600px;
}
</style>