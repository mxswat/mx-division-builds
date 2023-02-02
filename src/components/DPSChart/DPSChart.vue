<template>
	<div>
		<span class="section-title"> Damage over Time - Visualisation </span>
		<div class="toolbar">
			<Toggle
				@input="updatedColorBlind()"
				v-model="isColorblind"
				:label="'Color blind?'"
			></Toggle>
			<StatInputV2
				:label="'Critical chance'"
				v-model="criticalChance"
				v-bind:max="100"
				:showMaxVal="true"
				@input="applyCHCandHSDtoTheCoreTraces()"
			></StatInputV2>
			<StatInputV2
				:label="'Headshot Chance'"
				v-model="headshotChance"
				v-bind:max="100"
				:showMaxVal="true"
				@input="applyCHCandHSDtoTheCoreTraces()"
			></StatInputV2>
			<div class="spacer"></div>
		</div>
		<div id="dps-chart"></div>
		<span> Click on the trace on the legend to hide or show it! </span>
	</div>
</template>

<script>
	import Plotly from "plotly.js-dist";
	import DPSChartCore from "../../utils/DPSChartCore";
	import {
		getPlotlyDefault1,
		getPlotlyDefault2,
	} from "../../utils/plotDefaults";
	import Toggle from "../generic/Toggle";
	import StatInputV2 from "../generic/StatInputV2";

	const dashStyles = ["solid", "dashdot", "dot"];
	const colors = ["#E69F00", "#56B4E9", "#009E73"];

	const DEFAULT_PLOT = getPlotlyDefault1(
		"Damage",
		"Seconds - Flat lines are the reload time"
	);
	const DEFAULT_PLOT_2 = getPlotlyDefault2();

	export default {
		name: "DPSChart",
		components: { Toggle, StatInputV2 },
		data() {
			return {
				target: null,
				isColorblind: false,
				cacheCoreTraces: [],
				cacheExtraTraces: [],
				criticalChance: 0,
				headshotChance: 0,
			};
		},
		created() {
			DPSChartCore.subscribeToCoreWeaponsTrace().subscribe((weapons) => {
				this.cacheCoreTraces = weapons;
				this.updateChart(weapons);
				if (this.isCHCandHSDSet()) {
					this.applyCHCandHSDtoTheCoreTraces();
				}
			});
		},
		mounted() {
			this.target = document.getElementById("dps-chart");
			Plotly.newPlot(this.target, [], DEFAULT_PLOT, DEFAULT_PLOT_2);
		},
		methods: {
			updateChart(weapons) {
				const weaponTraces = [];
				for (let i = 0; i < weapons.length; i++) {
					const weapon = weapons[i];
					if (weapon) {
						weapon.line = {
							dash: this.isColorblind ? dashStyles[i] : undefined,
							color: colors[i],
						};
						weaponTraces.push(weapon);
					}
				}

				Plotly.react(
					this.target,
					weaponTraces,
					DEFAULT_PLOT,
					DEFAULT_PLOT_2
				);
			},
			updatedColorBlind() {
				this.updateChart(this.cacheCoreTraces);
			},
			applyCHCandHSDtoTheCoreTraces() {
				DPSChartCore.applyCHCandHSDtoTheCoreTraces(
					this.criticalChance,
					this.headshotChance
				);
			},
			isCHCandHSDSet() {
				return this.criticalChance !== 0 || this.headshotChance !== 0;
			},
		},
	};
</script>

<style lang="scss">
	div#dps-chart {
		min-height: 600px;
	}

	.toolbar {
		display: flex;
		flex-wrap: wrap;
	}

	.spacer {
		flex: 50;
	}
	@media only screen and (max-width: 614px) {
		.toolbar .stat-input-v2 {
			flex: 1 1 100%;
		}
	}
</style>
