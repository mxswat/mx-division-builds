<template>
  <div class="tile outer-border" v-bind:class="[gearClass]">
    <div class="inner-border"></div>
    <slot></slot>
  </div>
</template>

<script>
const qualityToCss = {
  "High End": "high-end",
  Named: "named",
  Exotic: "exotic",
  Gearset: "gearset"
};

export default {
  name: "BasicTile",
  props: {
    name: String
  },
  data() {
    return {
      gearClass: ""
    };
  },
  methods: {
    gearChanged(gear) {
      this.gearClass = qualityToCss[gear.quality] + " no-anim";
      this.$parent.gearChanged(this.name, gear);
    }
  }
};
</script>

<style scoped lang="scss">
.tile {
  background: rgba(0, 0, 0, 0.25);
  position: relative;
  padding: 16px;
  overflow: visible;

  &.high-end {
    background: rgba(243, 175, 30, 0.25);
  }
  &.named {
    background: rgba(243, 175, 30, 0.25);
  }
  &.exotic {
    background: rgba(255, 94, 0, 0.25);
  }
  &.gearset {
    background: rgba(1, 224, 143, 0.25);
  }
}

// Borders
.outer-border,
.inner-border {
  &:after,
  &:before {
    display: block;
    content: "";
    width: 20px;
    height: 20px;
    position: absolute;
    pointer-events: none;
    z-index: 1;
  }
}

.outer-border {
  &:before {
    top: 0px;
    left: 0px;
    border-top: 2px solid white;
    border-left: 2px solid white;
    transition: 0.5s all;
    z-index: 1;
  }

  &:after {
    top: 0px;
    right: 0px;
    border-top: 2px solid white;
    border-right: 2px solid white;
    transition: 0.5s all;
    z-index: 1;
  }
}

.outer-border:not(.no-anim) {
  &:hover {
    &:after,
    &:before {
      width: calc(100% - 2px);
      height: calc(100% - 2px);
    }
    .inner-border {
      &:after,
      &:before {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
      }
    }
  }
}

.inner-border {
  height: 100%;
  width: 100%;
  pointer-events: none;
  position: absolute;
  left: 0px;
  top: 0px;
  &:before {
    bottom: 0px;
    left: 0px;
    border-bottom: 2px solid white;
    border-left: 2px solid white;
    transition: 0.5s all;
  }
  &:after {
    bottom: 0px;
    right: 0px;
    border-bottom: 2px solid white;
    border-right: 2px solid white;
    transition: 0.5s all;
  }
}
</style>
