<template>
  <div id="app">
    <div class="grid-container" v-if="loaded">
      <router-view></router-view>
      <WeaponStats></WeaponStats>
      <BasicTile classes="general-stats-col no-anim">
        <GeneralStats></GeneralStats>
      </BasicTile>
    </div>
  </div>
</template>

<script>
import { allDataPromies } from "./utils/dataImporter";
import WeaponStats from "./components/WeaponStats/WeaponStats";
import GeneralStats from "./components/GeneralStats";
import BasicTile from "./components/BasicTile";
export default {
  name: "App",
  components: {
    WeaponStats,
    GeneralStats,
    BasicTile
  },
  data() {
    return {
      loaded: false
    };
  },
  created() {
    Promise.all(allDataPromies).then(() => {
      this.loaded = true;
      console.log("allDataPromies Complete");
    });
  }
};
</script>

<style lang="scss">
@import "../node_modules/ag-grid-community/dist/styles/ag-grid.css";
@import "../node_modules/ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
@import "./style/main.scss";
@import "./style/_include-media.scss";

html,
body,
#app {
  margin: 0;
  background: #252525;
  background: #232830;
  // font-family: "Roboto", sans-serif;
  font-family: "Titillium Web", sans-serif;
  font-weight: 400;
  color: white;
  margin-bottom: 8px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(5, [col] 1fr);
  grid-template-rows: repeat(2, [row] auto);
  gap: 8px;
  margin-left: 8px;
  margin-right: 8px;
  @include media("<=uibreak") {
    grid-template-columns: repeat(1, [col] 1fr);
    .inventory-gui {
      grid-column: col 1;
      grid-row: row 1;
    }
    .general-stats-col {
      grid-column: col 1;
      grid-row: row 2;
      &.tile {
        position: relative;
      }
    }
    .weapon-stats-container {
      grid-column: col 1;
      grid-row: row 3;
    }
  }
}

.inventory-gui {
  grid-column: col / span 3;
  grid-row: row;
}

.general-stats-col {
  grid-column: col 4 / span 2;
  grid-row: row;
}

.weapon-stats-container {
  grid-column: col / span 3;
  grid-row: row 2;
}

.tile.general-stats-col {
  position: sticky;
  top: 0;
  height: fit-content;
}

.no-element-selected {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  cursor: pointer;
  p {
    position: absolute;
    bottom: 16px;
    left: 0px;
    right: 0px;
    color: orange;
    text-align: center;
  }
}

.talent-description {
  padding: 10px;
  border-bottom: 1px solid white;
}

.tile:not(.specialization) {
  min-height: 230px;
}
</style>
