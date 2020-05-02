<template>
  <input
    class="stat-value"
    type="number"
    :value="value"
    v-on:input="updateValue($event.target.value)"
  />
</template>

<script>
export default {
  name: "StatInput",
  props: {
    value: null,
    maxPath: null
  },
  methods: {
    updateValue: function(value) {
      this.$emit("input", value);
    }
  }
};
</script>

<style>
</style>