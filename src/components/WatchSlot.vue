<template>
	<div class="SHD-levels-inner">
		<span class="section-title">
			<img alt="" src="icons/shd_big.png" class="image" />
			SHD Watch Levels
		</span>
		<div class="levels">
			<div class="item" v-for="(level, idx) in levels" v-bind:key="idx">
				<span class="level-name">{{ level.name }}</span>
				<StatInput
					v-model="level.value"
					v-bind:max="level.max"
				></StatInput>
			</div>
		</div>
		<div class="levels-btn">
			<div class="item-btt">
				<button :class="buttonLvlMax" @click="maxAllLevels(true)">
					{{
						buttonLvlMax === "btt"
							? "Set All Levels to Max"
							: "All Levels are Set to Max"
					}}
				</button>
			</div>
			<div class="item-btt">
				<button :class="buttonLvlCustom" @click="customLevels()">
					{{
						buttonLvlCustom === "btt"
							? "Customize Levels"
							: "Custom Levels Set"
					}}
				</button>
			</div>
			<div class="item-btt">
				<button :class="buttonLvl0" @click="maxAllLevels(false)">
					{{
						buttonLvl0 === "btt"
							? "Set All Levels to 0"
							: "All Levels are Set to 0"
					}}
				</button>
			</div>
		</div>
	</div>
</template>

<script>
	// https://thedivision.fandom.com/wiki/SHD_Level
	import StatInput from "./StatInput";
	import coreService from "../utils/coreService";
	import { getSHDLevels, updateLocalSHDLevels } from "../utils/SHDutils";
	import { openWatchLevelsModal } from "../utils/modalService";
	export default {
		name: "WatchSlot",
		components: { StatInput },
		data() {
			return {
				levels: [],
				buttonLvlMax: "btt",
				buttonLvl0: "btt",
				buttonLvlCustom: "btt",
			};
		},
		created() {
			this.levels = getSHDLevels();
			let SHD = 0;
			this.levels.forEach((lvl) => {
				SHD += lvl.value;
			});
			if (SHD === 200) {
				this.buttonLvlMax = "btt-active";
				this.buttonLvlCustom = "btt";
			} else if (SHD === 0) {
				this.buttonLvl0 = "btt-active";
				this.buttonLvlCustom = "btt";
			} else {
				this.buttonLvlCustom = "btt-active";
			}

			coreService.updateSHDLevels(this.levels);
		},
		updated() {
			updateLocalSHDLevels(this.levels);
			coreService.updateSHDLevels(this.levels);
			// TODO Need to update the button stat after modal closes
			// let SHD = 0;
			// this.levels.forEach((lvl) => {
			// 	SHD += lvl.value;
			// });
			// if (SHD === 200) {
			// 	this.buttonLvlMax = "btt-active";
			// }
			// if (SHD === 0) {
			// 	this.buttonLvl0 = "btt-active";
			// }
		},
		methods: {
			maxAllLevels(isMax) {
				this.buttonLvlCustom = "btt";
				this.buttonLvl0 = !isMax ? "btt-active" : "btt";
				this.buttonLvlMax = isMax ? "btt-active" : "btt";
				this.levels.forEach((lvl) => {
					lvl.value = isMax ? lvl.max : 0;
				});
			},
			customLevels() {
				openWatchLevelsModal(this.sendToWatchSlot);
			},
			sendToWatchSlot(data) {
				let SHD = 0;
				data.forEach((lvl) => {
					SHD += lvl.value;
				});
				if (SHD === 200) {
					this.buttonLvlMax = "btt-active";
					this.buttonLvlCustom = "btt";
				} else {
					this.buttonLvlCustom = "btt-active";
					this.buttonLvlMax = "btt";
				}
				if (SHD === 0) {
					this.buttonLvl0 = "btt-active";
					this.buttonLvlCustom = "btt";
				} else {
					this.buttonLvlCustom = "btt-active";
					this.buttonLvl0 = "btt";
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.SHD-levels-inner {
		display: flex;
		flex-direction: column;
		.levels {
			position: absolute;
			top: -9999px;
			left: -9999px;
			visibility: hidden;
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
			gap: 8px 8px;
		}
		.levels-btn {
			display: grid;
			// grid-template-columns: repeat(minmax(190px, 1fr));
			gap: 8px 8px;
		}
		.level-name {
			flex: 3;
		}
		.item-btt {
			display: flex;
			.btt {
				z-index: 1;
				flex: 1 1 auto;
				margin: 0;
				color: white;
				border: 1px solid dimgray;
				background: transparent;
				min-height: 32px;
			}
			.btt-active {
				z-index: 1;
				flex: 1 1 auto;
				color: white;
				font-style: italic;
				border: 2px solid white;
				background: transparent;
				min-height: 32px;
			}
		}
	}
</style>
