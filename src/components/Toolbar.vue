<template>
  <div class="toolbar">
    <span>The division 2 Builds tool</span>
    <div class="spacer"></div>
    <button @click="history.back()">Undo</button>
    <button @click="history.forward()">Redo</button>
    <button @click="saveAndShare()">Save & Share</button>
    <button @click="clear()">Clear</button>
    <button @click="newBuild()">New Build</button>
    <button style="color: #f7d07c;" @click="issues()">Issues or bug?</button>
  </div>
</template>

<script>
import { openSaveShareModal, openIssueModal } from "../utils/modalService";

export default {
  name: "Toolbar",
  data() {
    return {
      history
    };
  },
  created() {
    this.history = window.history;
  },
  methods: {
    saveAndShare() {
      openSaveShareModal();
    },
    clear() {
      // TODO: Yeah this should be changed
      this.$router.push({
        name: "home"
      });
      location.reload();
    },
    newBuild() {
      const routeData = this.$router.resolve({name: 'home'});
      window.open(routeData.href, '_blank');
    },
    issues() {
      openIssueModal()
    }
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