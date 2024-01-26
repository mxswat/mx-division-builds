<template>
	<div class="skill-stat">
		<template v-if="skillName">
			<span class="section-title utility"> (BETA) - {{ skillName }} </span>
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
			>(BETA) - No skill selected</span
		>
	</div>
</template>

<script>
	import statsService from "../../utils/statsService";
	import Toggle from "../generic/Toggle.vue";

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
				if (this.debug) {
					console.groupCollapsed(
						`%ccreated->subscription ${this.name}:`,
						`background: #222; color: #bada55`
					);
					console.warn(`Subscription to stats:`, stats);
				}
				this.stats = stats;
				this.updateStatsUI(stats);
				if (this.debug) {
					console.groupEnd();
				}
			});
		},
		methods: {
			updateStatsUI(stats) {
				if (this.debug) {
					console.groupCollapsed(
						`%cupdateStatsUI ${this.name}:`,
						`background: #222; color: #bada55`
					);
					console.warn(`updateStatsUI(stats)`);
				}
				this.skillName = stats.Skills[this.name].skillName;

				// Skill Tier
				this.skillTier = stats.Utility["Skill Tier"];
				if (
					Object.hasOwnProperty.call(stats.Skills[this.name], "skillDetails")
				) {
					this.skillStats = stats.Skills[this.name].skillDetails.stats.filter(
						(stat) => {
							return stat.Stat !== "(Blank)";
						}
					);
					this.skillStatsList = this.getUniqueSkillStats(stats);
				}
				if (this.debug) {
					console.groupEnd();
				}
			},
			getUniqueSkillStats(stats) {
				if (this.debug) {
					console.groupCollapsed(
						`%cgetUniqueSkillStats ${this.name}:`,
						`background: #222; color: #bada55`
					);
					console.log(stats.Skills[this.name].skillDetails.stats);
				}
				const array = stats.Skills[this.name].skillDetails.stats;
				if (this.debug) {
					console.warn(array);
					console.groupEnd();
				}
				return array.filter((stat) => {
					return (
						// stat["Stat Bonus"] !== "" && // removed for now...
						stat.Stat !== "(Blank)" && stat["Display"].toLowerCase() === "true"
					);
				});
			},
			calculateStatValue(stat) {
				if (this.debug) {
					console.groupCollapsed(
						`%cSTART - ${stat["Skill Variant Name"]} (${stat["Stat"]} => ${stat["Stat Bonus"]}):`,
						`background: #222; color: #bada55`
					);
				}

				let value = this.valueCleanup(stat["Tier 0"]); // eventual calculated value, but setting to the base/tier 0 value for now

				// TODO Get expertise stat to calculate from Expertise Column for all OTHER stats
				value = this.calculateStats(stat);

				if (this.debug) {
					console.warn(
						`END calculateStatValue this.formatValue(value):`,
						this.formatValue(value)
					);
					console.groupEnd();
				}
				return this.formatValue(value);
			},
			/**
			 * Calculate Stats
			 * @param {object} stat
			 */
			calculateStats(stat) {
				if (this.debug) {
					console.groupCollapsed(
						`%ccalculateStats - ${stat["Stat Bonus"]}:`,
						`background: #222; color: #ffda55`
					);
					console.warn(`calculateStats(stat): `, stat);
				}
				const baseValue = this.valueCleanup(stat["Tier 0"]);
				const skillTierBonus = this.getSkillTierBonus(stat);
				let useEfficiency = false;
				switch (stat["Stat Bonus"]) {
					case "Skill Damage":
					case "Skill Haste":
					case "Skill Duration":
					case "Skill Health":
					case "Repair Skills":
					case "Status Effects":
						useEfficiency = true;
						break;
				}
				const skillEfficiency = useEfficiency
					? this.getSkillEfficiencyBonus()
					: 0;
				const sumSkillStat = this.getSumSkillStat(stat);
				const sumSkillHaste = this.stats.Utility["Skill Haste"]
					? (this.stats.Utility["Skill Haste"] + Number.EPSILON) / 100
					: 0;
				const sumSkillStatMods = this.getSkillModsBonus(stat["Stat Bonus"]);
				const skillExpertise = this.getSkillExpertise(stat);
				const baseAmmo = this.getBaseAmmo();
				const totalAmmo = this.getTotalAmmo();
				const baseCharges = this.getBaseCharges();
				const totalCharges = this.getTotalCharges();
				const s = {
					baseValue: baseValue,
					sumSkillStat: sumSkillStat,
					skillEfficiency: skillEfficiency,
					skillTierBonus: skillTierBonus,
					sumSkillStatMods: sumSkillStatMods,
					sumSkillHaste: sumSkillHaste,
					skillExpertise: skillExpertise,
					totalSkillStat: 0,
					hiveSkillHaste: 0, // BSTU Gloves only
					baseAmmo: baseAmmo,
					totalAmmo: totalAmmo,
					baseCharges: baseCharges,
					totalCharges: totalCharges,
					amps: 0,
					dta: 0,
					dttoc: 0,
				};
				const calculation = this.runCalculation(stat["Stat Bonus"], s);
				if (this.debug) {
					console.groupEnd();
					console.log(
						`%cCalculation Result: ${this.formatValue(calculation)}`,
						"background: #222; color: #ff0000"
					);
				}
				return calculation;
			},
			runCalculation(bonus, params) {
				if (this.debug) {
					console.groupCollapsed(
						`%cCALCULATION:`,
						`background: #222; color: #ffda55`
					);
					console.warn(`params:`, params);
				}
				let result = 0;
				switch (bonus) {
					case "Skill Damage":
						console.log(bonus);
						result =
							Math.floor(
								params.baseValue *
									(1 + params.sumSkillStat + params.skillEfficiency)
							) *
							(1 +
								params.skillTierBonus +
								params.sumSkillStatMods +
								params.skillExpertise) *
							(1 + params.totalSkillStat) *
							(1 + params.amps) *
							(1 + params.dta) *
							(1 + params.dttoc);
						if (this.debug)
							console.log(
								`${params.baseValue} {baseValue} *\n`,
								`(1 + ${params.sumSkillStat} {sumSkillStat} + ${params.skillEfficiency} {skillEfficiency}) *\n`,
								`(1 + ${params.skillTierBonus} {skillTierBonus} + ${params.sumSkillStatMods} {sumSkillStatMods} +	${params.skillExpertise} {skillExpertise}) *\n`,
								`(1 + ${params.totalSkillStat} {totalSkillStat}) *\n`,
								`(1 + ${params.amps} {amps}) *\n`,
								`(1 + ${params.dta} {dta}) *\n`,
								`(1 + ${params.dttoc} {dttoc})\n`
							);
						break;
					case "Damage":
						console.log(bonus);
						result =
							Math.floor(
								params.baseValue *
									(1 + params.sumSkillStat + params.skillEfficiency)
							) *
							(1 +
								params.skillTierBonus +
								params.sumSkillStatMods +
								params.skillExpertise) *
							(1 + params.totalSkillStat) *
							(1 + params.amps) *
							(1 + params.dta) *
							(1 + params.dttoc);
						if (this.debug)
							console.log(
								`${params.baseValue} {baseValue} *\n`,
								`(1 + ${params.sumSkillStat} {sumSkillStat} + ${params.skillEfficiency} {skillEfficiency}) *\n`,
								`(1 + ${params.skillTierBonus} {skillTierBonus} + ${params.sumSkillStatMods} {sumSkillStatMods} +	${params.skillExpertise} {skillExpertise}) *\n`,
								`(1 + ${params.totalSkillStat} {totalSkillStat}) *\n`,
								`(1 + ${params.amps} {amps}) *\n`,
								`(1 + ${params.dta} {dta}) *\n`,
								`(1 + ${params.dttoc} {dttoc})\n`
							);
						break;
					case "Ammo":
					case "Repair Charges":
					case "Charges":
						console.log(bonus);
						result =
							Number(params.baseValue) +
							Number(params.sumSkillStatMods) +
							Number(params.skillTierBonus);
						if (this.debug) {
							console.log(
								`${params.baseValue} {baseValue} + \n`,
								`${params.sumSkillStatMods} {sumSkillStatMods} + \n`,
								`${params.skillTierBonus} {skillTierBonus})`
							);
						}
						break;
					case "Skill Haste":
						console.log(bonus);
						result =
							params.baseValue /
							(1 + (params.sumSkillStat + params.sumSkillStatMods));
						break;
					case "Bleed Damage":
						console.log(bonus);
						result =
							Math.floor(
								params.baseValue *
									(1 + params.sumSkillStat + params.skillEfficiency)
							) *
							(1 +
								params.skillTierBonus +
								params.sumSkillStatMods +
								params.skillExpertise) *
							(1 + params.totalSkillStat) *
							(1 + params.amps) *
							(1 + params.dta) *
							(1 + params.dttoc);
						if (this.debug)
							console.log(
								`${params.baseValue} {baseValue} *\n`,
								`(1 + ${params.sumSkillStat} {sumSkillStat} + ${params.skillEfficiency} {skillEfficiency}) *\n`,
								`(1 + ${params.skillTierBonus} {skillTierBonus} + ${params.sumSkillStatMods} {sumSkillStatMods} +	${params.skillExpertise} {skillExpertise}) *\n`,
								`(1 + ${params.totalSkillStat} {totalSkillStat}) *\n`,
								`(1 + ${params.amps} {amps}) *\n`,
								`(1 + ${params.dta} {dta}) *\n`,
								`(1 + ${params.dttoc} {dttoc})\n`
							);
						break;
					case "Status Effects": // 55,247
						console.log(bonus);
						result =
							Math.floor(
								params.baseValue *
									(1 + params.sumSkillStat + params.skillEfficiency)
							) *
							(1 +
								params.skillTierBonus +
								params.sumSkillStatMods +
								params.skillExpertise) *
							(1 + params.totalSkillStat) *
							(1 + params.amps) *
							(1 + params.dta) *
							(1 + params.dttoc);
						if (this.debug)
							console.log(
								`${params.baseValue} {baseValue} *\n`,
								`(1 + ${params.sumSkillStat} {sumSkillStat} + ${params.skillEfficiency} {skillEfficiency}) *\n`,
								`(1 + ${params.skillTierBonus} {skillTierBonus} + ${params.sumSkillStatMods} {sumSkillStatMods} +	${params.skillExpertise} {skillExpertise}) *\n`,
								`(1 + ${params.totalSkillStat} {totalSkillStat}) *\n`,
								`(1 + ${params.amps} {amps}) *\n`,
								`(1 + ${params.dta} {dta}) *\n`,
								`(1 + ${params.dttoc} {dttoc})\n`
							);
						break;
					case "Refill Speed":
						console.log(bonus);
						// TODO Hive + BTSU Gloves
						result =
							(params.baseValue * params.baseCharges) /
							(params.totalCharges * (1 + params.sumSkillHaste)) /
							(1 +
								params.skillTierBonus +
								params.sumSkillStatMods +
								params.hiveSkillHaste * this.skillTier);
						if (this.debug) {
							console.log(
								`(${params.baseValue} {baseValue} * ${params.baseCharges} {baseCharges}) / \n`,
								`(${params.totalCharges} {totalCharges} * \n`,
								`(1 + (${params.sumSkillHaste} {sumSkillHaste})) / \n`,
								`(1 + ${params.sumSkillTierBonus} {sumSkillTierBonus} + ${params.sumSkillStatMods} {sumSkillStatMods} + (${params.hiveSkillHaste} {hiveSkillHaste} * ${this.skillTier} {skillTier}))`
							);
						}
						break;
					default:
						console.log(`default:`, bonus);
						result =
							params.baseValue *
							(1 + params.sumSkillStat) *
							(1 + (params.sumSkillStatMods + params.skillTierBonus));
						if (this.debug) {
							console.log(
								` ${params.baseValue} {baseValue} * \n`,
								`(1 + ${params.sumSkillStat} {sumSkillStat}) * \n`,
								`(1 + (${params.sumSkillStatMods} {sumSkillStatMods} + ${params.skillTierBonus} {skillTierBonus}))`
							);
						}
						break;
				}
				if (this.debug) {
					console.groupEnd();
				}
				return result;
			},
			getSkillExpertise(stat) {
				// TODO Check if expertise applies to stat
				const debugFormat = "background: #222; color: #ff09c7";
				if (this.debug)
					console.groupCollapsed(
						`%cfunction getSkillExpertise (${stat["Stat Bonus"]}) for Skill Tier ${this.skillTier}:`,
						debugFormat,
						stat
					);
				// get skill expertise stat
				console.log(
					this.stats.Skills[this.name].skillDetails.expertise.bonusStat
				);
				let skillExpertise = 0;
				if (
					this.stats.Skills[this.name].skillDetails.expertise.bonusStat ===
					stat["Stat Bonus"]
				) {
					skillExpertise =
						Object.hasOwnProperty.call(
							this.stats.Skills[this.name].skillDetails.expertise,
							"StatValueExpertise"
						) && stat["Expertise Bonus"] === stat["Bonus"]
							? (this.stats.Skills[this.name].skillDetails.expertise
									.StatValueExpertise +
									Number.EPSILON) /
							  100
							: (this.stats.Skills[this.name].skillDetails.expertise.max +
									Number.EPSILON) /
							  100;
				}
				if (this.debug) {
					console.groupEnd();
				}
				if (this.debug) {
					console.log(
						`%cSkill Expertise Result: ${skillExpertise}`,
						"background: #222; color: #ff0000"
					);
				}
				return skillExpertise;
			},
			getSkillTierBonus(stat) {
				const debugFormat = "background: #222; color: #ff09c7";
				if (this.debug)
					console.groupCollapsed(
						`%cfunction getSkillTierBonus (${stat["Stat Bonus"]}) for Skill Tier ${this.skillTier}:`,
						debugFormat,
						stat
					);
				let isPercent = false;
				let skillTierBonus = 0;
				if (this.toggleOvercharge && stat[`Overcharge`]) {
					skillTierBonus = stat[`Overcharge`];
					isPercent = skillTierBonus.includes("%");
					console.log(`Overcharge: ${skillTierBonus}`);
				} else {
					if (stat[`Tier ${this.skillTier}`] && this.skillTier > 0) {
						skillTierBonus = stat[`Tier ${this.skillTier}`];
						isPercent = skillTierBonus.includes("%");
						console.log(`Tier ${this.skillTier}: ${skillTierBonus}`);
					}
				}
				if (isPercent) {
					skillTierBonus = Number(
						(parseFloat(skillTierBonus) + Number.EPSILON) / 100
					);
				}
				if (this.debug) {
					console.groupEnd();
				}
				if (this.debug) {
					console.log(
						`%cSkill Tier Bonus Result (isPercent: ${isPercent}) : ${skillTierBonus}`,
						"background: #222; color: #ff0000"
					);
				}
				return skillTierBonus;
			},
			getSkillEfficiencyBonus() {
				// TODO check if Skill Efficiency Applies
				// 10% Skill Efficiency is equal to ALL of the following:
				// 10% Skill Damage
				// 10% Skill Haste
				// 10% Skill Duration
				// 10% Skill Health
				// 10% Repair Skills
				// 10% Status Effects
				return this.stats.Utility["Skill Efficiency"]
					? (this.stats.Utility["Skill Efficiency"] + Number.EPSILON) / 100
					: 0;
			},
			getSumSkillStat(stat) {
				const debugFormat = "background: #222; color: #ff09c7";
				if (this.debug)
					console.groupCollapsed(
						`%cfunction getSumSkillStat (${stat["Stat Bonus"]}):`,
						debugFormat,
						stat
					);
				let sumBonus = 0;
				switch (stat["Stat Bonus"]) {
					case "Burn Damage":
					case "Bleed Damage":
						sumBonus =
							this.stats.Utility["Skill Damage"] ||
							this.stats.Utility["Status Effects"]
								? (this.stats.Utility["Skill Damage"] +
										this.stats.Utility["Status Effects"] +
										Number.EPSILON) /
								  100
								: 0;
						break;
					case "Damage":
						sumBonus = this.stats.Utility["Skill Damage"]
							? (this.stats.Utility["Skill Damage"] + Number.EPSILON) / 100
							: 0;
						break;
					default:
						sumBonus = this.stats.Utility[stat["Stat Bonus"]]
							? (this.stats.Utility[stat["Stat Bonus"]] + Number.EPSILON) / 100
							: 0;
						break;
				}
				if (this.debug) {
					console.groupEnd();
				}
				if (this.debug) {
					console.log(
						`%cSum Skill Stat Bonus Result : ${sumBonus}`,
						"background: #222; color: #ff0000"
					);
				}
				return sumBonus;
			},
			getSkillMods(stat) {
				const debugFormat = "background: #222; color: #ff09c7";
				if (this.debug) {
					console.warn(`getSkillMods(stat)`);
				}
				// if (this.debug)
				// 	console.groupCollapsed(
				// 		`%cfunction getSkillMods (${stat}):`,
				// 		debugFormat
				// 	);
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
									skillDetails[mod.prop][mod.propMax].replaceAll("%", "")
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
				// console.groupEnd();
				return skillMods;
			},
			getSkillModsBonus(stat) {
				if (!stat) {
					return 0;
				}
				const debugFormat = "background: #222; color: #ff09c7";
				if (this.debug)
					console.groupCollapsed(
						`%cfunction getSkillModsBonus (${stat}):`,
						debugFormat
					);
				let bonusValue = 0;
				const skillMods = [];
				const mods = [
					{
						prop: "modOne",
						propStatVal: "StatValueModOne",
						propVal: "StatValueModOne",
						propMax: "Max",
					},
					{
						prop: "modTwo",
						propStatVal: "StatValueModTwo",
						propVal: "StatValueModTwo",
						propMax: "Max",
					},
					{
						prop: "modThree",
						propStatVal: "StatValueModThree",
						propVal: "StatValueModThree",
						propMax: "Max",
					},
				];
				// TODO Need to check if value is percentage or whole number
				let isPercent = true;
				const skillDetails = this.stats.Skills[this.name].skillDetails;
				// loop through each Mod
				if (this.debug)
					console.warn(
						`skillDetails (${this.name} - ${
							this.stats.Skills[this.name].skillDetails.itemName
						}):`,
						skillDetails
					);
				mods.forEach((mod) => {
					if (
						skillDetails[mod.prop] &&
						skillDetails[mod.prop]["Mod Bonus"] === stat
					) {
						if (this.debug)
							console.log(
								`skillDetails[${mod.prop}][${mod.propStatVal}]: `,
								skillDetails[mod.prop][mod.propStatVal]
							);
						if (this.debug) console.log(`MOD FOUND: `, mod.prop);
						// const stat = stat;
						const val = skillDetails[mod.prop][mod.propStatVal]
							? skillDetails[mod.prop][mod.propStatVal]
							: parseFloat(
									skillDetails[mod.prop][mod.propMax].replaceAll("%", "")
									// eslint-disable-next-line no-mixed-spaces-and-tabs
							  ); // [mod.propStatVal] [mod.propMax]
						if (this.debug) console.log(`MOD VALUE: `, val);
						// skillMods.stat = stat;
						// skillMods.val = val;
						if (this.debug)
							console.log(
								`MOD ADDED: `,
								`MAX = ${skillDetails[mod.prop][mod.propMax]}: ${val}`
							);
						skillMods.push({
							[skillDetails[mod.prop][mod.propMax]]: val,
						});
						if (skillDetails[mod.prop]["Mod Bonus"] === stat) {
							bonusValue += val;
						}
						isPercent = skillDetails[mod.prop][mod.propMax].includes("%");
					} else {
						console.warn(`${mod.prop} is NOT ${stat}!`);
					}
				});
				if (isPercent) {
					bonusValue = Number((parseFloat(bonusValue) + Number.EPSILON) / 100);
				}
				if (this.debug) {
					console.groupEnd();
				}
				if (this.debug) {
					console.log(
						`%cSkill Mods Bonus Result (isPercent: ${isPercent}): ${bonusValue}`,
						"background: #222; color: #ff0000"
					);
				}
				return bonusValue;
			},
			getBaseAmmo(stat = 0) {
				const debugFormat = "background: #222; color: #ff09c7";
				if (this.debug)
					console.groupCollapsed(
						`%cfunction getBaseAmmo ("Stat Bonus") for Skill Tier ${this.skillTier}:`,
						debugFormat,
						stat
					);
				let baseAmmo = 8;
				if (this.debug) {
					console.groupEnd();
				}
				if (this.debug) {
					console.log(
						`%cBase Ammo Result : ${baseAmmo}`,
						"background: #222; color: #ff0000"
					);
				}
				return baseAmmo;
			},
			getTotalAmmo() {
				return 18;
			},
			getBaseCharges() {
				const debugFormat = "background: #222; color: #ff09c7";
				if (this.debug)
					console.groupCollapsed(
						`%cfunction getBaseCharges for Skill Tier ${this.skillTier}:`,
						debugFormat,
						"this.stats:",
						this.stats.Skills[this.name].skillDetails.stats
					);
				let charges = 0;
				// skill stats array
				const stat = this.stats.Skills[this.name].skillDetails.stats.filter(
					(stat) => stat["Stat Bonus"] === "Charges"
				);
				if (stat.length > 0) {
					console.log(stat[0]["Tier 0"]);
					charges = Number(stat[0]["Tier 0"]);
				}
				if (this.debug) {
					console.groupEnd();
				}
				if (this.debug) {
					console.log(
						`%cBase Charges Result : ${charges}`,
						"background: #222; color: #ff0000"
					);
				}
				return charges;
			},
			getTotalCharges() {
				const debugFormat = "background: #222; color: #ff09c7";
				if (this.debug)
					console.groupCollapsed(
						`%cfunction getTotalCharges for Skill Tier ${this.skillTier}:`,
						debugFormat,
						"this.stats:",
						this.stats.Skills[this.name].skillDetails.stats
					);
				let charges = 0;
				let mods = 0;
				let tier = 0;
				// skill stats array
				const stat = this.stats.Skills[this.name].skillDetails.stats.filter(
					(stat) => stat["Stat Bonus"] === "Charges"
				);
				if (stat.length > 0) {
					console.log(stat[0][`Tier ${this.skillTier}`]);
					// base
					charges = Number(stat[0]["Tier 0"]);
					// skill tier
					if (stat[0][`Tier ${this.skillTier}`]) {
						charges = charges + Number(stat[0][`Tier ${this.skillTier}`]);
					}
				}
				// mods
				charges = charges + this.getSkillModsBonus("Charges");
				if (this.debug) {
					console.groupEnd();
				}
				if (this.debug) {
					console.log(
						`%cTotal Charges Result : ${charges}`,
						"background: #222; color: #ff0000"
					);
				}
				return charges + mods + tier;
			},
			valueCleanup(value) {
				const debug = false;
				if (debug) {
					console.warn(`valueCleanup(value)`);
				}
				if (!value) return;
				value = value.trim();
				if (value.includes("%") && value.includes(".")) {
					if (debug) console.log("Cleaning: float percent", value);
					return parseFloat(value.replaceAll("%", "")) / 100;
				}
				if (value.includes("%")) {
					if (debug) console.log("Cleaning: percent", value);
					value = value.replace("%", "");
					if (debug) console.log("Clean: percent", value);
					return parseInt(value) / 100;
				}
				if (value.includes(".") && value.includes(",")) {
					if (debug) console.log("Cleaning: floating thousands", value);
				}
				if (value.includes(".")) {
					if (debug) console.log("Cleaning: float", value);
					return parseFloat(value.replaceAll(",", ""));
				}
				if (value.includes(",")) {
					if (debug) console.log("Cleaning: whole thousands", value);
					return parseInt(value.replaceAll(",", ""));
				}
				if (debug) console.log("Cleaning: other", typeof value, value);
				return parseInt(value);
			},
			formatValue(value, format = "") {
				// if (this.debug) {
				// 	console.warn(`formatValue(value)`);
				// }
				value = Number(Number(value).toFixed(1)).toLocaleString();
				// console.log(typeof value, value);
				return value;
			},
			roundValue(number) {
				if (this.debug) {
					console.warn(`roundNumber(number)`);
				}
				return Number(Number(number).toFixed(2)).toLocaleString();
			},
			updatedToggle(toggle) {
				if (this.debug) {
					console.warn(`updatedToggle(toggle)`);
				}
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

2023-05-03

Simple Skill damage formula:
Base skill damage x  (Sum of SD + Skill efficiency+ watch) x (Sum of skill tier boost + Skill expertise + skill mods) x TSD x Status effect (if it has one) x DTOOC (oxy + Demo fly only) x DTA (no assault turret, sniper/ striker drone) x Amp 1 x amp 2…..

•    All stat categorys are additive with themselves and then multiplicative with other status unless noted, Except Amps are NEVER additive. 
•    SD = skill damage, TSD= total skill damage (ie talent combined arms), TWD = Total weapon damage (ie vigilance)
•    sWD = specific weapon damage (IE Fenris, petrov, Spec weapon damage nodes)
-->
