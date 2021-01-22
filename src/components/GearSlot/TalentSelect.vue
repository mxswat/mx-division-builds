<template>
  <v-select
    :placeholder="placeholderText"
    :clearable="false"
    label="Talent"
    :value="value"
    :options="talentList"
    :class="value ? 'tool' : ''"
    :data-tip="value && value.Desc"
    :filter="filter"
    @option:selected="updateCurrentTalent"
    @search:focus="onSearchFocus(true)"
    @search:blur="onSearchFocus(false)"
  >
    <template #search="{ attributes, events }">
      <input class="vs__search" v-bind="attributes" v-on="events" />
    </template>
    <template v-slot:option="option">
      <div class="talent-info-container">
        <span class="talent-label">{{ option.Talent }}</span>
        <span class="talent-desc">{{ option.Desc }}</span>
      </div>
    </template>
    <template #selected-option="option">
      <div class="talent-info-container label-selected">
        <span class="talent-label">{{ option.Talent }}</span>
      </div>
    </template>
  </v-select>
</template>

<script>
export default {
  name: "GearSlot",
  props: {
    /** CurrentTalent */
    value: undefined,
    talentList: undefined,
    placeholder: undefined,
  },
  data() {
    return {
        placeholderText: ''
    };
  },
  created() {
      this.placeholderText = this.placeholder;
  },
  methods: {
    updateCurrentTalent(talent) {
      this.$emit("input", talent);
    },
    onSearchFocus(isOnFocus) {
      this.placeholderText = isOnFocus ? `Search ${this.placeholder.toLowerCase()} name or desc...` : this.placeholder;
    },
    filter(options, search) {
        const lowercaseAndMerge = function lowercaseAndMerge(option) {
            return `${option.Talent} ${option.Desc})`.toLowerCase();
        } 
        return options.filter(option => lowercaseAndMerge(option).includes(search.toLowerCase()) );
    }
  },
};
</script>

<style>
</style>