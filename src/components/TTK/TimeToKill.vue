<template>
  <div>
    <span class="section-title"> Time To Kill / Bullets to Kill </span>
    <div class="charts-container">
      <div class="ttk-chart" id="challenging-chart"></div>
      <div class="ttk-chart" id="heroic-chart"></div>
      <div class="ttk-chart" id="legendary-chart"></div>
    </div>
  </div>
</template>

<script>
import { getAppRootPath } from "../../utils/utils";
import Plotly from "plotly.js-dist";
import { getPlotlyDefault1, getPlotlyDefault2 } from "../../utils/plotDefaults";

const DEFAULT_PLOT = getPlotlyDefault1("TTK (s)", "Difficulty")
const DEFAULT_PLOT_2 = getPlotlyDefault2();

export default {
  name: "TimeToKill",
  created() {
    const path = getAppRootPath() + "HPValues.json";
    fetch(`${path}`, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.buildCharts(data);
      });
  },
  methods: {
      buildCharts() {
          const targets = [
            'challenging-chart',
            'heroic-chart',
            'legendary-chart',
          ]
          for (let i = 0; i < targets.length; i++) {
              const element = targets[i];
              Plotly.newPlot(element, [], getPlotlyDefault1("TTK (s)", "Difficulty", element), DEFAULT_PLOT_2);
              
          }
      }
  }
};
</script>

.<style scoped>
.charts-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
}

.ttk-chart {
    min-height: 400px;
}
</style>