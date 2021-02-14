<template>
  <div class="ttk-ui">
    <span class="section-title"> Time To Kill / Bullets to Kill </span>
    <template v-for="(tablesData, idx) in data">
      <div class="weapon-tables-container" v-bind:key="idx" v-if="tablesData">
        <span class="ttk-weapon-name">{{ tablesData.weaponName }}</span>
        <div class="ttk-tables">
          <ResponsiveTable
            v-for="(tables, idx) in tablesData.tables"
            v-bind:key="idx"
            :title="`${idx + 1} Players`"
            :headers="tables.headers"
            :rowData="tables.rowData"
          ></ResponsiveTable>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import ResponsiveTable from "./ResponsiveTable";
import TTKCoreService from "../../utils/TTKCore";
export default {
  name: "TimeToKill",
  components: {
    ResponsiveTable,
  },
  data() {
    return {
      cacheWeaponsData: null,
      data: [],
    };
  },
  created() {
    TTKCoreService.subscribeToCoreWeaponData().subscribe((tableData) => {
      this.updateTables(tableData);
    });
  },
  methods: {
    updateTables(data) {
      // I need to come up with a better name with this variable
      this.data = data;
    },
  },
};
</script>

.<style scoped>
.ttk-ui {
  width: 100%;
}

.ttk-tables {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

span.ttk-weapon-name {
  font-weight: 800;
  font-size: 18px;
  margin-top: 16px;
  display: block;
}
</style>