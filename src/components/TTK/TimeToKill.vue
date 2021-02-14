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
      const enemyTypes = ["Difficulty","Normal", "Veteran", "Elite", "Named"];
      this.headers = enemyTypes;
      for (const difficulty in playerScalingData) {
        const currentRow = [difficulty];
        for (let j = 0; j < enemyTypes.length; j++) {
          const enemyType = enemyTypes[j];
          currentRow.push(j);
        }
        this.rowData.push(currentRow);
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