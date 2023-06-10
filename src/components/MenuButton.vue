<template>
  <label
    :class="className"
    tabindex="0"
    role="checkbox"
    @keydown.space.prevent="keyToggle"
  >
    <input
      type="checkbox"
      class="menu-button-input"
      :name="name"
      :checked="value"
      :disabled="disabled"
      tabindex="-1"
      @change.stop="toggle"
    />
    <div class="menu-button-inner">
      <div class="menu-button-label-outer">
        <div class="menu-button-label">{{ label }}</div>
      </div>
      <div class="menu-button-arrow-outer">
        <div class="menu-button-arrow"></div>
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
    computed: {
      className() {
        let { toggled, disabled } = this
        return ['menu-button', {toggled, disabled}]
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

<style lang="scss" scoped>
  .menu-button {
    user-select: none;
    .menu-button-input {
      display: none;
      &:checked ~ * .menu-button-arrow {
        transform: rotate(180deg) scale(1);
      }
    }
    .menu-button-inner {
      display: flex;
      padding: 0 0 4px 0;
      border-bottom: 1px solid white;
      cursor: pointer;
      .menu-button-label-outer {
        display: flex;
        flex-basis: 100%;
        flex-grow: 1;
        flex-wrap: wrap;
        padding: 0 2px;
        position: relative;
        .menu-button-label {
          border: 1px solid transparent;
          border-left: none;
          margin: 4px 0 0 0;
          padding: 0 7px;
          flex-grow: 1;
          z-index: 1;
        }
      }
      .menu-button-arrow-outer {
        display: flex;
        align-items: center;
        padding: 4px 6px 0 2px;
      }
      .menu-button-arrow {
        height: 10px;
        width: 14px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='10' fill='white' role='presentation'%3E%3Cpath d='M9.211364 7.59931l4.48338-4.867229c.407008-.441854.407008-1.158247 0-1.60046l-.73712-.80023c-.407008-.441854-1.066904-.441854-1.474243 0L7 5.198617 2.51662.33139c-.407008-.441853-1.066904-.441853-1.474243 0l-.737121.80023c-.407008.441854-.407008 1.158248 0 1.600461l4.48338 4.867228L7 10l2.211364-2.40069z'%3E%3C/path%3E%3C/svg%3E");
        background-repeat: no-repeat;
        margin-left: auto;
        background-position: bottom;
        transform: scale(1);
        transition: transform 150ms cubic-bezier(1, -0.115, 0.975, 0.855);
      }
    }
    &.disabled {
      pointer-events: none;
      opacity: 0.6;
    }
  }
</style>
