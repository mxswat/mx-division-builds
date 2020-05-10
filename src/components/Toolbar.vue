<template>
  <div class="toolbar">
    <span>The division 2 Builds tool</span>
    <div class="spacer"></div>
    <button @click="history.back()">Undo</button>
    <button @click="history.forward()">Redo</button>
    <button>Save & Share</button>
    <button>Clear</button>
    <button>New Build</button>
  </div>
</template>

<script>
export default {
  name: "Toolbar",
  data() {
    return {
      history
    };
  },
  created() {
    this.history = window.history;
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
}
.spacer {
  flex: 1 1;
}

button {
  margin-left: 8px;
  color: white;
  border: 1px solid white;
  background: transparent;
}
</style>