<template>
  <input
    class="stat-value"
    type="number"
    :max="stat ? stat[maxPath] : 0"
    :value="stat ? stat[maxPath] : 0"
    :disabled="!stat"
  />
</template>

<script>
export default {
  name: "StatInput",
  props: {
    stat: null,
    maxPath: null
  }
};
</script>

<style>
</style>