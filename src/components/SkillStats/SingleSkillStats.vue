<template>
	<div class="skill-stat">
		<template v-if="skillName">
			<span class="section-title utility">
				{{ skillName }}
			</span>
			<div class="toggle-overcharged">
				<Toggle
					@input="updatedToggle('Overcharge')"
					v-model="toggleOvercharge"
					:label="'Toggle Overcharge'"
				></Toggle>
			</div>
			<div class="toggle-dttoc">
				<Toggle
					@input="updatedToggle('DTTOC')"
					v-model="toggleDTTOC"
					:label="'Toggle DtTOC'"
				></Toggle>
			</div>
			<div class="toggle-armor">
				<Toggle
					@input="updatedToggle('DTA')"
					v-model="toggleDTA"
					:label="toggleDTA ? 'Damage to Armor' : 'Damage to Health'"
				></Toggle>
			</div>
			<span
				>Skill Tier
				<span>{{
					toggleOvercharge ? skillTierOvercharged : skillTier
				}}</span></span
			>
			<span v-for="(stat, idx) in skillStatsList" v-bind:key="idx">
				{{ stat["Stat"] }}:<span
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
				debug: false,
				stats: null,
				skillTier: 0,
				skillTierOvercharged: null,
				skillName: null,
				skillStatsList: null,
				skillStats: null,
				skillMods: null,
				toggleOvercharge: false,
				toggleDTTOC: false,
				toggleDTA: false,
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
				// const props = ["skillName"];

				// for (let i = 0; i < props.length; i++) {
				// 	const prop = props[i];
				this["skillName"] = stats.Skills[this.name].skillName;
				// }

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
					this.skillStatsList = this.getUniqueSkillStats(stats);
					// console.log(this.skillStats);
				}
			},
			getUniqueSkillStats(stats) {
				// TODO need to check to ensure the correct stat is being used, perhaps use ID  or only use this to create the list of stats
				// console.log(stats.Skills[this.name].skillDetails.stats);
				const array = stats.Skills[this.name].skillDetails.stats;
				let uniqueObjArray = [
					...new Map(
						array.map((item) => [item["Stat"], item])
					).values(),
				];
				// console.log(uniqueObjArray);
				const unique = [...new Set(array.map((item) => item.Stat))];
				// console.log(unique);
				return uniqueObjArray.filter((stat) => {
					return stat.Bonus !== "" && stat.Stat !== "(Blank)";
				});
			},
			calculateStatValue(stat) {
				if (this.debug) {
					console.groupCollapsed(
						`%cSTART ${this.name} - ${stat.Variant} (${stat["Bonus"]}):`,
						`background: #222; color: #bada55`
					);
					console.warn(`(stats) :`, this.stats);
					console.warn(`(stat) :`, stat);
				}
				if (stat["Stat"] === "(Blank)") {
					if (this.debug) console.log("Blank");
					return;
				}

				let value = this.valueCleanup(stat["Tier 0"]); // eventual calculated value

				// // get shared values
				// // skillEfficiency
				// const skillEfficiencyBonus = this.stats.Utility[
				// 	"Skill Efficiency"
				// ]
				// 	? (this.stats.Utility["Skill Efficiency"] +
				// 			Number.EPSILON) /
				// 	  100
				// 	: 0;
				// if (this.debug)
				// 	console.log(
				// 		`skillEfficiencyBonus: ${skillEfficiencyBonus}`
				// 	);
				// // skillTier
				// const skillTierBonus =
				// 	this.toggleOvercharge && stat[`Overcharge`]
				// 		? Number(
				// 				(parseFloat(stat[`Overcharge`]) +
				// 					Number.EPSILON) /
				// 					100
				// 		  )
				// 		: this.skillTier === 0
				// 		? 0
				// 		: stat[`Tier ${this.skillTier}`]
				// 		? Number(
				// 				(parseFloat(stat[`Tier ${this.skillTier}`]) +
				// 					Number.EPSILON) /
				// 					100
				// 		  )
				// 		: 0; // skill tier bonus
				// if (this.debug)
				// 	console.log(`skillTierBonus: ${skillTierBonus}`);
				// // modBonus
				// const sumModsBonus = this.getSkillModsBonus(stat["Mod Bonus"]);
				// if (this.debug) console.log(`sumModsBonus: ${sumModsBonus}`);

				/**
				 * Starting New
				 */
				// TODO Get expertise stat to calculate from Expertise Column for all OTHER stats
				switch (stat["Bonus"]) {
					case "Skill Damage":
						value = this.calcDamage(stat);
						break;
					case "Skill Haste":
						value = this.calculateCooldown(stat);
						break;
					case "Skill Duration":
						value = this.calculateDuration(stat);
						break;
					case "Ammo":
						value = this.calculateAmmo(stat);
						break;
					default:
						value = this.calculateStat(stat);
						break;
				}

				// // TODO Cumulative Additive per Tier ????
				// // TODO Actual for Actual Values in the column
				// // TODO Traps / Ammo / Charges
				// /**
				//  * Need to know if these are add, cumulative or Actual
				//  */
				// // TODO Damage Bonus Per Enemy
				// /**
				//  * Not really sure - 1% of 5% ?
				//  */
				// // TODO add Skill Efficiency
				// /**
				//  *
				//  * Skill Damage, Skill Haste, Skill Duration, Skill Health, Repair Skills, Status Effects
				//  */
				// // TODO Gear Attributes not being added Damage for example
				console.groupEnd();
				return this.formatValue(value);
			},
			/**
			 * Calculate Damage
			 * @param {object} stat
			 */
			calcDamage(stat) {
				if (this.debug) {
					console.log("Calculating Damage");
					console.log(stat["Bonus"]);
					console.log(this.getSkillModsBonus(stat["Mod Bonus"]));
				}
				// Damage Done
				// skill damage
				// console.log(this.stats);
				// console.log(`CHECKING (stat):`, stat);
				const baseSkillDamage = this.valueCleanup(stat["Tier 0"]);
				const skillEfficiency = this.stats.Utility["Skill Efficiency"]
					? (this.stats.Utility["Skill Efficiency"] +
							Number.EPSILON) /
					  100
					: 0;
				const sumSkillDamage = this.stats.Utility[stat.Bonus]
					? (this.stats.Utility[stat.Bonus] + Number.EPSILON) / 100
					: 0; // Watch, Tech Perk, Sum of Gear, Sum of Brand Bonus
				const skillTierBonus = this.toggleOvercharge
					? Number(
							(parseFloat(stat[`Overcharge`]) + Number.EPSILON) /
								100
					  )
					: this.skillTier === 0
					? 0
					: Number(
							(parseFloat(stat[`Tier ${this.skillTier}`]) +
								Number.EPSILON) /
								100
					  ); // skill tier bonus
				const skillExpertise =
					Object.hasOwnProperty.call(
						this.stats.Skills[this.name].skillDetails.expertise,
						"StatValueExpertise"
					) && stat["Expertise Bonus"] === stat["Bonus"]
						? (this.stats.Skills[this.name].skillDetails.expertise
								.StatValueExpertise +
								Number.EPSILON) /
						  100
						: (this.stats.Skills[this.name].skillDetails.expertise
								.max +
								Number.EPSILON) /
						  100;
				const totalSkillDamage = 0 / 100; // talents
				const amps = 0 / 100; // amps multiplied against the result
				const dta =
					this.stats.Offensive["Damage to Armor"] && this.toggleDTA
						? (this.stats.Offensive["Damage to Armor"] +
								Number.EPSILON) /
						  100
						: 0; // 0 / 100;
				const dttoc =
					this.stats.Offensive["Damage to TOC"] && this.toggleDTTOC
						? (this.stats.Offensive["Damage to TOC"] +
								Number.EPSILON) /
						  100
						: 0; // 0 / 100;

				const statusEffects = 0 / 100;

				// TODO
				const modBonus = this.getSkillModsBonus(stat["Mod Bonus"]);

				const calc =
					Math.floor(
						baseSkillDamage * (1 + sumSkillDamage + skillEfficiency)
					) *
					(1 + skillTierBonus + modBonus + skillExpertise) *
					(1 + totalSkillDamage) *
					(1 + amps) *
					(1 + dta) *
					(1 + dttoc);
				// (1 + statusEffects) *
				if (this.debug)
					console.log(
						`${baseSkillDamage} *\n`,
						`(1 + ${sumSkillDamage} + ${skillEfficiency}) *\n`,
						`(1 + ${skillTierBonus} + ${modBonus} +	${skillExpertise}) *\n`,
						`(1 + ${totalSkillDamage}) *\n`,
						`(1 + ${amps}) *\n`,
						`(1 + ${dta}) *\n`,
						`(1 + ${dttoc})\n`
					);
				// console.log(
				// 	`%cResult: ${this.formatValue(calc)}`,
				// 	"background: #222; color: #ff0000"
				// );
				return calc;
			},
			/**
			 * Calculate Cooldown
			 * @param {object} stat
			 */
			calculateCooldown(stat) {
				if (this.debug) {
					console.log("Calculating Cooldown");
					console.log(stat["Bonus"]);
					console.log(this.getSkillModsBonus(stat["Mod Bonus"]));
				}
				const baseCooldown = this.valueCleanup(stat["Tier 0"]);
				const skillTierBonus = this.toggleOvercharge
					? Number(
							(parseFloat(stat[`Overcharge`]) + Number.EPSILON) /
								100
					  )
					: this.skillTier === 0
					? 0
					: Number(
							(parseFloat(stat[`Tier ${this.skillTier}`]) +
								Number.EPSILON) /
								100
					  ); // skill tier bonus
				const skillEfficiency = this.stats.Utility["Skill Efficiency"]
					? (this.stats.Utility["Skill Efficiency"] +
							Number.EPSILON) /
					  100
					: 0;
				const sumSkillHaste =
					(this.stats.Utility[stat.Bonus] + Number.EPSILON) / 100 +
					skillEfficiency;
				const modBonus = this.getSkillModsBonus(stat["Mod Bonus"]);
				const calc = baseCooldown / (1 + (sumSkillHaste + modBonus));
				if (this.debug) {
					console.log(
						` ${baseCooldown} (baseCooldown)\n`,
						`/ (1 + (${sumSkillHaste} (sumSkillHaste) + ${modBonus} (modBonus))\n`,
						`{${skillTierBonus}} (skillTierBonus)`
					);
					console.log(
						`%cResult: ${this.formatValue(calc)}`,
						"background: #222; color: #ff0000"
					);
				}
				return calc;
			},
			/**
			 * Calculate Duration
			 * @param {object} stat
			 */
			calculateDuration(stat) {
				const baseDuration = this.valueCleanup(stat["Tier 0"]);
				const skillTierBonus =
					this.toggleOvercharge && stat[`Overcharge`]
						? Number(
								(parseFloat(stat[`Overcharge`]) +
									Number.EPSILON) /
									100
						  )
						: this.skillTier === 0
						? 0
						: stat[`Tier ${this.skillTier}`]
						? Number(
								(parseFloat(stat[`Tier ${this.skillTier}`]) +
									Number.EPSILON) /
									100
						  )
						: 0; // skill tier bonus
				const skillEfficiency = this.stats.Utility["Skill Efficiency"]
					? (this.stats.Utility["Skill Efficiency"] +
							Number.EPSILON) /
					  100
					: 0;
				const sumSkillDuration = this.stats.Utility[`${stat.Bonus}`]
					? (this.stats.Utility[`${stat.Bonus}`] + Number.EPSILON) /
							100 +
					  skillEfficiency
					: 0 + skillEfficiency;
				const sumDurationMods = this.getSkillModsBonus(
					stat["Mod Bonus"]
				);
				const calc =
					baseDuration *
					(1 + sumSkillDuration) *
					(1 + (sumDurationMods + skillTierBonus));
				if (this.debug) {
					console.log(
						` ${baseDuration} (baseDuration)\n`,
						`* (1 + ${sumSkillDuration} (sumSkillDuration))\n`,
						`* (1 + ${sumDurationMods} (sumDurationMods))\n`,
						`{${skillTierBonus}} (skillTierBonus)`
					);
					console.log(
						`%cResult: ${this.formatValue(calc)}`,
						"background: #222; color: #ff0000"
					);
				}
				return calc;
			},
			/**
			 * Calculate Ammo
			 * @param {object} stat
			 */
			calculateAmmo(stat) {
				const baseAmmo = this.valueCleanup(stat["Tier 0"]);
				const skillTierBonus =
					this.toggleOvercharge && stat[`Overcharge`]
						? Number(parseFloat(stat[`Overcharge`]))
						: this.skillTier === 0
						? 0
						: stat[`Tier ${this.skillTier}`]
						? Number(parseFloat(stat[`Tier ${this.skillTier}`]))
						: 0; // skill tier bonus
				const sumSkillDuration = this.stats.Utility[`${stat.Bonus}`]
					? (this.stats.Utility[`${stat.Bonus}`] + Number.EPSILON) /
					  100
					: 0;
				const sumAmmoMods = this.getSkillModsBonus(stat["Mod Bonus"]);
				const calc =
					baseAmmo *
					(1 + sumSkillDuration) *
					(1 + (sumAmmoMods + skillTierBonus));
				if (this.debug) {
					console.log(
						` ${baseAmmo} (baseDuration)\n`,
						`* (1 + ${sumSkillDuration} (sumSkillDuration))\n`,
						`* (1 + ${sumAmmoMods} (sumDurationMods))\n`,
						`{${skillTierBonus}} (skillTierBonus)`
					);
					console.log(
						`%cResult: ${this.formatValue(calc)}`,
						"background: #222; color: #ff0000"
					);
				}
				return calc;
			},
			/**
			 * Calculate all other Stats
			 * @param {object} stat
			 */
			calculateStat(stat) {
				const baseStat = this.valueCleanup(stat["Tier 0"]);
				const skillTierBonus =
					this.toggleOvercharge && stat[`Overcharge`]
						? Number(
								(parseFloat(stat[`Overcharge`]) +
									Number.EPSILON) /
									100
						  )
						: this.skillTier === 0
						? 0
						: stat[`Tier ${this.skillTier}`]
						? Number(
								(parseFloat(stat[`Tier ${this.skillTier}`]) +
									Number.EPSILON) /
									100
						  )
						: 0; // skill tier bonus
				// TODO check if Skill Efficiency Applies
				// 10% Skill Efficiency is equal to ALL of the following:
				// 10% Skill Damage
				// 10% Skill Haste
				// 10% Skill Duration
				// 10% Skill Health
				// 10% Repair Skills
				// 10% Status Effects
				let useEfficiency = false;
				switch (stat.Bonus) {
					case "Skill Damage":
					case "Skill Haste":
					case "Skill Duration":
					case "Skill Health":
					case "Repair Skills":
					case "Status Effects":
						useEfficiency = true;
						break;
				}
				const skillEfficiency =
					useEfficiency && this.stats.Utility["Skill Efficiency"]
						? (this.stats.Utility["Skill Efficiency"] +
								Number.EPSILON) /
						  100
						: 0;
				const sumSkillStat = this.stats.Utility[stat.Bonus]
					? (this.stats.Utility[stat.Bonus] + Number.EPSILON) / 100 +
					  skillEfficiency
					: 0;
				const sumStatMods = this.getSkillModsBonus(stat["Mod Bonus"]);
				const calc =
					baseStat *
					(1 + sumSkillStat) *
					(1 + (sumStatMods + skillTierBonus));
				if (this.debug) {
					console.log(
						` ${baseStat} (baseStat)\n`,
						`* (1 + ${sumSkillStat} (sumSkillStat))\n`,
						`* (1 + ${sumStatMods} (sumStatMods))\n`,
						`{${skillTierBonus}} (skillTierBonus)`
					);
					console.log(
						`%cResult: ${this.formatValue(calc)}`,
						"background: #222; color: #ff0000"
					);
				}
				return calc;
			},
			getSkillMods(stat) {
				const debugFormat = "background: #222; color: #ff09c7";
				if (this.debug)
					console.groupCollapsed(
						`%cfunction getSkillMods (${stat}):`,
						debugFormat
					);
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
						if (this.debug) console.log(`MOD FOUND: `, mod.prop);
						// const stat = stat;
						const val = skillDetails[mod.prop][mod.propStatVal]
							? skillDetails[mod.prop][mod.propStatVal]
							: parseFloat(
									skillDetails[mod.prop][
										mod.propMax
									].replaceAll("%", "")
									// eslint-disable-next-line no-mixed-spaces-and-tabs
							  ); // [mod.propStatVal] [mod.propMax]
						if (this.debug) console.log(`MOD VALUE: `, val);
						// skillMods.stat = stat;
						// skillMods.val = val;
						if (this.debug)
							console.log(
								`MOD ADDED: `,
								`${skillDetails[mod.prop]["Mod Bonus"]}: ${val}`
							);
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
				console.groupEnd();
				return skillMods;
			},
			getSkillModsBonus(stat) {
				const debugFormat = "background: #222; color: #ff09c7";
				if (this.debug)
					console.groupCollapsed(
						`%cfunction getSkillModsBonus (${stat}):`,
						debugFormat
					);
				// this.skillStats (the stats an actual skill has shown in the table)
				// this.stats (is what has the mods)
				// this.stats.Skills.Skill1.skillDetails.modOne (each mod)
				// if (this.debug) console.log(this.name, this.stats, stat);
				let bonusValue = 0;
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
						if (this.debug) console.log(`MOD FOUND: `, mod.prop);
						// const stat = stat;
						const val = skillDetails[mod.prop][mod.propStatVal]
							? skillDetails[mod.prop][mod.propStatVal]
							: parseFloat(
									skillDetails[mod.prop][
										mod.propMax
									].replaceAll("%", "")
									// eslint-disable-next-line no-mixed-spaces-and-tabs
							  ); // [mod.propStatVal] [mod.propMax]
						if (this.debug) console.log(`MOD VALUE: `, val);
						// skillMods.stat = stat;
						// skillMods.val = val;
						if (this.debug)
							console.log(
								`MOD ADDED: `,
								`${skillDetails[mod.prop]["Mod Bonus"]}: ${val}`
							);
						skillMods.push({
							[skillDetails[mod.prop]["Mod Bonus"]]: val,
						});
						if (skillDetails[mod.prop]["Mod Bonus"] === stat) {
							bonusValue += val;
						}
					}
				});
				console.groupEnd();
				if (stat === "Ammo") {
					return bonusValue ? bonusValue + Number.EPSILON : 0;
				} else {
					return bonusValue ? (bonusValue + Number.EPSILON) / 100 : 0;
				}
			},
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
			updatedToggle(toggle) {
				!this[`toggle${toggle}`];
				switch (toggle) {
					case "Overcharge":
						this.skillTierOvercharged = this.toggleOvercharge
							? "Overcharged"
							: "";
						break;
					default:
						break;
				}
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

<!--
Azurmen32:
Simple Weapon formula:
Base Bullet damage x (sum of WD + sWD + Expertise) x TWD x (CHD+HSD) x DTOOC x (DTA or DTH) x Amp 1 x amp 2…..

Base skill damage x
(Sum of skill damage + efficiency+ technician perk+ watch) x
(skill tier damage + skill mod damage + expertise damage) x
(total skill damage) x
amps x
dta (for all but assault turret, sniper turret and striker drone) x
DTOOC (oxy chem and demo fly only)

		10% Skill Efficiency is equal to ALL of the following:
    10% Skill Damage
    10% Skill Haste
    10% Skill Duration
    10% Skill Health
    10% Repair Skills
    10% Status Effects

•    All stat categorys are additive with themselves and then multiplicative with other status unless noted, Except Amps are NEVER additive. 
•    SD = skill damage, TSD= total skill damage (ie talent combined arms), TWD = Total weapon damage (ie vigilance)
•    sWD = specific weapon damage (IE Fenris, petrov, Spec weapon damage nodes)
-->
