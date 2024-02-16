<template>
	<div class="gear-container">
		<template v-if="!isGearSelected()">
			<span @click="openGearModal()" class="no-element-selected">
				<p>CHOOSE YOUR GEAR</p>
			</span>
		</template>
		<template v-else>
			<div
				class="slot-element gear-name"
				v-bind:class="[qualityToCSS(currentGear.quality)]"
				v-on:click="openGearModal()"
			>
				<div v-if="isNamedGear(currentGear)" class="named-container">
					<img :src="`./icons/named.png`" class="named-logo" />
					<span>
						{{ currentGear.itemName }} ({{ currentGear.brand }})
					</span>
				</div>
				<div v-else>{{ currentGear.itemName }}</div>
			</div>
			<!-- <div class="brand-name">{{ currentGear.brand }}</div> -->
			<div class="slot-element stat-edit core-attribute">
				<Dropdown
					placeholder="Core attribute"
					v-model="currentGear.core"
					:options="filterGearCores()"
				>
					<template #option="slotProps">
						<div class="attribute-container">
							<img
								class="attribute-image"
								v-bind:src="typeToImgSrc.core[slotProps.option.Type]"
							/>
							<span class="attribute-label">{{ slotProps.option.label }}</span>
							<span class="attribute-value">{{ slotProps.option.Max }}</span>
						</div>
					</template>
					<template #value="slotProps">
						<div v-if="slotProps.value" class="attribute-container">
							<img
								class="attribute-image"
								v-bind:src="typeToImgSrc.core[slotProps.value.Type]"
							/>
							<span class="attribute-label">{{ slotProps.value.label }}</span>
						</div>
						<span v-else>
							{{slotProps.placeholder}}
						</span>
					</template>
				</Dropdown>
				<StatInput
					v-if="currentGear.core"
					v-model="currentGear.core.StatValue"
					v-bind:max="currentGear.core.Max"
				></StatInput>
			</div>
			<!-- Core Two -->
			<div
				v-if="currentGear.coreTwo"
				class="slot-element stat-edit core-attribute"
			>
				<Dropdown
					placeholder="Core two attribute"
					v-model="currentGear.coreTwo"
					:options="[]"
				>
					<template #option="slotProps">
						<div class="attribute-container">
							<img
								class="attribute-image"
								v-bind:src="typeToImgSrc.core[slotProps.option.Type]"
							/>
							<span class="attribute-label">{{ slotProps.option.label }}</span>
							<span class="attribute-value">{{ slotProps.option.Max }}</span>
						</div>
					</template>
					<template #value="slotProps">
						<div v-if="slotProps.value" class="attribute-container">
							<img
								class="attribute-image"
								v-bind:src="typeToImgSrc.core[slotProps.value.Type]"
							/>
							<span class="attribute-label">{{ slotProps.value.label }}</span>
						</div>
					</template>
				</Dropdown>
				<StatInput
					v-if="currentGear.coreTwo"
					v-model="currentGear.coreTwo.StatValue"
					v-bind:max="currentGear.coreTwo.Max"
				></StatInput>
			</div>
			<!-- Core Three -->
			<div
				v-if="currentGear.coreThree"
				class="slot-element stat-edit core-attribute"
			>
				<Dropdown
					placeholder="Core three attribute"
					v-model="currentGear.coreThree"
					:options="[]"
				>
					<template #option="slotProps">
						<div class="attribute-container">
							<img
								class="attribute-image"
								v-bind:src="typeToImgSrc.core[slotProps.option.Type]"
							/>
							<span class="attribute-label">{{ slotProps.option.label }}</span>
							<span class="attribute-value">{{ slotProps.option.Max }}</span>
						</div>
					</template>
					<template #value="slotProps">
						<div v-if="slotProps.value" class="attribute-container">
							<img
								class="attribute-image"
								v-bind:src="typeToImgSrc.core[slotProps.value.Type]"
							/>
							<span class="attribute-label">{{ slotProps.value.label }}</span>
						</div>
					</template>
				</Dropdown>
				<StatInput
					v-if="currentGear.coreThree"
					v-model="currentGear.coreThree.StatValue"
					v-bind:max="currentGear.coreThree.Max"
				></StatInput>
			</div>
			<!-- Attribute 3 -->
			<div
				class="slot-element stat-edit attribute-three"
				v-if="currentGear.filters.attributeThree"
			>
				<Dropdown
					placeholder="Minor attribute Three"
					:options="
						filterGearAttributes(
							gearAttributes,
							undefined,
							currentGear.filters.attributeThree
						)
					"
					v-model="currentGear.attributeThree"
					optionLabel="Stat"
				>
					<template #option="slotProps">
						<div class="attribute-container">
							<img
								class="attribute-image"
								v-bind:src="typeToImgSrc.attribute[slotProps.option.Type]"
							/>
							<span class="attribute-label">{{ slotProps.option.Stat }}</span>
							<span class="attribute-value">{{ slotProps.option.Max }}</span>
						</div>
					</template>
					<template #value="slotProps">
						<div v-if="slotProps.value" class="attribute-container">
							<img
								class="attribute-image"
								v-bind:src="typeToImgSrc.attribute[slotProps.value.Type]"
							/>
							<span class="attribute-label">{{ slotProps.value.Stat }}</span>
						</div>
					</template>
				</Dropdown>
				<StatInput
					v-if="currentGear.attributeThree"
					v-model="currentGear.attributeThree.StatValue"
					v-bind:max="currentGear.attributeThree.Max"
				></StatInput>
			</div>
			<!-- Attribute 1 -->
			<div
				class="slot-element stat-edit attribute-one"
				v-if="currentGear.filters.attributeOne"
			>
				<Dropdown
					placeholder="Minor attribute 1"
					:options="
						filterGearAttributes(
							gearAttributes,
							currentGear.attributeTwo,
							currentGear.filters.attributeOne
						)
					"
					v-model="currentGear.attributeOne"
					optionLabel="Stat"
				>
					<template #option="slotProps">
						<div class="attribute-container">
							<img
								class="attribute-image"
								v-bind:src="typeToImgSrc.attribute[slotProps.option.Type]"
							/>
							<span class="attribute-label">{{ slotProps.option.Stat }}</span>
							<span class="attribute-value">{{ slotProps.option.Max }}</span>
						</div>
					</template>
					<template #value="slotProps">
						<div v-if="slotProps.value" class="attribute-container">
							<img
								class="attribute-image"
								v-bind:src="typeToImgSrc.attribute[slotProps.value.Type]"
							/>
							<span class="attribute-label">{{ slotProps.value.Stat }}</span>
						</div>
					</template>
				</Dropdown>
				<StatInput
					v-if="currentGear.attributeOne"
					v-model="currentGear.attributeOne.StatValue"
					v-bind:max="currentGear.attributeOne.Max"
				></StatInput>
			</div>
			<!-- Attribute 2 -->
			<div
				class="slot-element stat-edit attribute-two"
				v-if="currentGear.filters.attributeTwo"
			>
				<Dropdown
					placeholder="Minor attribute 2"
					:options="
						filterGearAttributes(
							gearAttributes,
							currentGear.attributeOne,
							currentGear.filters.attributeTwo
						)
					"
					v-model="currentGear.attributeTwo"
					optionLabel="Stat"
				>
					<template #option="slotProps">
						<div class="attribute-container">
							<img
								class="attribute-image"
								v-bind:src="typeToImgSrc.attribute[slotProps.option.Type]"
							/>
							<span class="attribute-label">{{ slotProps.option.Stat }}</span>
							<span class="attribute-value">{{ slotProps.option.Max }}</span>
						</div>
					</template>
					<template #value="slotProps">
						<div v-if="slotProps.value" class="attribute-container">
							<img
								class="attribute-image"
								v-bind:src="typeToImgSrc.attribute[slotProps.value.Type]"
							/>
							<span class="attribute-label">{{ slotProps.value.Stat }}</span>
						</div>
					</template>
				</Dropdown>
				<StatInput
					v-if="currentGear.attributeTwo"
					v-model="currentGear.attributeTwo.StatValue"
					v-bind:max="currentGear.attributeTwo.Max"
				></StatInput>
			</div>
			<!-- Mod -->
			<div
				class="slot-element stat-edit mod-slot"
				v-if="currentGear.filters.mod"
			>
				<Dropdown
					placeholder="Mod"
					:options="gearMods"
					v-model="currentGear.mod"
					optionLabel="Stat"
				>
					<template #option="slotProps">
						<div class="attribute-container">
							<img
								class="attribute-image"
								v-bind:src="typeToImgSrc.mod[slotProps.option.Type]"
							/>
							<span class="attribute-label">{{ slotProps.option.Stat }}</span>
							<span class="attribute-value">{{ slotProps.option.Max }}</span>
						</div>
					</template>
					<template #value="slotProps">
						<div v-if="slotProps.value" class="attribute-container">
							<img
								class="attribute-image"
								v-bind:src="typeToImgSrc.mod[slotProps.value.Type]"
							/>
							<span class="attribute-label">{{ slotProps.value.Stat }}</span>
						</div>
					</template>
				</Dropdown>
				<StatInput
					v-if="currentGear.mod"
					v-model="currentGear.mod.StatValue"
					v-bind:max="currentGear.mod.Max"
				></StatInput>
			</div>
			<!-- Mod 2 -->
			<div
				class="slot-element stat-edit mod-slot"
				v-if="currentGear.filters.modTwo"
			>
				<Dropdown
					placeholder="Mod 2"
					:options="gearMods"
					v-model="currentGear.modTwo"
					optionLabel="Stat"
				>
					<template #option="slotProps">
						<div class="attribute-container">
							<img
								class="attribute-image"
								v-bind:src="typeToImgSrc.mod[slotProps.option.Type]"
							/>
							<span class="attribute-label">{{ slotProps.option.Stat }}</span>
							<span class="attribute-value">{{ slotProps.option.Max }}</span>
						</div>
					</template>
					<template #value="slotProps">
						<div v-if="slotProps.value" class="attribute-container">
							<img
								class="attribute-image"
								v-bind:src="typeToImgSrc.mod[slotProps.value.Type]"
							/>
							<span class="attribute-label">{{ slotProps.value.Stat }}</span>
						</div>
					</template>
				</Dropdown>
				<StatInput
					v-if="currentGear.modTwo"
					v-model="currentGear.modTwo.StatValueModTwo"
					v-bind:max="currentGear.modTwo.Max"
				></StatInput>
			</div>
			<div
				class="slot-element talent"
				v-if="gearTalents.length > 0 || this.currentGear.talent"
			>
				<Dropdown
					placeholder="Talent"
					:options="filterGearTalents(gearTalents)"
					v-model="currentGear.talent"
					optionLabel="Talent"
					:class="currentGear.talent ? 'tool' : ''"
					:data-tip="
						currentGear.talent && currentGear.talent.Desc
						"
				>
					<template #option="slotProps">
						<div class="talent-info-container">
							<span class="talent-label">{{ slotProps.option.Talent }}</span>
							<span class="talent-desc">{{ slotProps.option.Desc }}</span>
						</div>
					</template>
					<template #value="slotProps">
						<div v-if="slotProps.value">
							<div class="talent-info-container label-selected">
								<span class="talent-label">{{ slotProps.value.Talent }}</span>
							</div>
						</div>
						<span v-else>
							{{slotProps.placeholder}}
						</span>
					</template>
				</Dropdown>
			</div>
			<div
				v-if="whereIsAvailable(currentGear)"
				style="text-align: right"
				class="slot-element"
			>
				Sold at <b>{{ whereIsAvailable(currentGear) }}</b>
			</div>
		</template>
	</div>
</template>

<script>
	import { openGearModal } from "../utils/modalService";
	import { GearBase } from "../utils/classes";
	import {
		typeToImgSrc,
		coreAttributes,
		qualityToCss,
		getUniqueObject,
	} from "../utils/utils";
	import { gearData, VendorData } from "../utils/dataImporter";
	import StatInput from "./StatInput.vue";
	import Vue from "vue";
	import coreService from "../utils/coreService";

	export default {
		name: "GearSlot",
		components: { StatInput },
		props: {
			name: undefined,
			init: null,
		},
		data() {
			return {
				gearList: [],
				currentGear: new GearBase(),
				coreAttributes: [],
				typeToImgSrc: null,
				gearMods: null,
				gearAttributes: null,
				gearTalents: null,
				allTalents: null,
				allGearAttributes: null,
				vendorGear: [],
				isMementoSelected: false,
			};
		},
		methods: {
			qualityToCSS(quality) {
				return qualityToCss[quality];
			},
			isGearSelected() {
				return this.currentGear && this.currentGear.itemName;
			},
			onModalClose(data) {
				if (!data) {
					this.currentGear = undefined;
					return;
				}
				this.currentGear = new GearBase(data);
				this.currentGear.core = this.coreAttributes.find(
					(attribute) =>
						attribute.label ===
						this.currentGear.filters.core
				);
				if (data.coreTwo !== null) {
					this.currentGear.coreTwo = this.coreAttributes.find(
						(attribute) =>
							attribute.label ===
							this.currentGear.filters.coreTwo
					);
				}
				if (data.coreThree !== null) {
					this.currentGear.coreThree = this.coreAttributes.find(
						(attribute) =>
							attribute.label ===
							this.currentGear.filters.coreThree
					);
				}
				this.currentGear.attributeOne = this.allGearAttributes.find(
					(attribute) =>
						attribute.Stat ===
						this.currentGear.filters.attributeOne
				);
				this.currentGear.attributeTwo = this.allGearAttributes.find(
					(attribute) =>
						attribute.Stat ===
						this.currentGear.filters.attributeTwo
				);
				this.currentGear.attributeThree = this.allGearAttributes.find(
					(attribute) =>
						attribute.Stat ===
						this.currentGear.filters.attributeThree
				);
				if (data.Talent !== null) {
					this.currentGear.talent = this.allTalents.find(
						(talent) => {
							return (
								talent.Talent ===
								this.currentGear.filters.talent
							);
						}
					);
				}
			},
			openGearModal() {
				openGearModal(this.gearList, this.name, this.onModalClose);
			},
			initGearMods() {
				gearData.GearMods.then((res) => {
					this.gearMods = getUniqueObject(res);
					this.gearMods.sort((a, b) => (a.Stat > b.Stat ? 1 : -1));

					if (this.gearMods.length) {
						// push a dummy attribute onto the front of the list
						this.gearMods.unshift({
							"Quality": "A",
							"Type": "B",
							"Stat": "(Blank)",
							"Max": "",
							"index": -1
						});
					}
				});
			},
			initGearAttributes() {
				gearData.Attributes.then((attributes) => {
					this.allGearAttributes = getUniqueObject(attributes);
					this.gearAttributes = this.allGearAttributes.filter(
						(attribute) => {
							return attribute.Quality === "A";
						}
					);
					this.gearAttributes.sort((a, b) =>
						a.Stat > b.Stat ? 1 : -1
					);

					if (this.gearAttributes.length) {
						// push a dummy attribute onto the front of the list
						this.gearAttributes.unshift({
							"Quality": "A",
							"Type": "B",
							"Stat": "(Blank)",
							"Max":"", 
							"index": -1
						});
					}
				});
			},
			initGearTalentsList() {
				// At the moment I don't need to divide the talent by gear
				// So, no separate files
				gearData.GearTalents.then((talents) => {
					this.allTalents = talents;
					this.gearTalents = talents
						.filter((talent) => {
							return (
								talent.Slot === this.name &&
								talent.Quality === "A"
							);
						})
						.sort(function(a, b) {
							if (a.Talent < b.Talent) {
								return -1;
							}
							if (a.Talent > b.Talent) {
								return 1;
							}
							return 0;
						});

					if (this.gearTalents.length) {
						// push a dummy talent onto the front of the list
						this.gearTalents.unshift({
							"Quality": "A",
							"Slot": this.name,
							"Talent": "(Blank)",
							"Desc": "",
							"Attr.": "",
							"Val": "",
							"index": -1
						});
					}
				});
			},
			filterGearCores() {
				if (this.currentGear.quality === 'Exotic') {
					return []
				}
				if (this.currentGear.itemName === "Picaro's Holster") {
					return this.coreAttributes.filter((core) => { 
						return (core.Type !== 'O');
					});
				}
				return this.coreAttributes;
			},
			filterGearAttributes(attributes, otherAttribute, filter) {
				// TODO  Clean code like I did for filterWeaponModsByType();
				switch (this.currentGear.quality) {
					case "Exotic": {
						attributes = [];
						break;
					}
					case "Named":
						// If it is longer than 1 is clearly a name on not just A,O or U
						if (filter.length > 1) {
							attributes = [];
						}
						break;
					case "Gearset":
						break;
					default:
						break;
				}
				return attributes.filter((attribute) => {
					return !otherAttribute
						? true
						: otherAttribute.index !== attribute.index;
				});
			},
			filterGearTalents(talents) {
				const result =
					!this.isNamedTalent(this.currentGear.filters) &&
					this.currentGear.quality !== "Exotic"
						? talents
						: [];
				return result;
			},
			isNamedTalent(currentGearFilters) {
				return currentGearFilters.talent !== "A";
			},
			isNamedGear() {
				return this.currentGear.quality === "Named";
			},
			initGearData() {
				coreService.getSlotInit$(this.name).subscribe((ids) => {
					const splittedIdS = ids.split("-");
					const gearId = parseInt([splittedIdS[0]]);
					if (gearId) {
						const fromUrlGear = new GearBase(
							this.gearList.find((gear) => gear.index === gearId)
						);
						this.currentGear = fromUrlGear;
						this.currentGear.attributeOne = this.allGearAttributes.find(
							(attribute) =>
								attribute.index === parseInt(splittedIdS[1])
						);
						this.currentGear.attributeTwo = this.allGearAttributes.find(
							(attribute) =>
								attribute.index === parseInt(splittedIdS[2])
						);
						// if (this.currentGear.itemName === "Memento") {
						if (
							this.currentGear.brand === "Exotic" &&
							this.currentGear.quality === "Exotic" &&
							this.currentGear.id === 46
						) {
							/**
							 * Only perform if Memento (id = 46)
							 */
							this.currentGear.core = this.coreAttributes.find(
								(attribute) => attribute.index === parseInt(1)
							);
							this.currentGear.coreTwo = this.coreAttributes.find(
								(attribute) => attribute.index === parseInt(2)
							);
							this.currentGear.coreThree = this.coreAttributes.find(
								(attribute) => attribute.index === parseInt(0)
							);
							// } else if (this.currentGear.itemName === "NinjaBike") {
						} else if (
							this.currentGear.brand === "Exotic" &&
							this.currentGear.quality === "Exotic" &&
							this.currentGear.id === 55
						) {
							/**
							 * Only perform if NinjaBike (id = 55)
							 */
							this.currentGear.core = this.coreAttributes.find(
								(attribute) => attribute.index === parseInt(1)
							);
							this.currentGear.coreTwo = this.coreAttributes.find(
								(attribute) => attribute.index === parseInt(2)
							);
							this.currentGear.coreThree = this.coreAttributes.find(
								(attribute) => attribute.index === parseInt(0)
							);
						} else if (this.currentGear.itemName === "Ammo Dump") {
							/**
							 * Only perform if Ammo Dump (id = 8, index 23)
							 */
							this.currentGear.attributeThree = this.allGearAttributes.find(
								(attribute) =>
									attribute.Stat === "Ammo Capacity"
							);
							// TODO Break this out as this is not specific to this gear
							this.currentGear.core = this.coreAttributes.find(
								(attribute) =>
									attribute.index === parseInt(splittedIdS[3])
							);
						} else if (this.currentGear.itemName === "Claws Out") {
							/**
							 * Only perform if Claws Out (id = 34, index = 18)
							 */
							this.currentGear.attributeTwo = this.allGearAttributes.find(
								(attribute) => attribute.Stat === "Melee Damage"
							);
							this.currentGear.attributeThree = this.allGearAttributes.find(
								(attribute) =>
									attribute.Stat === "Pistol Damage"
							);
							// TODO Break this out as this is not specific to this gear
							this.currentGear.core = this.coreAttributes.find(
								(attribute) =>
									attribute.index === parseInt(splittedIdS[3])
							);
						} else {
							this.currentGear.core = this.coreAttributes.find(
								(attribute) =>
									attribute.index === parseInt(splittedIdS[3])
							);
						}
						this.currentGear.mod = this.gearMods.find(
							(mod) => mod.index === parseInt(splittedIdS[4])
						);
						this.currentGear.modTwo = this.gearMods.find(
							(mod) => mod.index === parseInt(splittedIdS[14])
						);
						this.currentGear.talent = this.allTalents.find(
							(talent) =>
								talent.index === parseInt(splittedIdS[5])
						);

						const stats = [
							null,
							"core",
							"attributeOne",
							"attributeTwo",
							"attributeThree",
							"mod",
							"coreTwo",
							"coreThree",
							"modTwo",
						];
						for (let idx = 1; idx < stats.length; idx++) {
							const stat = stats[idx];
							const currentStatToUpdate = this.currentGear[stat];

							var valueToImport = parseFloat(
								splittedIdS[5 + idx]
							);
							if (stat === "mod") {
								valueToImport = parseFloat(
									splittedIdS[4 + idx]
								);
							}
							if (stat === "coreTwo" || stat === "coreThree") {
								valueToImport = parseFloat(
									splittedIdS[7 + idx]
								);
							}
							if (stat === "modTwo") {
								valueToImport = parseFloat(
									splittedIdS[8 + idx]
								);

								if (currentStatToUpdate && valueToImport > 0) {
									// Using Vue set because I want this to be reactive and
									// to trigger watch deep when it changes into StatInput
									Vue.set(
										currentStatToUpdate,
										"StatValueModTwo",
										valueToImport
									);
								}
							} else {
								if (currentStatToUpdate && valueToImport > 0) {
									// Using Vue set because I want this to be reactive and
									// to trigger watch deep when it changes into StatInput
									Vue.set(
										currentStatToUpdate,
										"StatValue",
										valueToImport
									);
								}
							}
						}
					}
				});
			},
			initWearableList() {
				gearData[this.name].then((values) => {
					this.gearList = values;
				});
			},
			whereIsAvailable(gear) {
				const found = this.vendorGear.find(
					(item) => item?.Name === gear.itemName
				);
				return found?.Vendor;
			},
			clearGearSlot() {
				this.currentGear.name = null;
				this.currentGear = null;
			},
			clearStatSlot(slotStat) {
				// do not clear certain stats from exotics and named
				if (
					(this.currentGear.quality === "Exotic" &&
						slotStat !== "mod") ||
					(this.currentGear.quality === "Named" &&
						slotStat === "talent")
				)
					return;

				this.currentGear[slotStat] = null;
			},
		},
		created() {
			this.coreAttributes = getUniqueObject(coreAttributes);
			this.typeToImgSrc = typeToImgSrc;
			this.initWearableList();
			this.initGearMods();
			this.initGearAttributes();
			this.initGearTalentsList();
			this.initGearData();
			VendorData.then((vendorGear) => {
				this.vendorGear = vendorGear.Gear[this.name];
			});
		},
		watch: {
			currentGear: {
				handler: function(val, oldVal) {
					// do not do anything no gear selected or item to un-equip (Blank)
					if (this.currentGear) {
						const props = [
							{ attributeOne: "Stat" },
							{ attributeTwo: "Stat" },
							{ attributeThree: "Stat" },
							{ mod: "Stat" },
							{ modTwo: "Stat" },
							{ talent: "Talent" },
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

<style lang="scss" scoped>
	.gear-container {
		height: 100%;
		color: white;
	}

	.talent-info-container {
		display: flex;
		flex-direction: column;
	}

	.talent-label {
		white-space: break-spaces;
	}
	
	.talent-desc {
		white-space: break-spaces;
	}
	
	.attribute-container {
		display:flex;
		align-items: center;
	}

	.attribute-label {
		white-space: normal;
	}

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
