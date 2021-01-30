<template>
  <div id="app">
    <BasicTile classes="toolbar-container">
      <Toolbar></Toolbar>
    </BasicTile>
    <div class="loading" v-if="!loaded">
      <span class="loader"></span>
    </div>
    <div class="loading" v-if="errorOnGetData">
      <span
        >I'm sorry, too many people are connected to the server right now. Try
        again later in one hour.<br />
        If you can, please report this issue at
        <a style="color: " href="http://discord.gg/ShYner2"
          >my discord server!</a
        ></span
      >
    </div>
    <div class="grid-container" v-if="loaded && !errorOnGetData">
      <router-view></router-view>
      <WeaponStats></WeaponStats>
      <div class="spec-and-stats">
        <BasicTile classes="specialization">
          <SpecializationSlot></SpecializationSlot>
        </BasicTile>
        <BasicTile classes="SHD-levels">
          <SHDLevels></SHDLevels>
        </BasicTile>
        <BasicTile classes="general-stats-col no-anim">
          <GeneralStats></GeneralStats>
        </BasicTile>
      </div>
      <BasicTile classes="dps-chart">
        <DPSChart></DPSChart>
      </BasicTile>
    </div>
    <v-dialog />
  </div>
</template>

<script>
import { IsEverythingLoadedPromise } from "./utils/dataImporter";
import WeaponStats from "./components/WeaponStats/WeaponStats";
import GeneralStats from "./components/GeneralStats";
import SHDLevels from "./components/SHDLevels";
import BasicTile from "./components/BasicTile";
import SpecializationSlot from "./components/SpecializationSlot";
import Toolbar from "./components/Toolbar";
import newFeatureGlow from "./utils/newFeatureGlow";
import DPSChart from "./components/DPSChart/DPSChart";

export default {
  name: "App",
  components: {
    WeaponStats,
    GeneralStats,
    BasicTile,
    SpecializationSlot,
    Toolbar,
    SHDLevels,
    DPSChart
  },
  data() {
    return {
      loaded: false,
      errorOnGetData: false,
    };
  },
  created() {
    IsEverythingLoadedPromise.then(() => {
      this.loaded = true;
      console.log("IsEverythingLoadedPromise Complete");
      newFeatureGlow("screenshotBTT");
    }).catch(() => {
      this.errorOnGetData = true;
      this.loaded = true;
      console.log("Too many request :( ");
    });
  },
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
  margin-top: 8px;
  margin-left: 8px;
  margin-right: 8px;
  @include media("<=uibreak") {
    grid-template-columns: repeat(1, [col] 1fr);
    .inventory-gui {
      grid-column: col 1;
      grid-row: row 1;
    }
    .spec-and-stats {
      grid-column: col 1;
      grid-row: row 2;
    }
    .general-stats-col.tile {
      position: relative;
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

.specialization {
  grid-column: col 4 / span 2;
  grid-row: row;
  margin-bottom: 8px;
}

.weapon-stats-container {
  grid-column: col / span 3;
  grid-row: row 2;
}

.spec-and-stats {
  grid-column: col 4 / span 2;
  grid-row: row;
}

.tile.general-stats-col {
  position: sticky;
  top: 0;
  height: fit-content;
}

.tile.toolbar-container {
  min-height: 0px !important;
  padding: 8px;
  margin: 8px;
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

a {
  color: orange;
}

.talent-description {
  padding: 10px;
  border-bottom: 1px solid white;
}

// Make every tile have a min height
.tile {
  min-height: 230px;
  &.specialization,
  &.SHD-levels {
    min-height: 0px;
  }
}

.loading {
  display: flex;
  flex: 1 1 auto;
  height: calc(100vh - 110px);
  align-items: center;
  justify-content: center;
}

$loader-size: 150px;
.loader {
  width: $loader-size;
  height: $loader-size;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  border: 3px solid;
  border-color: #fff #fff transparent transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
.loader::after,
.loader::before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  border: 3px solid;
  border-color: transparent transparent #ff3d00 #ff3d00;
  width: $loader-size - 28;
  height: $loader-size - 28;
  border-radius: 50%;
  box-sizing: border-box;
  animation: rotationBack 0.5s linear infinite;
  transform-origin: center center;
}
.loader::before {
  width: $loader-size - 56;
  height: $loader-size - 56;
  border-color: #fff #fff transparent transparent;
  animation: rotation 1.5s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes rotationBack {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}

$glow-color: #ff6d10;

@-webkit-keyframes glow {
  to {
    border-color: $glow-color;
    -webkit-box-shadow: 0 0 5px $glow-color;
    -moz-box-shadow: 0 0 5px $glow-color;
    box-shadow: 0 0 5px $glow-color;
  }
}

.new-feature-glow {
  background-color: #ccc;
  border: 1px solid transparent;
  -webkit-animation: glow 1s infinite alternate;
  -webkit-transition: border 1s linear, box-shadow 1s linear;
  -moz-transition: border 1s linear, box-shadow 1s linear;
  transition: border 1s linear, box-shadow 1s linear;
}

.SHD-levels {
  margin-bottom: 8px;
}

.dps-chart {
  grid-column: col 1 / span 5;
}
</style>
