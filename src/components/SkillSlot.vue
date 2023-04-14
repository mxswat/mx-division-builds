<template>
	<div class="skill-container">
		<template @click="onClick()" v-if="isSkillSelected()">
			<img :src="currentSkill.icon" alt="" class="img-slot-bg" />
			<div
				class="slot-element skill-name"
				v-bind:class="[qualityToCSS(currentSkill.quality)]"
				v-on:click="openSkillsModal()"
			>
				<div>
					{{ currentSkill.variant }} {{ currentSkill.itemName }}
				</div>
			</div>
			<!-- Expertise -->
			<div class="slot-element stat-edit">
				<span class="expertise">Expertise</span>
				<ExpertiseInput
					v-if="currentSkill['expertise']"
					v-model="currentSkill['expertise'].StatValueExpertise"
					v-bind:max="currentSkill['expertise'].max"
				></ExpertiseInput>
			</div>
			<template
				v-for="(slot, id) in modSlots"
				class="slot-element stat-edit mod-slot"
			>
				<div
					class="slot-element stat-edit mod-slot"
					v-if="
						currentSkill.filters[`mod${slot}`] &&
							getModSlotName(slot)
					"
					v-bind:key="id"
				>
					<v-select
						:placeholder="getModSlotName(slot)"
						:clearable="false"
						:options="filterSkillMods(slot)"
						v-model="currentSkill[`mod${slot}`]"
						label="Stat"
					>
						<template v-slot:option="option">
							<!-- <img
								class="attribute-image"
								v-bind:src="typeToImgSrc.mod[option.Type]"
							/> -->
							<span class="attribute-label">{{
								`${option["Bonus"]}${
									option["Specialization"]
										? ` [${option["Specialization"]}]`
										: ""
								}`
							}}</span>
							<span class="attribute-value">{{
								option[`Mod ${slot}`]
							}}</span>
						</template>
						<template #selected-option="option">
							<!-- <img
								class="attribute-image"
								v-bind:src="typeToImgSrc.mod[option.Type]"
							/> -->
							<span class="attribute-label">{{
								`${option["Stat"]}${
									option["Specialization"]
										? ` (${option["Specialization"]})`
										: ""
								}`
							}}</span>
						</template>
					</v-select>
					<StatInput
						v-if="currentSkill[`mod${slot}`]"
						v-model="
							currentSkill[`mod${slot}`][`StatValueMod${slot}`]
						"
						v-bind:max="
							getMaxStatValue(
								currentSkill[`mod${slot}`][`Mod ${slot}`]
							)
						"
						v-bind:step="
							getStepStatValue(
								currentSkill[`mod${slot}`][`Mod ${slot}`]
							)
						"
					></StatInput>
				</div>
			</template>
		</template>
		<template v-if="!isSkillSelected()">
			<img src="icons/skills.png" alt="" class="img-slot-bg" />
			<span @click="onClick()" class="no-element-selected">
				<p>CHOOSE YOUR SKILL</p>
			</span>
		</template>
	</div>
</template>

<script>
	import { openSkillsModal } from "../utils/modalService";
	import { SkillBase } from "../utils/classes";
	import {
		typeToImgSrc,
		qualityToCss,
		getUniqueObject,
	} from "../utils/utils";
	import { skillsData } from "../utils/dataImporter";
	import StatInput from "./StatInput";
	import Vue from "vue";
	import coreService from "../utils/coreService";
	import ExpertiseInput from "./ExpertiseInput.vue";

	const modSlots = ["One", "Two", "Three"];

	export default {
		name: "SkillSlot",
		components: { StatInput, ExpertiseInput },
		props: {
			name: undefined,
			init: null,
		},
		data() {
			return {
				currentSkill: new SkillBase(),
				typeToImgSrc: null,
				skillsList: [],
				skillMods: null,
				skillStats: null,
				modSlots: modSlots,
			};
		},
		methods: {
			qualityToCSS(quality) {
				return qualityToCss[quality];
			},
			getModSlotName(slot) {
				// console.log(this.currentSkill[`slot${slot}`]);
				if (this.currentSkill[`slot${slot}`]) {
					return this.currentSkill[`slot${slot}`];
				}
				// if (
				// 	Object.hasOwnProperty.call(
				// 		modSlotsMapping,
				// 		this.currentSkill.itemName
				// 	)
				// ) {
				// 	return modSlotsMapping[this.currentSkill.itemName][slot];
				// } else {
				// 	return "Slot";
				// }
			},
			isSkillSelected() {
				return this.currentSkill && this.currentSkill.itemName;
			},
			onClick() {
				if (!this.isSkillSelected()) {
					this.openSkillsModal();
				}
			},
			onModalClose(data) {
				// console.log("data: ", data);
				this.currentSkill = new SkillBase(data);
				// console.log(this.currentSkill);
				if (this.currentSkill.itemName === "(Blank)") {
					this.currentSkill = null;
					return;
				}
				this.currentSkill.stats = this.skillStats.filter((stat) => {
					return (
						`${this.currentSkill.variant} ${this.currentSkill.itemName}` ===
							stat.Variant &&
						!stat.Stat.toLowerCase().includes("pvp") &&
						!stat.Stat.toLowerCase().includes("conflict")
					);
				});
				// console.log(this.currentSkill);
				// this.currentSkill = new GearBase(data);
				// switch (this.currentSkill.quality) {
				// 	case "Exotic":
				// 	case "Named":
				// 		this.currentSkill.core = this.coreAttributes.find(
				// 			(attribute) =>
				// 				attribute.label ===
				// 				this.currentSkill.filters.core
				// 		);
				// 		if (data.coreTwo !== null) {
				// 			this.currentSkill.coreTwo = this.coreAttributes.find(
				// 				(attribute) =>
				// 					attribute.label ===
				// 					this.currentSkill.filters.coreTwo
				// 			);
				// 		}
				// 		if (data.coreThree !== null) {
				// 			this.currentSkill.coreThree = this.coreAttributes.find(
				// 				(attribute) =>
				// 					attribute.label ===
				// 					this.currentSkill.filters.coreThree
				// 			);
				// 		}
				// 		this.currentSkill.attributeOne = this.allGearAttributes.find(
				// 			(attribute) =>
				// 				attribute.Stat ===
				// 				this.currentSkill.filters.attributeOne
				// 		);
				// 		this.currentSkill.attributeTwo = this.allGearAttributes.find(
				// 			(attribute) =>
				// 				attribute.Stat ===
				// 				this.currentSkill.filters.attributeTwo
				// 		);
				// 		this.currentSkill.attributeThree = this.allGearAttributes.find(
				// 			(attribute) =>
				// 				attribute.Stat ===
				// 				this.currentSkill.filters.attributeThree
				// 		);
				// 		break;
				// 	case "Gearset":
				// 		break;
				// 	default:
				// 		break;
				// }
			},
			openSkillsModal() {
				openSkillsModal(this.skillsList, this.name, this.onModalClose);
			},
			filterSkillMods(slot) {
				// console.log(
				// 	"this.currentSkill.filters: ",
				// 	this.currentSkill.filters
				// );
				// const mods = this.skillMods.filter((mod) => {
				// 	// console.log(this.currentSkill.filters.modOne, mod.Skill);
				// 	return (
				// 		mod.Slot === slot &&
				// 		this.currentSkill.filters[`mod${slot}`] === mod.Skill
				// 	);
				// });
				const mods = this.skillStats.filter((stat) => {
					// console.log(stat);
					// console.log(
					// 	`${this.currentSkill.variant} ${this.currentSkill.itemName}`
					// );
					// console.log(stat["Expertise Bonus"]);
					// console.log(stat["Slot Name"]);
					// console.log(
					// 	modSlotsMapping[this.currentSkill.itemName][slot]
					// );
					// console.log(
					// 	`Slot: ${slot}`,
					// 	`${this.currentSkill.variant} ${this.currentSkill.itemName}`,
					// 	`${stat.Variant}`,
					// 	`- Expertise: ${stat["Expertise Bonus"]}`
					// );
					// console.log(
					// 	this.currentSkill.filters[`mod${slot}`],
					// 	stat[`Mod ${slot}`]
					// );
					// if (
					// 	(`${this.currentSkill.variant} ${this.currentSkill.itemName}` ===
					// 		stat.Variant &&
					// 		stat["Slot Name"] ===
					// 			this.currentSkill[`slot${slot}`] &&
					// 		!stat["Stat"].toLowerCase().includes("pvp")) ||
					// 	(`${this.currentSkill.variant} ${this.currentSkill.itemName}` ===
					// 		stat.Variant &&
					// 		stat["Stat"] === "(Blank)" &&
					// 		!stat["Stat"].toLowerCase().includes("pvp"))
					// ) {
					// 	console.log(
					// 		slot,
					// 		stat.Variant,
					// 		stat["Slot Name"],
					// 		stat["Stat"]
					// 	);
					// }
					return (
						(`${this.currentSkill.variant} ${this.currentSkill.itemName}` ===
							stat.Variant &&
							stat["Slot Name"] ===
								this.currentSkill[`slot${slot}`] &&
							!stat["Stat"].toLowerCase().includes("pvp")) ||
						(`${this.currentSkill.variant} ${this.currentSkill.itemName}` ===
							stat.Variant &&
							stat["Stat"] === "(Blank)" &&
							// this.currentSkill.filters[`mod${slot}`] &&
							// stat[`Mod ${slot}`] && // removed as now using the mapping slot field instead of no value
							!stat["Stat"].toLowerCase().includes("pvp"))
					);
				});
				// console.log(mods);
				return mods;
			},
			initSkillData() {
				coreService.getSlotInit$(this.name).subscribe((ids) => {
					// console.log(`ids (${this.name}): `, ids);
					const splittedIdS = ids.split("-");
					const skillId = parseInt([splittedIdS[0]]);
					// console.log(`skillId (${this.name}): `, skillId);
					if (skillId) {
						// console.log("this.skillStats: ", this.skillStats);
						const fromUrlGear = new SkillBase(
							this.skillsList.find(
								(skill) =>
									parseInt(skill["Skill ID"]) ===
									parseInt(skillId)
							)
						);
						this.currentSkill = fromUrlGear;
						// console.log(this.currentSkill);
						this.currentSkill.stats = this.skillStats.filter(
							(stat) => {
								return (
									`${this.currentSkill.variant} ${this.currentSkill.itemName}` ===
										stat.Variant &&
									!stat.Stat.toLowerCase().includes("pvp") &&
									!stat.Stat.toLowerCase().includes(
										"conflict"
									)
								);
							}
						);
						// console.log("this.currentSkill: ", this.currentSkill);
						this.currentSkill.modOne = this.skillStats.find(
							(stat) => {
								return (
									parseInt(stat["Skill Stat ID"]) ===
									parseInt(splittedIdS[1])
								);
							}
						);
						this.currentSkill.modTwo = this.skillStats.find(
							(stat) => {
								return (
									parseInt(stat["Skill Stat ID"]) ===
									parseInt(splittedIdS[2])
								);
							}
						);
						this.currentSkill.modThree = this.skillStats.find(
							(stat) => {
								return (
									parseInt(stat["Skill Stat ID"]) ===
									parseInt(splittedIdS[3])
								);
							}
						);

						const stats = [
							null,
							"modOne",
							"modTwo",
							"modThree",
							"expertise",
						]; // 4, 5, 6
						const slots = [
							"ModOne",
							"ModTwo",
							"ModThree",
							"Expertise",
						];
						for (let idx = 1; idx < stats.length; idx++) {
							const stat = stats[idx];
							const slot = slots[idx - 1];
							const currentStatToUpdate = this.currentSkill[stat];

							var valueToImport = parseFloat(
								splittedIdS[3 + idx]
							);

							if (currentStatToUpdate && valueToImport > 0) {
								// Using Vue set because I want this to be reactive and
								// to trigger watch deep when it changes into StatInput
								Vue.set(
									currentStatToUpdate,
									`StatValue${slot}`,
									valueToImport
								);
							}
						}
					}
				});
			},
			initSkillsList() {
				// console.log(
				// 	`initSkillsList (${this.name}): `,
				// 	skillsData[this.name]
				// );
				skillsData["Skills"].then((values) => {
					this.skillsList = values;
				});
			},
			initSkillStats() {
				skillsData.SkillStats.then((res) => {
					this.skillStats = getUniqueObject(res);
					this.skillStats.sort((a, b) => (a.Stat > b.Stat ? 1 : -1));
				});
			},
			initSkillMods() {
				skillsData.SkillMods.then((res) => {
					this.skillMods = getUniqueObject(res);
				});
			},
			getMaxStatValue(value) {
				if (value.includes(`%`)) {
					// console.log("getMaxStatValue: ", value);
					return value.replace("%", "");
				}
				return value;
			},
			getStepStatValue(value) {
				if (!value.includes(`.`)) {
					// console.log("getMaxStatValue: ", value);
					return 1;
				}
				return 0.1;
			},
			clearSkillSlot() {
				this.currentSkill.name = null;
				this.currentSkill = null;
			},
			clearStatSlot(slotStat) {
				this.currentSkill[slotStat] = null;
			},
		},
		created() {
			this.typeToImgSrc = typeToImgSrc;
			this.initSkillsList();
			this.initSkillStats();
			this.initSkillMods();
			this.initSkillData();
		},
		watch: {
			currentSkill: {
				handler: function(val, oldVal) {
					// do not do anything no gear selected or item to un-equip (Blank)
					if (this.currentSkill) {
						const props = [
							{ modOne: "Stat" },
							{ modTwo: "Stat" },
							{ modThree: "Stat" },
						];
						props.forEach((prop) => {
							for (const property in prop) {
								if (
									val[property] &&
									val[property][prop[property]] === "(Blank)"
								) {
									val[property] = null;
								}
							}
						});
					}
					coreService.sendSlotData(this.name, val);
				},
				deep: true,
			},
		},
	};
</script>

<style lang="scss">
	.skill-container {
		height: 100%;
		color: white;
	}

	// attribute-label
	.attribute-value {
		margin-left: auto;
	}

	.clear-slot {
		color: red;
	}

	.clear-slot-stat {
		color: red;
	}
</style>
