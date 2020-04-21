<template>
  <div id="app">
    <div class="grid-container">
      <div class="tbd-one"></div>
      <InventoryGUI></InventoryGUI>
      <div class="tbd-two"></div>
    </div>
  </div>
</template>

<script>
import InventoryGUI from "./components/InventoryGUI";

export default {
  name: "App",
  components: {
    InventoryGUI
  }
};
</script>

<style lang="scss">
html,
body,
#app,
.grid-container {
  height: 100%;
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
  // grid-template-areas: "specialization pistol" "primary secondary" "mask backpack" "chest gloves" "holster kneepads" "skill-one skill-two";
  grid-template-areas: "primary secondary pistol" "mask backpack chest" "gloves holster kneepads" "skill-one skill-two specialization";
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

@import "../node_modules/ag-grid-community/dist/styles/ag-grid.css";
@import "../node_modules/ag-grid-community/dist/styles/ag-theme-alpine-dark.css";

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
  border-bottom: 1px solid;
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

.vs--single .vs__selected {
  position: absolute;
  width: 100%;
}

.vs__selected > .attribute-value {
    margin-right: 11px;
}
</style>
