<template>
	<div class="shd-levels-modal">
		<img src="icons/shd_big.png" class="img-levels-bg" alt="" />
		<span class="section-title">
			<img alt="" src="icons/shd_big.png" class="image" />
			SHD Watch Levels
		</span>
		<div class="overflow-handler">
			<div class="four-square-grid">
				<div
					v-for="(stat, ids) in stats"
					v-bind:key="ids"
					class="shd-flex-item"
				>
					<BasicTile classes="SHD-levels-inner">
						<div class="inner-border"></div>
						<div class="shd-level-group-title">
							<img
								:src="`icons/${stat.icon}`"
								alt=""
								class="img-shd-title"
							/>{{ stat.name }}
						</div>

						<div class="shd-level-group-grid-container">
							<div class="item" v-for="ido in 4" v-bind:key="ido">
								<span class="level-name">{{
									levels[ido + stat.index].name
								}}</span>
								<StatInput
									v-model="levels[ido + stat.index].value"
									v-bind:max="levels[ido + stat.index].max"
									:step="1"
								></StatInput>
							</div></div
					></BasicTile>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	// https://thedivision.fandom.com/wiki/SHD_Level
	import BasicTile from "../BasicTile";
	import StatInput from "../StatInput";
	import { getSHDLevels } from "../../utils/SHDutils";
	export default {
		name: "WatchLevels",
		props: ["onModalClose"],
		components: {
			BasicTile,
			StatInput,
		},
		data() {
			return {
				levels: [],
				stats: [
					{ name: "Offense", icon: "offense1.png", index: -1 },
					{ name: "Defense", icon: "defense1.png", index: 7 },
					{ name: "Utility", icon: "tech1.png", index: 11 },
					{ name: "Handling", icon: "handling1.png", index: 3 },
				],
			};
		},
		created() {
			this.levels = getSHDLevels();
		},
		beforeDestroy() {
			this.onModalClose(this.levels);
		},
	};
</script>

<style lang="scss" scoped>
	img.img-levels-bg {
		opacity: 0.1;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	img.img-shd-title {
		width: 15px;
		margin-right: 4px;
	}
	.tile {
		min-height: initial;
	}
	.shd-level-group-title {
		font-weight: 700;
		border-bottom: 1px solid white;
		margin-bottom: 16px;
	}
	.shd-levels-modal {
		height: 100%;
		width: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		background-color: #363636;
	}
	.four-square-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 8px 8px;
		grid-auto-flow: row;
		margin: 8px;
		.overflow-handler {
			max-height: 100%;
			overflow: auto;
		}
	}
	.level-name {
		min-width: 180px;
		flex: 1;
	}
	.item {
		max-width: 250px;
		display: flex;
	}
	.section-title {
		font-weight: 700;
		border-bottom: 1px solid white;
		width: 100%;
		margin-bottom: 0px;
		background: #1a1e24;
		display: flex;
		align-items: center;
		padding: 8px 8px;
		z-index: 99;
	}

	input[type="number"] {
		text-align: right;
	}
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		margin-left: 10px;
	}

	// mobile switch to one column grid
	@media only screen and (max-width: 675px) {
		.four-square-grid {
			display: grid;
			grid-template-columns: 1fr;
			grid-template-rows: 1fr;
			gap: 8px 8px;
			grid-auto-flow: row;
			margin: 8px;
		}
		.level-name {
			min-width: 180px;
			flex: 1;
		}
		.item {
			max-width: 250px;
			display: flex;
		}
	}
</style>
