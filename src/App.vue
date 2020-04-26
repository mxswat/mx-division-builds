<template>
  <div id="app">
    <div class="grid-container">
      <div class="tbd-one"></div>
      <router-view></router-view>
      <div class="tbd-two"></div>
    </div>
  </div>
</template>

<script>

export default {
  name: "App",
  components: {
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
  grid-template-rows: 33vh 33vh calc(33vh - 8px) auto;
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

// TODO Make SCSS Vars

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
::-webkit-scrollbar-thumb {
  background: #e1e1e1;
  border: 0px none #ffffff;
  border-radius: 0px;
}
::-webkit-scrollbar-thumb:hover {
  background: #ffffff;
}
::-webkit-scrollbar-thumb:active {
  background: orange;
}
::-webkit-scrollbar-track {
  background: #666666;
  border: 0px none #ffffff;
  border-radius: 0px;
}
::-webkit-scrollbar-track:hover {
  background: #666666;
}
::-webkit-scrollbar-track:active {
  background: #333333;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
