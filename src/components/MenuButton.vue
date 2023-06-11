<template>
  <label
    class="v-select"
    :class="stateClasses"
    style="user-select: none;"
    tabindex="0"
    role="checkbox"
    @keydown.space.prevent="keyToggle"
  >
    <input
      type="checkbox"
      style="display: none; visibility: hidden;"
      :name="name"
      :checked="value"
      :disabled="disabled"
      tabindex="-1"
      @change.stop="toggle"
    />
    <div class="vs__dropdown-toggle">
      <div class="vs__selected-options">
        <div class="vs__search">{{ label }}</div>
      </div>
      <div class="vs__actions">
        <v-select-open-indicator role="presentation" class="vs__open-indicator"></v-select-open-indicator>
      </div>
    </div>
  </label>
</template>

<script>
  export default {
    name: 'MenuButton',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      name: {
        type: String
      },
      disabled: {
        type: Boolean,
        default: false
      },
      tag: {
        type: String
      },
      sync: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
      },
    },
    computed: { // vs--open
      stateClasses() {
        return {
          'vs--open': this.toggled,
          'vs--disabled': this.disabled
        }
      },
    },
    watch: {
      value(value) {
        if (this.sync) {
          this.toggled = !!value
        }
      }
    },
    data() {
      return {
        toggled: !!this.value
      }
    },
    methods: {
      keyToggle(event) {
        if (this.disabled) {
          return
        }
        this.toggle(event)
      },
      toggle(event) {
        const toggled = !this.toggled
        if (!this.sync) {
          this.toggled = toggled
        }
        this.$emit('input', toggled)
        this.$emit('change', {
          value: toggled,
          tag: this.tag,
          srcEvent: event
        })
      }
    }
  }
</script>

<style>
</style>
