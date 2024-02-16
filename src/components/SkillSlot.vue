<template>
	<div class="skill-container">
		<template v-if="!isSkillSelected()">
			<img :src="`./icons/skills/skills.png`" alt="" class="img-slot-bg" />
			<span @click="openSkillsModal()" class="no-element-selected">
				<p>CHOOSE YOUR SKILL</p>
			</span>
		</template>
		<template v-else>
			<img :src="getSkillIcon(currentSkill)" alt="" class="img-slot-bg" />
			<div
				class="slot-element skill-name"
				v-bind:class="[qualityToCSS(currentSkill.quality)]"
				v-on:click="openSkillsModal()"
			>
				<div>{{ currentSkill.variant }} {{ currentSkill.itemName }}</div>
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
			>
				<div
					class="slot-element stat-edit"
					v-if="currentSkill.filters[`mod${slot}`] && getModSlotName(slot)"
					v-bind:key="id"
				>
					<Dropdown
						:placeholder="getModSlotName(slot)"
						:options="filterSkillMods(slot)"
						v-model="currentSkill[`mod${slot}`]"
						optionLabel="Mod Attribute"
					>
						<template #option="slotProps">
							<div class="attribute-container">
								<!-- <img
									class="attribute-image"
									v-bind:src="typeToImgSrc.mod[option.Type]"
								/> -->
								<span class="attribute-label">{{
									`${slotProps.option["Mod Attribute"]}${
										slotProps.option["Specialization Mod"]
											? ` [${slotProps.option["Specialization Mod"]}]`
											: ""
									}`
								}}</span>
								<span class="attribute-value">{{ slotProps.option[`Max`] }}</span>
							</div>
						</template>
						<template #value="slotProps">
							<div v-if="slotProps.value" class="attribute-container">
								<!-- <img
									class="attribute-image"
									v-bind:src="typeToImgSrc.mod[option.Type]"
								/> -->
								<span class="attribute-label">{{
									`${slotProps.value["Mod Attribute"]}${
										slotProps.value["Specialization Mod"]
											? ` [${slotProps.value["Specialization Mod"]}]`
											: ""
									}`
								}}</span>
							</div>
						</template>
					</Dropdown>
					<StatInput
						v-if="currentSkill[`mod${slot}`]"
						v-model="currentSkill[`mod${slot}`][`StatValueMod${slot}`]"
						v-bind:max="currentSkill[`mod${slot}`][`Max`]"
						v-bind:step="getStepStatValue(currentSkill[`mod${slot}`][`Mod Attribute`])"
					></StatInput>
				</div>
			</template>
		</template>
	</div>
</template>

<script>
	import { openSkillsModal } from "../utils/modalService";
	import { SkillBase } from "../utils/classes";
	import { typeToImgSrc, qualityToCss, getUniqueObject } from "../utils/utils";
	import { skillsData } from "../utils/dataImporter";
	import StatInput from "./StatInput.vue";
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
				debug: false,
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

					if (this.skillMods.length) {
						// push a dummy mod onto the front of the list
						this.skillMods.unshift({
							"Skill Mod ID": "-1",
							"Skill Type": "A",
							"Skill Mod Slot": "A",
							"Mod Attribute": "(Blank)",
							"Specialization Mod": "",
							Max: "",
							index: -1,
						});
					}
				});
			},
			getSkillIcon(skill) {
				return skill.icon ? `./icons/skills/${skill.icon}` : "";
			},
			qualityToCSS(quality) {
				// return qualityToCss[quality];
				return "skill";
			},
			getModSlotName(slot) {
				if (this.currentSkill[`slot${slot}`]) {
					return this.currentSkill[`slot${slot}`];
				}
			},
			isSkillSelected() {
				return this.currentSkill && this.currentSkill.itemName;
			},
			onModalClose(data) {
				if (!data) {
					this.currentSkill = undefined;
					return;
				}
				if (this.debug) {
					console.groupCollapsed(
						`%conModalClose:`,
						`background: #222; color: #bada55`
					);
				}
				this.currentSkill = new SkillBase(data);
				this.currentSkill.stats = this.skillStats.filter((stat) => {
					return (
						`${this.currentSkill.variant} ${this.currentSkill.itemName}` ===
							stat["Skill Variant Name"] && stat.Stat !== "(Blank)"
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
				const mods = this.skillMods.filter((mod) => {
					return (
						mod["Skill Mod Slot"] === "A" ||
						(mod["Skill Type"] === this.currentSkill.itemName &&
						mod["Skill Mod Slot"] === this.currentSkill[`slot${slot}`])
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
								(skill) => parseInt(skill["Skill ID"]) === parseInt(skillId)
							)
						);
						this.currentSkill = fromUrlGear;
						if (this.debug) {
							console.warn(`(currentSkill) :`, this.currentSkill);
						}
						this.currentSkill.stats = this.skillStats.filter((stat) => {
							return (
								`${this.currentSkill.variant} ${this.currentSkill.itemName}` ===
									stat["Skill Variant Name"] && stat.Stat !== "(Blank)"
							);
						});
						if (this.debug) {
							console.warn(`(currentSkill.stats) :`, this.currentSkill.stats);
						}
						this.currentSkill.modOne = this.skillMods.find((mod) => {
							return parseInt(mod["Skill Mod ID"]) === parseInt(splittedIdS[1]);
						});
						this.currentSkill.modTwo = this.skillMods.find((mod) => {
							return parseInt(mod["Skill Mod ID"]) === parseInt(splittedIdS[2]);
						});
						this.currentSkill.modThree = this.skillMods.find((mod) => {
							return parseInt(mod["Skill Mod ID"]) === parseInt(splittedIdS[3]);
						});
						if (this.debug) {
							console.warn(
								`(currentSkill Mods) :`,
								`modOne: ${this.currentSkill.modOne}`,
								`modTwo: ${this.currentSkill.modTwo}`,
								`modThree: ${this.currentSkill.modThree}`
							);
						}

						const stats = [null, "modOne", "modTwo", "modThree", "expertise"]; // 4, 5, 6
						const slots = ["ModOne", "ModTwo", "ModThree", "Expertise"];
						for (let idx = 1; idx < stats.length; idx++) {
							const stat = stats[idx];
							const slot = slots[idx - 1];
							const currentStatToUpdate = this.currentSkill[stat];

							var valueToImport = parseFloat(splittedIdS[3 + idx]);

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
								Vue.set(currentStatToUpdate, `StatValue${slot}`, valueToImport);
							}
						}
					}
					if (this.debug) {
						console.warn(`(END) :`);
						console.groupEnd();
					}
				});
			},
			getStepStatValue(attribute) {
				// mod attributes with any of these words are not percentages
				const words = ['Ammo','Charges','Targets','Mines','Bombs'];
				return words.some(word => attribute.includes(word)) ? 1 : 0.1;
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
							if (this.debug) console.warn(`modSlot:`, modSlot);
							for (const property in modSlot) {
								if (this.debug) console.warn(`property:`, property);
								if (
									val[property] &&
									val[property][modSlot[property]] === "(Blank)"
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

<style lang="scss" scoped>
	.skill-container {
		height: 100%;
		color: white;
	}

	span.expertise {
		flex: 3;
		padding: 4px 8px;
		border-bottom: 1px solid white;
	}
	.skill {
		background: #9dacb3;
	}

	.attribute-container {
		display:flex;
		align-items: center;
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
