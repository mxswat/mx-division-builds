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
      divTarget, [],
      {
        margin: { t: 25, b: 25, l: 50, r: 50 },
        plot_bgcolor: "transparent",
        paper_bgcolor: "transparent",
        font: { color: "white" },
      },
      { showSendToCloud: true }
    );
  },
};
</script>

<style lang="scss">
div#chart-test {
  min-height: 600px;
}
</style>