<template>
	<div class="SHD-levels-inner">
		<span class="section-title">
			<img alt="" :src="`./icons/shd_big.png`" class="image" />
			SHD Levels
		</span>
		<div class="levels">
			<div class="item" v-for="(level, idx) in levels" v-bind:key="idx">
				<span class="level-name">{{ level.name }}</span>
				<StatInput
					v-model="level.value"
					v-bind:max="level.max"
				></StatInput>
			</div>
			<div class="item">
				<button class="btt" @click="setAllSHDLevels(true)">
					Set Max SHD
				</button>
			</div>
			<div class="item">
				<button class="btt" @click="setAllSHDLevels(false)">
					Set 0 SHD
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
	export default {
		name: "SHDLevels",
		components: { StatInput },
		data() {
			return {
				levels: [],
			};
		},
		created() {
			this.levels = getSHDLevels();
			coreService.updateSHDLevels(this.levels);
		},
		updated() {
			updateLocalSHDLevels(this.levels);
			coreService.updateSHDLevels(this.levels);
		},
		methods: {
			setAllSHDLevels(isMax) {
				this.levels.forEach((lvl) => {
					lvl.value = isMax ? lvl.max : 0;
				});
			},
		},
	};
</script>

<style lang="scss">
	.SHD-levels-inner {
		display: flex;
		flex-direction: column;
		.levels {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
			gap: 8px 8px;
		}
		.level-name {
			flex: 3;
		}
		.item {
			display: flex;
			.btt {
				flex: 1 1 auto;
				margin: 0;
			}
		}
	}
</style>
