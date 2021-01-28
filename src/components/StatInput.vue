<template>
  <input
    class="stat-value"
    type="number"
    step="0.1"
    :max="max"
    :value="value"
    :placeholder="max"
    v-on:input="updateValue($event.target.value)"
  />
</template>

<script>
export default {
  name: "StatInput",
  props: {
    value: null,
    max: null,
  },
  methods: {
    updateValue: function(value) {
      this.$emit("input", Number(value));
    }
  }
};
</script>

<style>
</style>