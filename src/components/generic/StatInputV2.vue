<template>
	<div class="stat-input-v2">
		<span class="label">
			{{ label }}
		</span>
		<div class="input-wrapper">
			<input
				class="stat-value-v2"
				type="number"
				step="0.1"
				:max="max"
				:value="value"
				:placeholder="max"
				v-on:input="updateValue($event.target.value)"
			/>
			<span class="max-val" v-if="showMaxVal"> /{{ max }} </span>
		</div>
	</div>
</template>

<script>
	export default {
		name: "StatInputV2",
		props: {
			value: null,
			label: null,
			max: null,
			showMaxVal: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				debouceInput: null,
			};
		},
		methods: {
			updateValue: function(value) {
				clearTimeout(this.debouceInput);
				this.debouceInput = setTimeout(() => {
					this.$emit("input", Number(value));
				}, 300);
			},
		},
	};
</script>

<style lang="scss" scoped>
	.stat-input-v2 {
		display: flex;
		border-bottom: 1px solid white;
		padding: 8px;
		margin-right: 8px;
		flex: 1 1 auto;
	}
	.label {
		margin-right: 8px;
		text-transform: capitalize;
	}

	.input-wrapper {
		display: flex;
		max-width: 100px;
		margin-left: auto;
	}
	.stat-value-v2 {
		min-width: 0;
		flex: 1 1 auto;
		height: 31px;
		line-height: 31px;
		padding: 0px;
		margin-left: 8px;
		background: transparent;
		border: 0px;
		font-size: 16px;
		color: white;
		font-family: "Titillium Web", sans-serif;
		font-weight: 400;
		border-bottom: 1px solid white;
		&::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
	}
	.max-val {
		height: 31px;
		line-height: 31px;
	}
</style>
