<template>
	<div class="weapon-container">
		<template v-if="!isWeaponSelected()">
			<span @click="openWeaponsModal()" class="no-element-selected">
				<p>CHOOSE YOUR WEAPON</p>
			</span>
		</template>
		<template v-else>
			<div
				class="slot-element weapon-name"
				v-bind:class="[qualityToCSS(currentWeapon.quality)]"
				v-on:click="openWeaponsModal()"
			>
				{{ currentWeapon.name }}
				<template
					v-if="isExotic(currentWeapon) || isNamed(currentWeapon)"
					>({{ currentWeapon.variant }})</template
				>
			</div>
			<div class="slot-element stat-edit">
				<span class="expertise">Expertise</span>
				<ExpertiseInput
					v-if="currentWeapon['expertise']"
					v-model="currentWeapon['expertise'].StatValue"
					v-bind:max="currentWeapon['expertise'].max"
				></ExpertiseInput>
			</div>
			<div class="slot-element stat-edit">
				<span class="core">{{ currentWeapon.filters["core 1"] }}</span>
				<StatInput
					v-if="currentWeapon['core 1']"
					v-model="currentWeapon['core 1'].StatValue"
					v-bind:max="currentWeapon['core 1'].max"
				></StatInput>
			</div>
			<div class="slot-element stat-edit">
				<span
					v-if="!currentWeapon.filters['core 2']"
					class="core"
					style="opacity: 0.5"
					>Core 2 is not available on this weapon</span
				>
				<template v-if="currentWeapon.filters['core 2']">
					<span class="core">{{
						currentWeapon.filters["core 2"]
					}}</span>
					<StatInput
						v-if="currentWeapon['core 2']"
						v-model="currentWeapon['core 2'].StatValue"
						v-bind:max="currentWeapon['core 2'].max"
					></StatInput>
				</template>
			</div>
			<div class="slot-element stat-edit attribute-one">
				<v-select
					placeholder="Attribute"
					:clearable="false"
					:options="weaponAttributes"
					v-model="currentWeapon['attribute 1']"
					label="Stat"
				>
					<template v-slot:option="option">
						<span class="attribute-label">{{ option.Stat }}</span>
						<span class="attribute-value">{{ option.Max }}</span>
					</template>
					<template #selected-option="option">
						<span class="attribute-label">{{ option.Stat }}</span>
						<!-- <span class="attribute-value">{{option.Max}}</span> -->
					</template>
				</v-select>
				<StatInput
					v-if="currentWeapon['attribute 1']"
					v-model="currentWeapon['attribute 1'].StatValue"
					v-bind:max="currentWeapon['attribute 1'].Max"
				></StatInput>
			</div>
			<div class="slot-element talent">
				<v-select
					placeholder="Talent"
					:clearable="false"
					:options="filterTalents(weaponTalents)"
					v-model="currentWeapon['talent']"
					label="Name"
					:class="currentWeapon.talent ? 'tool' : ''"
					:data-tip="
						currentWeapon.talent && currentWeapon.talent.Desc
					"
				>
					<template v-slot:option="option">
						<div class="talent-info-container">
							<span class="talent-label">{{ option.Name }}</span>
							<span class="talent-desc">{{ option.Desc }}</span>
						</div>
					</template>
					<template #selected-option="option">
						<div class="talent-info-container label-selected">
							<span class="talent-label">{{ option.Name }}</span>
						</div>
					</template>
				</v-select>
			</div>
			<div class="mods-toggle" @click="showModSlots = !showModSlots">
				<span>Mods</span>
				<div
					class="arrow-down mx__open-indicator"
					:class="[showModSlots ? 'mx--open' : '']"
				></div>
			</div>
			<div class="mods-slots-container" v-if="showModSlots">
				<template v-for="(mod, i) in modSlots">
					<template v-if="weaponHasThisMod(mod)">
						<div class="slot-element mod-slot" v-bind:key="i">
							<v-select
								:placeholder="'Mod Slot: ' + mod"
								:clearable="false"
								:options="
									filterWeaponModsByType(
										currentWeapon.filters[mod],
										mod
									)
								"
								:filterBy="modMatchesUserSearch"
								v-model="currentWeapon[mod]"
								label="Name"
							>
								<template v-slot:option="option">
									<div class="mod-option-container">
										<span class="mod-name">{{
											option.Name
										}}</span>
										<span class="mod-stat">
											<span
												class="mod-increase"
												v-if="option.pos"
												>{{ option.pos }} +{{
													option.valPos
												}}</span
											>
											<span
												class="mod-decrease"
												v-if="option.neg"
												>{{ option.neg }}
												{{ option.valNeg }}</span
											>
										</span>
									</div>
								</template>
								<template #selected-option="option">
									<div class="mod-option-container">
										<span class="mod-name">{{
											option.Name
										}}</span>
										<!-- <span class="mod-stat">
                      <span class="mod-increase" v-if="option.pos">{{option.pos}} +{{option.valPos}}</span>
                      <span class="mod-decrease" v-if="option.neg">{{option.neg}} {{option.valNeg}}</span>
                    </span>-->
									</div>
								</template>
							</v-select>
							<span
								class="mod-stat selected"
								v-if="currentWeapon[mod]"
							>
								<span
									class="mod-increase"
									v-if="currentWeapon[mod].pos"
									>{{ currentWeapon[mod].pos }} +{{
										currentWeapon[mod].valPos
									}}</span
								>
								<span
									class="mod-decrease"
									v-if="currentWeapon[mod].neg"
									>{{ currentWeapon[mod].neg }}
									{{ currentWeapon[mod].valNeg }}</span
								>
							</span>
						</div>
					</template>
				</template>
			</div>
		</template>
	</div>
</template>

<script>
	import { openWeaponsModal } from "../utils/modalService";
	import { weaponsData } from "../utils/dataImporter";
	import { WeaponBase } from "../utils/classes";
	import coreService from "../utils/coreService";
	import { qualityToCss, getUniqueObject } from "../utils/utils";
	import Vue from "vue";

	import StatInput from "./StatInput";
	import ExpertiseInput from "./ExpertiseInput.vue";
	export default {
		name: "WeaponSlot",
		components: { StatInput, ExpertiseInput },
		props: {
			name: null,
			init: null,
			slotFilter: null,
		},
		data() {
			return {
				weaponsList: null,
				allWeaponAttributes: null,
				weaponAttributes: null,
				weaponMods: null,
				weaponTalents: null,
				currentWeapon: new WeaponBase(),
				modSlots: ["optic", "under barrel", "magazine", "muzzle"],
				showModSlots: false,
			};
		},
		updated() {
			// console.log(this.name + "updated!");
		},
		created() {
			weaponsData.Weapons.then((weapons) => {
				this.weaponsList = !this.slotFilter
					? weapons
					: weapons.filter((gun) => {
							return gun.Slot === this.slotFilter;
							// eslint-disable-next-line no-mixed-spaces-and-tabs
					  });
			});
			weaponsData.WeaponAttributes.then((weaponsAttr) => {
				this.allWeaponAttributes = getUniqueObject(weaponsAttr);
				this.weaponAttributes = this.allWeaponAttributes.filter((attribute) => {
					return attribute.Quality === "A";
				});
				this.weaponAttributes.sort((a, b) =>
					a.Stat > b.Stat ? 1 : -1
				);

				if (this.weaponAttributes.length) {
					// push a dummy attribute onto the front of the list
					this.weaponAttributes.unshift({
						"Quality": "A",
						"Type": "O",
						"Weapon Type": "",
						"Stat": "(Blank)",
						"Max": "",
						"index": -1
					});
				}
			});
			weaponsData.WeaponMods.then((weaponMods) => {
				this.weaponMods = getUniqueObject(weaponMods);
				this.weaponMods.sort((a, b) => (a.Name > b.Name ? 1 : -1));

				if (this.weaponMods.length) {
					// push dummy weapon mods onto the front of the list
					this.weaponMods.unshift({
						"Slot": "Optic",
						"Type": "",
						"Name": "(Blank)",
						"valPos": "",
						"pos": "",
						"valNeg": "",
						"neg": "",
						"Spec": "",
						"index": -1
					});
					this.weaponMods.unshift({
						"Slot": "Magazine",
						"Type": "",
						"Name": "(Blank)",
						"valPos": "",
						"pos": "",
						"valNeg": "",
						"neg": "",
						"Spec": "",
						"index": -2
					});
					this.weaponMods.unshift({
						"Slot": "Under Barrel",
						"Type": "",
						"Name": "(Blank)",
						"valPos": "",
						"pos": "",
						"valNeg": "",
						"neg": "",
						"Spec": "",
						"index": -3
					});
					this.weaponMods.unshift({
						"Slot" :"Muzzle",
						"Type": "",
						"Name": "(Blank)",
						"valPos": "",
						"pos": "",
						"valNeg": "",
						"neg": "",
						"Spec": "",
						"index": -4
					});
				}
			});
			weaponsData.WeaponTalents.then((weaponTalents) => {
				this.weaponTalents = getUniqueObject(weaponTalents);

				if (this.weaponTalents.length) {
					// push a dummy talent onto the front of the list
					this.weaponTalents.unshift({
						"Quality":"A",
						"Name":"(Blank)",
						"Assault Rifle":"x",
						"Rifle":"x",
						"Marksman Rifle":"x",
						"SMG":"x",
						"LMG":"x",
						"Pistol":"x",
						"Shotgun":"x",
						"Desc":"",
						"attr":"",
						"val":"",
						"index": -1
					});
				}
			});
			this.initGearData();
		},
		methods: {
			qualityToCSS(quality) {
				return qualityToCss[quality];
			},
			isWeaponSelected() {
				return this.currentWeapon && this.currentWeapon.name;
			},
			openWeaponsModal() {
				openWeaponsModal(this.weaponsList, this.onModalClose);
			},
			onModalClose(data) {
				if (!data) {
					this.currentWeapon = undefined;
					return;
				}
				this.currentWeapon = new WeaponBase(data);
				const isExotic = this.isExotic(this.currentWeapon);
				const isNamed = this.isNamed(this.currentWeapon);
				if (isExotic || isNamed) {
					this.currentWeapon[
						"attribute 1"
					] = this.allWeaponAttributes.find((el) => {
						return (
							el["Stat"] ===
							this.currentWeapon.filters["attribute 1"]
						);
					});
					this.currentWeapon[
						"attribute 2"
					] = this.allWeaponAttributes.find((el) => {
						return (
							el["Stat"] ===
							this.currentWeapon.filters["attribute 2"]
						);
					});
					this.currentWeapon["talent"] = this.weaponTalents.find(
						(el) => {
							return (
								el["Name"] ===
								this.currentWeapon.filters["talent"]
							);
						}
					);
					if (isExotic) {
						const modMap = [
							{
								target: "optic",
								source: this.weaponMods,
								toMatch: "Slot",
							},
							{
								target: "under barrel",
								source: this.weaponMods,
								toMatch: "Slot",
							},
							{
								target: "magazine",
								source: this.weaponMods,
								toMatch: "Slot",
							},
							{
								target: "muzzle",
								source: this.weaponMods,
								toMatch: "Slot",
							},
						];
						for (let i = 0; i < modMap.length; i++) {
							const mappedMod = modMap[i];
							const mappedFilter = this.currentWeapon.filters[
								mappedMod.target
							];
							this.currentWeapon[
								mappedMod.target
							] = mappedMod.source.find((el) => {
								return (
									el[mappedMod.toMatch].toLowerCase() ===
										mappedMod.target &&
									el.Type === mappedFilter
								);
							});
						}
					}
				}
			},
			filterWeaponModsByType(type, slot) {
				let result = [];
				if (this.currentWeapon.quality !== "Exotic") {
					result = this.weaponMods.filter(
						(mod) =>
							slot === mod.Slot.toLowerCase() &&
							type.indexOf(mod.Type) >= 0
					);
				}
				return result;
			},
			modMatchesUserSearch(option, label, search) {
				// return true if this option matches the text entered by the user
				const properties = [option.Name, option.pos, option.neg];
				const found = properties.filter(
					(p) => (p || '').toLowerCase().indexOf(search.toLowerCase()) > -1
				);
				return found.length > 0;
			},
			filterTalents(weaponTalents) {
				let result = [];
				if (
					this.currentWeapon.quality !== "Exotic" &&
					this.currentWeapon.filters.talent === "A"
				) {
					// TODO: Or is not a named talent
					result = weaponTalents
						.filter((talent) => {
							return !!talent[this.currentWeapon["weapon type"]];
						})
						.sort(function(a, b) {
							if (a.Name < b.Name) {
								return -1;
							}
							if (a.Name > b.Name) {
								return 1;
							}
							return 0;
						});
				}
				return result;
			},
			weaponHasThisMod(mod) {
				return this.currentWeapon.filters[mod];
			},
			isExotic(currentWeapon) {
				return currentWeapon.quality === "Exotic";
			},
			isNamed(currentWeapon) {
				return currentWeapon.quality === "Named";
			},
			initGearData() {
				coreService.getSlotInit$(this.name).subscribe((ids) => {
					const splittedIdS = ids.split("-");
					const id = parseInt([splittedIdS[0]]);
					if (id) {
						// Like From urlEncoder
						const map = [
							null,
							{
								target: "attribute 1",
								source: this.weaponAttributes,
							},
							{ target: "talent", source: this.weaponTalents },
							{ target: "optic", source: this.weaponMods },
							{ target: "under barrel", source: this.weaponMods },
							{ target: "magazine", source: this.weaponMods },
							{ target: "muzzle", source: this.weaponMods },
						];
						const fromUrlGear = new WeaponBase(
							this.weaponsList.find(
								(weapon) => weapon.index === id
							)
						);
						this.currentWeapon = fromUrlGear;
						// Start from 1 because 0 is used to build the object
						for (let i = 1; i <= 6; i++) {
							const id = parseInt(splittedIdS[i]);
							const mapped = map[i];
							this.currentWeapon[
								mapped.target
							] = mapped.source.find((el) => el.index === id);
						}

						const stats = [
							null,
							"attribute 1",
							"core 1",
							"core 2",
							"expertise",
						];
						for (let idx = 1; idx < stats.length; idx++) {
							const stat = stats[idx];
							const currentStatToUpdate = this.currentWeapon[
								stat
							];
							const statValueToImport = parseFloat(
								splittedIdS[6 + idx]
							);
							if (currentStatToUpdate && statValueToImport > 0) {
								// Using Vue set because I want this to be reactive and
								// to trigger watch deep when it changes into StatInput
								Vue.set(
									currentStatToUpdate,
									"StatValue",
									statValueToImport
								);
							}
							// Fixed Skill Tier for TDI Kard Custom
							if (
								this.currentWeapon.id === 243 &&
								this.currentWeapon.quality === "Named"
							) {
								if (
									this.currentWeapon["attribute 1"] ===
									undefined
								) {
									this.currentWeapon["attribute 1"] = {
										Max: "1",
										Quality: "N",
										Stat: "Skill Tier",
										Type: "O",
										"Weapon Type": "",
										index: 15,
									};
								}
							}
						}
					}
				});
			},
			clearWeaponSlot() {
				this.currentWeapon.name = null;
				this.currentWeapon = null;
			},
			clearStatSlot(slotStat) {
				// do not clear talents of named items or exotic stats
				if (
					this.currentWeapon.quality === "Exotic" ||
					(this.currentWeapon.quality === "Named" &&
						slotStat === "talent")
				)
					return;

				this.currentWeapon[slotStat] = null;
			},
		},
		watch: {
			currentWeapon: {
				handler: function(val, oldVal) {
					// TODO HANDLE oldVal it might sove some issues related to multiple triggers on Encoding
					// do not do anything no weapon selected or item to un-equip (Blank)
					if (this.currentWeapon) {
						const props = [
							{ "attribute 1": "Stat" },
							{ talent: "Name" },
							{ optic: "Name" },
							{ "under barrel": "Name" },
							{ magazine: "Name" },
							{ muzzle: "Name" },
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
	.weapon-container {
		height: 100%;
		color: white;
	}

	span.expertise {
		flex: 3;
		padding: 4px 8px;
		border-bottom: 1px solid white;
	}

	span.core {
		flex: 3;
		padding: 4px 8px;
		border-bottom: 1px solid white;
	}

	.mod-option-container {
		display: flex;
		flex-direction: column;
	}

	.mod-stat {
		display: flex;
		flex-wrap: wrap;
		padding: 6px 10px;
		&.selected {
			padding-left: 20px;
			border-bottom: 1px solid white;
		}
	}

	.mod-increase {
		margin-right: 8px;
	}

	.talent-info-container {
		display: flex;
		flex-direction: column;
	}

	.talent-label,
	.talent-desc {
		white-space: break-spaces;
	}

	.mods-toggle {
		margin-top: 8px;
		padding: 8px;
		padding-right: 6px;
		display: flex;
		// background: rgba(0, 0, 0, 0.3);
		border-bottom: 1px solid white;
		cursor: pointer;
	}

	// .clear-slot {
	// 	color: red;
	// }

	// .clear-slot-stat {
	// 	color: red;
	// }
</style>
