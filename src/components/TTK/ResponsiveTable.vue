<template>
  <table role="table">
    <thead role="rowgroup">
      <tr role="row">
        <th role="columnheader" v-for="(header, idx) in headers" v-bind:key="idx">{{header}}</th>
      </tr>
    </thead>
    <tbody role="rowgroup">
      <tr role="row" v-for="(row, idx) in rowData" v-bind:key="idx">
        <td role="cell" v-for="(col, idx) in row" v-bind:key="idx">{{col}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "ResponsiveTable",
  props: {
    headers: Array,
    rowData: Array,
  },
  created() {
    // aaaaaaaaa
  }
};
</script>

<style scoped>
/*
  Max width before this PARTICULAR table gets nasty. This query will take effect for any screen smaller than 760px and also iPads specifically.
*/
@media only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
  /* Force table to not be like tables anymore */
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  /* Hide table headers (but not display: none;, for accessibility) */
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    margin: 0 0 1rem 0;
  }

  tr:nth-child(odd) {
    /* background: #ccc; */
  }

  td {
    /* Behave  like a "row" */
    border: none;
    /* border-bottom: 1px solid #eee; */
    position: relative;
  }
}
</style>