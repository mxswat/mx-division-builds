<template>
  <div id="app">
    <div class="grid-container" v-if="loaded">
      <div class="tbd-one"></div>
      <router-view></router-view>
      <div class="tbd-two"></div>
    </div>
    <div class="grid-container" v-if="loaded">
      <div class="tbd-one"></div>
      <WeaponStats></WeaponStats>
      <div class="tbd-two"></div>
    </div>
  </div>
</template>

<script>
import { allDataPromies } from "./utils/dataImporter";
import WeaponStats from "./components/WeaponStats/WeaponStats";
export default {
  name: "App",
  components: {
    WeaponStats
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

html,
body,
#app,
.grid-container {
  margin: 0;
  background: #252525;
  font-family: "Roboto", sans-serif;
}

.grid-container {
  display: grid;
  grid-template-columns: 0.25fr 1fr 0.25fr;
  grid-template-rows: 1fr;
  gap: 8px 8px;
  grid-template-areas: "tbd-one main-area tbd-two";
}

.main-area {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto auto auto;
  gap: 8px 8px;
  grid-template-areas: "specialization specialization specialization" "primary secondary pistol" "mask backpack chest" "gloves holster kneepads" "skill-one skill-two boh";
  grid-area: main-area;
}

.specialization {
  grid-area: specialization;
}

.pistol {
  grid-area: pistol;
}

.primary {
  grid-area: primary;
}

.secondary {
  grid-area: secondary;
}

.mask {
  grid-area: mask;
}

.backpack {
  grid-area: backpack;
}

.chest {
  grid-area: chest;
}

.gloves {
  grid-area: gloves;
}

.holster {
  grid-area: holster;
}

.kneepads {
  grid-area: kneepads;
}

.skill-one {
  grid-area: skill-one;
}

.skill-two {
  grid-area: skill-two;
}

.tbd-one {
  grid-area: tbd-one;
}

.tbd-two {
  grid-area: tbd-two;
}

// Import first the variables or the override wont work
$vs-colors: (
  lightest: white,
  light: white,
  dark: white,
  darkest: white
);
$vs-dropdown-box-shadow: none;
$vs-border-radius: 0px;
$vs-dropdown-bg: #151515;
// Than import the actuall vue-select scss
@import "vue-select/src/scss/vue-select.scss";

.vs__dropdown-option {
  color: white;
  display: flex;
  align-items: center;
}

.vs__dropdown-option--highlight {
  background: rgba(255, 165, 0, 0.5);
  color: white;
}

.vs__search::placeholder {
  color: white;
}

.vs__dropdown-toggle {
  border: 0;
  border-bottom: 1px solid white;
}

.vs--searchable .vs__search,
.vs--searchable .vs__dropdown-toggle {
  cursor: pointer;
}

.vs--searchable.vs--open .vs__search {
  cursor: text;
  caret-color: white;
}

.vs__search:focus::placeholder {
  color: transparent;
}

.vs__selected + input.vs__search {
  position: absolute;
}

// .vs__selected + input.vs__search[aria-activedescendant] {
//   position: relative;
// }

.v-select.vs--open input.vs__search {
  position: relative;
}

.vs--single .vs__selected {
  width: 100%;
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

@import "./style/main.scss";

.tile:not(.specialization) {
  min-height: 230px;
}
</style>
