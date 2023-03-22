<template>
	<div class="skill-stat">
		<template v-if="skillName">
			<span class="section-title utility">
				<!-- <img alt="" src="icons/tech1.png" class="image" /> -->
				{{ skillName }}
			</span>
			<div class="toggle-overcharged">
				<Toggle
					@input="updatedToggle()"
					v-model="toggleOvercharge"
					:label="'Toggle Overcharge'"
				></Toggle>
			</div>
			<span
				>Skill Tier
				<span>{{
					toggleOvercharge ? skillTierOvercharged : skillTier
				}}</span></span
			>
			<span v-for="(stat, idx) in skillStats" v-bind:key="idx"
				>{{ stat["Stat"] }}:<span
					>{{ calculateStatValue(stat) }}{{ stat["Unit"] }}</span
				></span
			>
		</template>
		<span class="skill-name-stat bold" v-if="!skillName"
			>No skill selected</span
		>
	</div>
</template>

<script>
	import statsService from "../../utils/statsService";
	import Toggle from "../generic/Toggle";

	const skillBonusMapping = {
		Cooldown: "Skill Haste",
		"Skill Haste": "Skill Haste",
		Damage: "Skill Damage",
		Duration: "Skill Duration",
		"Skill Repair": "Repair Skills",
		"Firing Interval": "Rate of Fire",
		"Blast Radius": "Blast Radius",
		"Burn Duration": "Burn Duration",
		"Shock Radius": "Shock Radius",
		Health: "Health",
		"Shield Health": "Shield Health",
		Radius: "Radius",
		"Active Regeneration": "Active Regeneration",
		"Holstered Regeneration": "Holstered Regeneration",
		"Damage Bonus (Per Enemy)": "Damage Bonus (Per Enemy)",
		"Scan Range": "Scan Range",
		Healing: "Armor Repair",
		"Armor Repair": "Armor Repair",
		Ammo: "Ammo",
		"Ensnare Duration": "Ensnare Duration",
		"Ensnare Health": "Ensnare Health",
		"Zone Duration": "Zone Duration",
		"Zone Health": "Zone Health",
	};

	const skillEfficiencyStats = [
		"Damage",
		"Cooldown",
		"Duration",
		"Health",
		// "Repair",
		// "Status Effects",
	];

	export default {
		name: "SingleSkillStats",
		props: {
			name: null,
		},
		components: {
			Toggle,
		},
		data() {
			return {
				debug: true,
				stats: null,
				skillTier: 0,
				skillTierOvercharged: null,
				skillName: null,
				skillStats: null,
				skillMods: null,
				toggleOvercharge: false,
			};
		},
		created() {
			statsService.getStats$().subscribe((stats) => {
				if (!stats) {
					return;
				}
				// console.log(`created : (${this.name})`, stats);
				// this.stats = stats;
				// console.log(
				// 	`stats.Skills[this.name]: (${this.name})`,
				// 	stats.Skills[this.name]
				// );
				this.stats = stats;
				this.updateStatsUI(stats);
			});
		},
		methods: {
			updateStatsUI(stats) {
				const props = ["skillName"];

				for (let i = 0; i < props.length; i++) {
					const prop = props[i];
					this[prop] = stats.Skills[this.name][prop];
				}

				// Skill Tier
				this.skillTier = stats.Utility["Skill Tier"];
				// this.skillStats = stats.stats;
				// console.log(stats);
				if (
					Object.hasOwnProperty.call(
						stats.Skills[this.name],
						"skillDetails"
					)
				) {
					// console.log(stats.skillDetails.stats);

					this.skillStats = stats.Skills[
						this.name
					].skillDetails.stats.filter((stat) => {
						return stat.Stat !== "(Blank)";
					});
				}
			},
			calculateStatValue(stat) {
				if (this.debug) {
					console.groupCollapsed(
						`%cSTART calculateStatValue (${stat["Stat"]}):`,
						`background: #222; color: #bada55`
					);
					console.warn(`(stat) :`, stat);
				}
				if (stat["Stat"] === "(Blank)") {
					if (this.debug) console.log("Blank");
					return;
				}
				let value = this.valueCleanup(stat["Tier 0"]);
				const valueType = this.valueType(stat["Tier 0"]); // floatThousands, floatPoint, wholeThousands, percent, other
				const tier0Value = value;
				const sStat = stat["Stat"]; // name displayed in the table
				const sBonus = stat["Bonus"]; // Bonus name to actually modify
				const valueUnit = stat["Unit"]; // m, HP, s, HP/s, blank = whole number
				const bonusType = stat["Bonus Type"].toLowerCase(); // add, subtract, actual, cumulative
				const bonusTypeModifier = this.getBonusTypeModifier(bonusType); // add, subtract, actual, cumulative
				const currentTierModifier = this.toggleOvercharge
					? "Overcharge"
					: `Tier ${this.skillTier}`;
				const currentTierModifierValue = this.valueCleanup(
					stat[currentTierModifier]
				);
				console.log(
					`this.stats.Utility[skillBonusMapping[${sStat}]]:`,
					this.stats.Utility[skillBonusMapping[sStat]]
				);
				const gearBonus =
					Object.hasOwnProperty.call(skillBonusMapping, sStat) &&
					this.stats.Utility[skillBonusMapping[sStat]]
						? parseFloat(
								this.stats.Utility[skillBonusMapping[sStat]]
								// eslint-disable-next-line no-mixed-spaces-and-tabs
						  )
						: 0;
				const applySkillEfficiency = skillEfficiencyStats.find(
					(s) => s === sBonus
				)
					? true
					: false;
				const skillEfficiency = Object.hasOwnProperty.call(
					this.stats.Utility,
					"Skill Efficiency"
				)
					? parseInt(this.stats.Utility["Skill Efficiency"])
					: 0;
				// TODO add mods
				/**
				 * Need to add Mods stats here as each skill cannot use the Gear etc. stats
				 */
				const skillMods = this.getSkillMods(sStat); // sStat stat
				if (this.debug)
					console.log(
						"%cskillMods: ",
						`background: #222; color: #00ffff`,
						skillMods
					);
				/**
				 * Build Props
				 */
				const statProps = {
					valueType: valueType,
					valueUnit: valueUnit,
					tier0Value: tier0Value,
					sStat: sStat,
					sBonus: sBonus,
					bonusType: bonusType, // add, subtract, actual, cumulative
					bonusTypeModifier: bonusTypeModifier,
					currentTierModifier: currentTierModifier,
					currentTierModifierValue: currentTierModifierValue,
					gearBonus: gearBonus,
					skillMods: skillMods,
					applySkillEfficiency: applySkillEfficiency,
					skillEfficiency: skillEfficiency,
				};
				if (this.debug)
					console.log(
						`%ccalculating StatValue (${sStat}): statProps: `,
						`background: #222; color: #00ffff`,
						statProps
					);

				// TODO Cumulative Additive per Tier ????
				// TODO Actual for Actual Values in the column

				// TODO Traps / Ammo / Charges
				/**
				 * Need to know if these are add, cumulative or Actual
				 */

				// TODO Damage Bonus Per Enemy
				/**
				 * Not really sure - 1% of 5% ?
				 */

				// TODO add Skill Efficiency
				/**
				 * x%
				 * Skill Damage, Skill Haste, Skill Duration, Skill Health, Repair Skills, Status Effects
				 */

				// TODO Gear Attributes not being added Damage for example

				// calculate Overcharged values then stop
				if (this.toggleOvercharge || this.skillTier > 0) {
					if (this.debug) console.log(`// OVERCHARGED ${sStat}`);
					const overchargedValue = this.calculateStat(
						value,
						statProps,
						stat
					);
					if (this.debug) {
						console.log(`overchargedValue:`, overchargedValue);
						console.groupEnd();
					}
					return this.formatValue(overchargedValue);
				}

				if (this.skillTier === 0) {
					// Skill Tier 0 - Nothing to check just add spec/watch/gear/mods stats
					if (this.debug)
						console.log(
							`// Skill Tier 0 - Nothing to check just add spec/watch/gear/mods stats`
						);
					let modsValue = 0;
					if (this.debug)
						console.log(
							`skillBonusMapping[${sBonus}]:`,
							skillBonusMapping[sBonus],
							`skillMods:`,
							skillMods
						);
					for (let i = 0; i < skillMods.length; i++) {
						const element = skillMods[i];
						if (this.debug) console.log(`element:`, element);
						if (
							// !skillBonusMapping[sBonus] &&
							Object.hasOwnProperty.call(
								element,
								skillBonusMapping[sBonus]
							)
						) {
							if (this.debug)
								console.log(
									"ADDING:",
									element[skillBonusMapping[sBonus]]
								);
							modsValue += parseFloat(
								element[skillBonusMapping[sBonus]]
							);
						}
						// for those times when there is no bonus mapping
						if (sBonus === "Damage" || sBonus === "Duration") {
							if (this.debug) console.log(sBonus);
							modsValue += element[sBonus]
								? parseFloat(element[sBonus])
								: 0;
						}
					}
					// console.log("ADDING:", sStat, modsValue);
					const gearBonusPercent = gearBonus
						? Number(gearBonus / 100)
						: 0;
					// TODO check if it's a percent or whole number (i.e. Ammo)
					const modBonusPercent =
						valueUnit === ""
							? Number(modsValue)
							: Number(modsValue / 100);
					const skillEfficiencyPercent = applySkillEfficiency
						? Number(skillEfficiency / 100)
						: 0;
					const totalBonusPercent =
						gearBonusPercent +
						skillEfficiencyPercent +
						modBonusPercent;
					// console.log(bonusType);
					// console.log(bonusTypeModifier);
					// add from spec/watch/gear
					value =
						tier0Value +
						bonusTypeModifier * (tier0Value * totalBonusPercent);
					if (this.debug)
						console.log(
							`totalBonusPercent (${totalBonusPercent}) = gearBonusPercent (${gearBonusPercent}) + skillEfficiencyPercent (${skillEfficiencyPercent} + modBonusPercent (${modBonusPercent}))`
						);
					if (this.debug) {
						console.log(
							`tier0Value (${tier0Value}) + bonusTypeModifier (${bonusTypeModifier}) * (tier0Value (${tier0Value}) * totalBonusPercent (${totalBonusPercent})) =`,
							`this.formatValue(value):`,
							this.formatValue(value)
						);
						console.groupEnd();
					}
					return this.formatValue(value);
				}
			},
			calculateStat(value, props, stat) {
				const debugFormat = "background: #222; color: #ae09c7";
				const debugStat = "Charges1";
				if (this.debug)
					console.groupCollapsed(
						`%cfunction calculateStat (${props.sStat}):`,
						debugFormat
					);
				// console.log(
				// 		`%c>> function calculateStat (${props.sStat}):`,
				// 		debugFormat
				// 	);
				if (stat[props.currentTierModifier]) {
					// TODO even though no tier modifier, still need to calculate Skill Efficiency
					if (this.debug)
						console.log(
							`%c>>>Skill Efficiency (${props.sStat}):`,
							debugFormat
						);
					const gearBonusPercent = Number(props.gearBonus / 100);
					if (this.debug)
						console.log(
							`%c>>>gearBonusPercent (${gearBonusPercent}):`,
							debugFormat,
							`gearBonusPercent (${gearBonusPercent}) = Number(props.gearBonus (${props.gearBonus}) / 100)`
						);
					const skillEfficiencyPercent = props.applySkillEfficiency
						? Number(props.skillEfficiency / 100)
						: 0;
					if (this.debug)
						console.log(
							`%c>>>skillEfficiencyPercent (${skillEfficiencyPercent}):`,
							debugFormat
						);
					const totalGearBonusPercent =
						gearBonusPercent + skillEfficiencyPercent;
					if (this.debug)
						console.log(
							`%c>>>totalGearBonusPercent (${totalGearBonusPercent}):`,
							debugFormat
						);
					switch (props.sStat) {
						case debugStat:
							console.log("value:", value);
							console.log("gearBonus", props.gearBonus);
							console.log("valueType:", props.valueType);
							console.log("tier0Value:", props.tier0Value);
							console.log("gearBonusPercent:", gearBonusPercent);
							console.log(
								"skillEfficiencyPercent:",
								skillEfficiencyPercent
							);
							console.log(
								"totalGearBonusPercent:",
								totalGearBonusPercent
							);
							console.log(
								"currentTierModifier:",
								props.currentTierModifier
							);
							console.log(
								"currentTierModifierValue:",
								props.currentTierModifierValue
							);
							console.log(
								"stat[currentTierModifier]:",
								stat[props.currentTierModifier]
							);
							console.log("bonusType:", props.bonusType);
							console.log(
								"bonusTypeModifier",
								props.bonusTypeModifier
							);
							console.log("sStat:", props.sStat);
							console.log("sBonus:", props.sBonus);
							console.log(
								"skillBonusMapping[sStat]:",
								skillBonusMapping[props.sStat]
							);
							console.log(
								`CALCULATION: ${value +
									props.currentTierModifierValue} = ${value} + ${
									props.currentTierModifierValue
								}`
							);
							console.log("this.stats:", this.stats);
							// add from spec/watch/gear
							// value =
							// 	props.tier0Value +
							// 	props.bonusTypeModifier *
							// 		(props.tier0Value * totalGearBonusPercent);
							// add Tier modifier
							value = value + props.currentTierModifierValue;
							break;
						case "Ammo":
						case "Charges":
						case "Traps":
							// case "Damage Bonus (Per Enemy)":
							// add Tier modifier
							value = value + props.currentTierModifierValue;
							break;
						default:
							// add from spec/watch/gear
							value =
								props.tier0Value +
								props.bonusTypeModifier *
									(props.tier0Value * totalGearBonusPercent);
							// add Tier modifier
							value =
								value +
								props.bonusTypeModifier *
									(value * props.currentTierModifierValue);
							break;
					}
					// return this.formatValue(value);
					if (this.debug) {
						console.log(
							`%ccalculateStat (${props.sStat}): ${value}`,
							debugFormat
						);
						console.groupEnd();
					}
					return value;
				} else {
					if (this.debug) {
						console.log(
							`%ccalculateStat (${props.sStat}): No Tier Modifier`,
							debugFormat
						);
						console.groupEnd();
					}
					return props.tier0Value;
				}
			},
			getSkillMods(stat) {
				// this.skillStats (the stats an actual skill has shown in the table)
				// this.stats (is what has the mods)
				// this.stats.Skills.Skill1.skillDetails.modOne (each mod)
				// if (this.debug) console.log(this.name, this.stats, stat);
				const skillMods = [];
				const mods = [
					{
						prop: "modOne",
						propStatVal: "StatValueModOne",
						propVal: "StatValueModOne",
						propMax: "Mod One",
					},
					{
						prop: "modTwo",
						propStatVal: "StatValueModTwo",
						propVal: "StatValueModTwo",
						propMax: "Mod Two",
					},
					{
						prop: "modThree",
						propStatVal: "StatValueModThree",
						propVal: "StatValueModThree",
						propMax: "Mod Three",
					},
				];
				const skillDetails = this.stats.Skills[this.name].skillDetails;
				if (this.debug) console.log(this.name, skillDetails, stat);
				// loop through each Mod
				mods.forEach((mod) => {
					if (skillDetails[mod.prop]) {
						// console.log(`MOD FOUND: `, mod.prop);
						// const stat = stat;
						const val = skillDetails[mod.prop][mod.propStatVal]
							? skillDetails[mod.prop][mod.propStatVal]
							: parseFloat(
									skillDetails[mod.prop][
										mod.propMax
									].replaceAll("%", "")
									// eslint-disable-next-line no-mixed-spaces-and-tabs
							  ); // [mod.propStatVal] [mod.propMax]
						// skillMods.stat = stat;
						// skillMods.val = val;
						skillMods.push({
							[skillDetails[mod.prop]["Mod Bonus"]]: val,
						});
					}
					// if (skill[mod.prop]) {
					// 	// console.log(skill[mod.prop]);
					// 	// console.log(skillStats);
					// 	// console.log(skill[`modOne`][`Mod Bonus`]);
					// 	const statToUpdate = skill[mod.prop][`Mod Bonus`];
					// 	// clean up max value
					// 	const statMax = parseFloat(
					// 		skill[mod.prop][mod.propMax].replace("%", "")
					// 	);
					// 	const statValue = skill[mod.prop][mod.propVal]
					// 		? skill[mod.prop][mod.propVal]
					// 		: statMax;
					// 	// console.log(skillStats, statToUpdate, statValue);
					// }
				});
				return skillMods;
			},
			// addSkillStats(skill, skillStats) {
			// 	const mods = [
			// 		{
			// 			prop: "modOne",
			// 			propVal: "StatValueModOne",
			// 			propMax: "Mod One",
			// 		},
			// 		{
			// 			prop: "modTwo",
			// 			propVal: "StatValueModTwo",
			// 			propMax: "Mod Two",
			// 		},
			// 		{
			// 			prop: "modThree",
			// 			propVal: "StatValueModThree",
			// 			propMax: "Mod Three",
			// 		},
			// 	];
			// 	// addValueToStat(skillStats, "Skill Damage", 10);
			// 	// console.log(skill, skillStats);
			// 	// loop through each Mod
			// 	mods.forEach((mod) => {
			// 		if (skill[mod.prop]) {
			// 			// console.log(skill[mod.prop]);
			// 			// console.log(skillStats);
			// 			// console.log(skill[`modOne`][`Mod Bonus`]);
			// 			const statToUpdate = skill[mod.prop][`Mod Bonus`];
			// 			// clean up max value
			// 			const statMax = parseFloat(
			// 				skill[mod.prop][mod.propMax].replace("%", "")
			// 			);
			// 			const statValue = skill[mod.prop][mod.propVal]
			// 				? skill[mod.prop][mod.propVal]
			// 				: statMax;
			// 			// console.log(skillStats, statToUpdate, statValue);
			// 			addValueToStat(skillStats, statToUpdate, statValue);
			// 		}
			// 	});
			// 	// console.log(skillStats);
			// 	return skillStats;
			// },
			getBonusTypeModifier(type) {
				let modifier = 1;
				switch (type) {
					case "subtract":
						modifier = -1;
						return Number(modifier);
				}
				return Number(modifier);
			},
			valueType(value) {
				if (value.includes(".") && value.includes(",")) {
					// console.log("floating thousands", value);
					return "floatThousands";
				} else if (value.includes(".")) {
					// console.log("float", value);
					return "floatPoint";
				} else if (value.includes(",")) {
					// console.log("whole thousands", value);
					return "wholeThousands";
				} else if (value.includes("%")) {
					// console.log("percent", value);
					return "percent";
				} else {
					// console.log("OTHER", value);
					return "other";
				}
			},
			valueCleanup(value) {
				if (!value) return;
				value = value.trim();
				if (value.includes("%") && value.includes(".")) {
					if (this.debug)
						console.log("Cleaning: float percent", value);
					return parseFloat(value.replaceAll("%", "")) / 100;
				}
				if (value.includes("%")) {
					if (this.debug) console.log("Cleaning: percent", value);
					value = value.replace("%", "");
					if (this.debug) console.log("Clean: percent", value);
					return parseInt(value) / 100;
				}
				if (value.includes(".") && value.includes(",")) {
					if (this.debug)
						console.log("Cleaning: floating thousands", value);
				}
				if (value.includes(".")) {
					if (this.debug) console.log("Cleaning: float", value);
					return parseFloat(value.replaceAll(",", ""));
				}
				if (value.includes(",")) {
					if (this.debug)
						console.log("Cleaning: whole thousands", value);
					return parseInt(value.replaceAll(",", ""));
				}
				if (this.debug)
					console.log("Cleaning: other", typeof value, value);
				return parseInt(value);
			},
			formatValue(value, format = "") {
				value = Number(Number(value).toFixed(1)).toLocaleString();
				// console.log(typeof value, value);
				return value;
			},
			roundValue(number) {
				return Number(Number(number).toFixed(2)).toLocaleString();
			},
			updatedToggle() {
				!this.toggleOvercharge;
				this.skillTierOvercharged = this.toggleOvercharge
					? "Overcharged"
					: "";
				this.updateStatsUI(this.stats);
			},
		},
		watch: {
			skillName: {
				handler: function(val, oldVal) {
					// console.log(`watching (${this.skillName}): `, val, oldVal);
					// this.toggleOvercharge = false;
				},
			},
		},
	};
</script>

<style lang="scss" scoped>
	.stats-list-3-col {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		div {
			display: flex;
			flex-shrink: 1;
			flex-grow: 0;
			flex-basis: calc(33% - 8px);
			min-width: 180px;
			margin-right: 8px;
			border-bottom: 1px solid white;
			padding: 4px 0px;
		}

		span {
			margin-left: auto;
			text-align: left;
			min-width: 30px;
		}
	}
	.skill-stat {
		color: white;
		display: flex;
		flex-direction: column;
		> span {
			border-bottom: 1px solid white;
			padding: 8px;
			> span {
				float: right;
			}
		}
	}

	span.skill-name-stat.bold {
		position: -webkit-sticky;
		position: sticky;
		top: 0;
		background: #1a1e24;
		z-index: 1;
	}

	.toggle-overcharged {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		position: sticky;
		top: 41px;
		background: #1a1e24;
	}
</style>
