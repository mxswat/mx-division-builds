<template>
  <div style="height: 100%">
    <ag-grid-vue
      style="height: 100%"
      class="ag-theme-alpine-dark"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :gridOptions="gridOptions"
    ></ag-grid-vue>
  </div>
</template>

<script>
import { masksList } from "../utils/dataImporter";
import { AgGridVue } from "ag-grid-vue";
import { columnDef } from "../utils/agGridDefaults";
export default {
  name: "GearModal",
  props: ["gearData", "onModalClose"],
  components: { AgGridVue },
  data() {
    return {
      rowData: null,
      gridOptions: {
        onRowClicked: this.onRowClicked,
        suppressCellSelection: true
      },
      columnDefs: [
        // { headerName: "Brand", field: "Brand", ...columnDef }, hidden, not really needed for now
        { headerName: "Quality", field: "Quality", ...columnDef },
        { headerName: "Item Name", field: "Item Name", ...columnDef },
        { headerName: "Core", field: "Core", ...columnDef },
        { headerName: "Attribute 1", field: "Attribute 1", ...columnDef },
        { headerName: "Attribute 2", field: "Attribute 2", ...columnDef },
        { headerName: "Mod", field: "Mod", ...columnDef },
        { headerName: "Talent", field: "Talent", ...columnDef }
      ]
    };
  },
  methods: {
    onRowClicked(node) {
      this.$emit("close");
      this.onModalClose(node.data);
    }
  },
  mounted() {
    this.rowData = this.gearData;
  }
};
</script>

<style>
</style>