<template>
  <div class="ttk-ui">
    <span class="section-title"> Time To Kill / Bullets to Kill </span>
    <ResponsiveTable :headers="headers" :rowData="rowData"></ResponsiveTable>
  </div>
</template>

<script>
import { getAppRootPath } from "../../utils/utils";
import ResponsiveTable from "./ResponsiveTable";
export default {
  name: "TimeToKill",
  components: {
    ResponsiveTable,
  },
  data() {
    return {
      headers: [],
      rowData: [],
    };
  },
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
    buildCharts(data) {
      // for (let i = 0; i < data.length; i++) {
        const playerScalingData = data[1];
        this.headers = [];
        for (const difficulty in playerScalingData) {
          this.headers.push(difficulty);
          this.rowData.push([1, 2, 3, 4]);
        }
      // }
      console.log(this.rowData);
    },
  },
};
</script>

.<style scoped>
.ttk-ui {
  width: 100%;
}
</style>