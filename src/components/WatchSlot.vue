<template>
	<div class="SHD-levels-inner">
		<span class="section-title">
			<img alt="" src="icons/shd_big.png" class="image" />
			SHD Watch Levels
		</span>
		<div class="levels-btn">
			<div class="item-btt">
				<button
					:class="levelsTotal === 200 ? 'btt-active' : 'btt'"
					@click="maxAllLevels(true)"
				>
					{{
						levelsTotal === 200
							? "All Levels are Set to Max"
							: "Set All Levels to Max"
					}}
				</button>
			</div>
			<div class="item-btt">
				<button
					:class="levelsTotal % 200 ? 'btt-active' : 'btt'"
					@click="customLevels()"
				>
					{{
						levelsTotal % 200
							? "Custom Levels Set"
							: "Customize Levels"
					}}
				</button>
			</div>
			<div class="item-btt">
				<button
					:class="levelsTotal === 0 ? 'btt-active' : 'btt'"
					@click="maxAllLevels(false)"
				>
					{{
						levelsTotal === 0
							? "All Levels are Set to 0"
							: "Set All Levels to 0"
					}}
				</button>
			</div>
		</div>
		<!-- {{ "DEBUG - Total SHD percent: " + levelsTotal }} -->
	</div>
</template>

<script>
	// https://thedivision.fandom.com/wiki/SHD_Level
	import coreService from "../utils/coreService";
	import { getSHDLevels, updateLocalSHDLevels } from "../utils/SHDutils";
	import { openWatchLevelsModal } from "../utils/modalService";
	export default {
		name: "WatchSlot",
		data() {
			return {
				levels: [],
			};
		},
		computed: {
			levelsTotal: function() {
				let total = 0;
				this.levels.forEach((lvl) => {
					total += lvl.value;
				});
				return total;
			},
		},
		created() {
			this.levels = getSHDLevels();
			coreService.updateSHDLevels(this.levels);
		},
		methods: {
			maxAllLevels(isMax) {
				this.levels.forEach((lvl) => {
					lvl.value = isMax ? lvl.max : 0;
				});
				updateLocalSHDLevels(this.levels);
				coreService.updateSHDLevels(this.levels);
			},
			customLevels() {
				openWatchLevelsModal(this.onModalClose);
			},
			onModalClose(data) {
				updateLocalSHDLevels(data);
				coreService.updateSHDLevels(data);
				this.levels = getSHDLevels();
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
