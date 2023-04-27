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
						label="Mod Attribute"
					>
						<template v-slot:option="option">
							<!-- <img
								class="attribute-image"
								v-bind:src="typeToImgSrc.mod[option.Type]"
							/> -->
							<span class="attribute-label">{{
								`${option["Mod Attribute"]}${
									option["Specialization Mod"]
										? ` [${option["Specialization Mod"]}]`
										: ""
								}`
							}}</span>
							<span class="attribute-value">{{
								option[`Max`]
							}}</span>
						</template>
						<template #selected-option="option">
							<!-- <img
								class="attribute-image"
								v-bind:src="typeToImgSrc.mod[option.Type]"
							/> -->
							<span class="attribute-label">{{
								`${option["Mod Attribute"]}${
									option["Specialization Mod"]
										? ` [${option["Specialization Mod"]}]`
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
							getMaxStatValue(currentSkill[`mod${slot}`][`Max`])
						"
						v-bind:step="
							getStepStatValue(currentSkill[`mod${slot}`][`Max`])
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
				debug: true,
				currentSkill: new SkillBase(),
				typeToImgSrc: null,
				skillsList: [],
				skillMods: null,
				skillStats: null,
				modSlots: modSlots,
			};
		},
		created() {
			this.typeToImgSrc = typeToImgSrc;
			this.initSkillsList();
			this.initSkillStats();
			this.initSkillMods();
			this.initSkillSlot();
		},
		methods: {
			initSkillsList() {
				skillsData.Skills.then((values) => {
					this.skillsList = values;
				});
			},
			initSkillStats() {
				skillsData.SkillStats.then((values) => {
					this.skillStats = getUniqueObject(values);
					this.skillStats.sort((a, b) => (a.Stat > b.Stat ? 1 : -1));
				});
			},
			initSkillMods() {
				skillsData.SkillMods.then((res) => {
					this.skillMods = getUniqueObject(res);
					this.skillMods.sort((a, b) =>
						a["Mod Attribute"] > b["Mod Attribute"] ? 1 : -1
					);
				});
			},
			qualityToCSS(quality) {
				return qualityToCss[quality];
			},
			getModSlotName(slot) {
				if (this.currentSkill[`slot${slot}`]) {
					return this.currentSkill[`slot${slot}`];
				}
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
				if (this.debug) {
					console.groupCollapsed(
						`%conModalClose:`,
						`background: #222; color: #bada55`
					);
				}
				this.currentSkill = new SkillBase(data);
				if (this.currentSkill.itemName === "(Blank)") {
					this.currentSkill = null;
					return;
				}
				this.currentSkill.stats = this.skillStats.filter((stat) => {
					return (
						`${this.currentSkill.variant} ${this.currentSkill.itemName}` ===
							stat["Skill Variant Name"] &&
						stat.Stat !== "(Blank)"
					);
				});
				if (this.debug) {
					console.warn(`(currentSkill) :`, this.currentSkill);
					console.warn(`(skillStats) :`, this.currentSkill.stats);
				}
				console.groupEnd();
			},
			openSkillsModal() {
				openSkillsModal(this.skillsList, this.name, this.onModalClose);
			},
			filterSkillMods(slot) {
				if (this.debug) {
					console.groupCollapsed(
						`%cfilterSkillMods(${slot}):`,
						`background: #222; color: #bada55`
					);
					console.log(`Current Skill:`, this.currentSkill);
				}
				const mods = this.skillMods.filter((stat) => {
					return (
						`${this.currentSkill.variant} ${this.currentSkill.itemName}` ===
							stat["Skill Variant Name"] &&
						(stat["Skill Mod Slot"] ===
							this.currentSkill[`slot${slot}`] ||
							stat["Skill Mod Slot"]
								.toLowerCase()
								.includes("all"))
					);
				});
				if (this.debug) {
					console.warn(`(mods) :`, mods);
					console.groupEnd();
				}
				return mods;
			},
			initSkillSlot() {
				coreService.getSlotInit$(this.name).subscribe((ids) => {
					if (this.debug) {
						console.groupCollapsed(
							`%cinitSkillSlot (${this.name}):`,
							`background: #222; color: #bada55`
						);
					}
					const splittedIdS = ids.split("-");
					const skillId = parseInt([splittedIdS[0]]);
					if (skillId) {
						const fromUrlGear = new SkillBase(
							this.skillsList.find(
								(skill) =>
									parseInt(skill["Skill ID"]) ===
									parseInt(skillId)
							)
						);
						this.currentSkill = fromUrlGear;
						if (this.debug) {
							console.warn(`(currentSkill) :`, this.currentSkill);
						}
						this.currentSkill.stats = this.skillStats.filter(
							(stat) => {
								return (
									`${this.currentSkill.variant} ${this.currentSkill.itemName}` ===
										stat["Skill Variant Name"] &&
									stat.Stat !== "(Blank)"
								);
							}
						);
						if (this.debug) {
							console.warn(
								`(currentSkill.stats) :`,
								this.currentSkill.stats
							);
						}
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
						if (this.debug) {
							console.warn(
								`(currentSkill Mods) :`,
								`modOne: ${this.currentSkill.modOne}`,
								`modTwo: ${this.currentSkill.modTwo}`,
								`modThree: ${this.currentSkill.modThree}`
							);
						}

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

							if (this.debug) {
								console.warn(
									`stat:`,
									stat,
									`slot:`,
									slot,
									`currentStatToUpdate:`,
									currentStatToUpdate,
									`StatValue${slot}`,
									`valueToImport: ${valueToImport}`
								);
							}
							if (currentStatToUpdate && valueToImport > 0) {
								if (this.debug) {
									console.warn(`Sending Update!`);
								}
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
					if (this.debug) {
						console.warn(`(END) :`);
						console.groupEnd();
					}
				});
			},
			getMaxStatValue(value) {
				if (value.includes(`%`)) {
					return value.replace("%", "");
				}
				return value;
			},
			getStepStatValue(value) {
				if (!value.includes(`.`)) {
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
		watch: {
			currentSkill: {
				handler: function(val, oldVal) {
					if (this.debug) {
						console.groupCollapsed(
							`%cwatching->currentSkill (${this.name} / ${this.currentSkill.variant} ${this.currentSkill.itemName}):`,
							`background: #222; color: #bada55`
						);
						console.warn(`this.currentSkill:`, this.currentSkill);
					}
					// do not do anything no gear selected or item to un-equip (Blank)
					if (this.currentSkill) {
						const slots = [
							{ modOne: "Mod Attribute" },
							{ modTwo: "Mod Attribute" },
							{ modThree: "Mod Attribute" },
						];
						slots.forEach((modSlot) => {
							console.warn(`modSlot:`, modSlot);
							for (const property in modSlot) {
								console.warn(`property:`, property);
								if (
									val[property] &&
									val[property][modSlot[property]] ===
										"(Blank)"
								) {
									val[property] = null;
								}
							}
						});
					}
					if (this.debug) {
						console.warn(`sending val:`, val);
					}
					coreService.sendSlotData(this.name, val);
					if (this.debug) {
						console.warn(`(END) :`);
						console.groupEnd();
					}
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
