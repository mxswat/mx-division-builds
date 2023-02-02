<template>
	<div class="toggle">
		<span class="label"> {{ label }} </span>
		<label class="switch">
			<input
				:value="value"
				v-on:change="updateValue($event.target.checked)"
				type="checkbox"
			/>
			<span class="slider"></span>
		</label>
	</div>
</template>

<script>
	export default {
		name: "Toggle",
		props: {
			value: null,
			label: null,
		},
		methods: {
			updateValue: function(value) {
				this.$emit("input", value);
			},
		},
	};
</script>

<style lang="scss" scoped>
	.toggle {
		display: flex;
		border-bottom: 1px solid white;
		padding: 8px;
		margin-right: 8px;
		flex: 1 1 auto;
	}

	.label {
		flex: 3;
	}

	$switch-h: 25px;
	$switch-w: 40px;

	.switch {
		position: relative;
		display: inline-block;
		height: $switch-h;
		width: $switch-w;

		input {
			opacity: 0;
			width: 0;
			height: 0;
		}
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		-webkit-transition: 0.4s;
		transition: 0.4s;

		&:before {
			position: absolute;
			content: "";
			height: $switch-h - 8px;
			width: $switch-h - 8px;
			left: 4px;
			bottom: 4px;
			background-color: white;
			-webkit-transition: 0.4s;
			transition: 0.4s;
		}
	}

	input {
		&:checked + .slider {
			background-color: #ff6d10;
		}

		&:focus + .slider {
			box-shadow: 0 0 1px #ff6d10;
		}

		&:checked + .slider:before {
			$translate: 16px;
			-webkit-transform: translateX($translate);
			-ms-transform: translateX($translate);
			transform: translateX($translate);
		}
	}
</style>
