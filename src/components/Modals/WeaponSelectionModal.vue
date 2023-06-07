<template>
	<div class="weapon-selection-modal">
		<input
			class="mx-input search"
			placeholder="Search..."
			type="text"
			@input="debouceSearch"
		/>
		<div @click="toggleMobileMenu()" class="menu-btt">
			<span class="no-select">Weapon Types</span>
			<div
				class="arrow-down mx__open-indicator"
				:class="[showMobileMenu ? 'mx--open' : '']"
			></div>
		</div>
		<div class="search-toolbar" :class="{ showOnMobile: showMobileMenu }">
			<button
				class="mx-btt"
				v-for="(type, key) in weaponTypes"
				v-bind:key="key"
				@click="
					scrollToElementID(type);
					toggleMobileMenu();
				"
			>
				{{ type }}
			</button>
		</div>
		<div class="overflow-handler">
			<div class="weapon-grid">
				<div
					v-for="(item, index) in gridItems"
					v-bind:key="index"
					:class="item.classes"
					@[item.event]="onSelection(item.weapon)"
				>
					<template v-if="item.type">
						<div :id="item.type">{{ item.type }}</div>
					</template>
					<template v-else>
						<BasicTile :classes="'anim-enabled'">
							<div class="tile-content">
								<template v-if="!item.weapon">
									<span class="name">
										Empty Slot
									</span>
									<div class="talent">Remove the item from this slot.</div>
								</template>
								<template v-else>
									<span class="name">
										{{ getDisplayName(item.weapon) }}
									</span>
									<div
										class="perks-container"
										v-for="(perk, idx) in getPerks(item.weapon)"
										v-bind:key="idx"
									>
										<div class="perk-icon" :class="perk.type"></div>
										<div class="perk">{{ perk.desc }}</div>
									</div>
									<div class="talent">
										{{ getTalentDesc(item.weapon.Talent) }}
									</div>
									<div
										v-if="isAvailableAtVendor(item.weapon)"
										class="vendor-label"
									>
										Sold at <b>{{ whereIsAvailable(item.weapon) }}</b>
									</div>
								</template>
							</div>
						</BasicTile>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		IsEverythingLoadedPromise,
		weaponsData,
		VendorData,
	} from "../../utils/dataImporter";
	import {
		qualityToCss,
		QualityPriority,
		groupArrayOfObjectsByKey,
	} from "../../utils/utils";
	import BasicTile from "../BasicTile";

	export default {
		name: "WeaponSelectionModal",
		props: ["gearData", "onModalClose", "tableHeaders"],
		components: {
			BasicTile,
		},
		data() {
			return {
				WeaponTalents: {},
				perfectAttributes: [],
				weaponsList: [],
				searchText: "",
				debounce: null,
				showMobileMenu: false,
				vendorWeapons: [],
			};
		},
		computed: {
			weaponTypes: function() {
				// this updates if the grid items are filtered by the user
				return this.gridItems
					.filter((item) => item.type)
					.map((item) => item.type);
			},
			gridItems: function() {
				// computed list of items which can be filtered by user searches

				// vue won't let us loop on templates for the alternating grid sections
				// so we flatten the list sections and weapons into a single list

				// filter the full list of weapons if needed before
				// generating the list of items for the grid
				const weapons = this.searchText.length
					? this.getFilteredWeaponsList()
					: this.weaponsList;

				const itemList = [];
				// add an empty slot at the beginning of each section
				itemList.push({
					type: null,
					classes: "remove-item",
					event: "click",
					weapon: null,
				});
				Object.keys(weapons)
					.sort()
					.forEach((type) => {
						// add each weapon type section heading
						itemList.push({
							type: type,
							classes: "weapon-type",
							event: null,
							weapon: null,
						});
						weapons[type].forEach((weapon) => {
							// then add all of the weapons for the section
							itemList.push({
								type: null,
								classes: "weapon-slot " + qualityToCss[weapon.Quality],
								event: "click",
								weapon: weapon,
							});
						});
					});
				return itemList;
			},
		},
		methods: {
			getDisplayName(weapon) {
				return weapon.Name == weapon.Variant
					? weapon.Name
					: `${weapon.Name} (${weapon.Variant})`;
			},
			getPerks(weapon) {
				const perks = [];
				if (weapon["Quality"] === "Named") {
					["Attribute 1"].forEach((key) => {
						if (weapon[key] && weapon[key].length > 1) {
							let found = this.perfectAttributes.find(
								(a) => a.Stat === weapon[key]
							);
							if (found) {
								perks.push({
									type: "perfect",
									desc: `${found.Stat.trim()} ${found.Max}`,
								});
							}
						}
					});
				}
				return perks;
			},
			getTalentDesc(talent) {
				return this.WeaponTalents[talent]
					? `Talent: ${talent}\n${this.WeaponTalents[talent]}`
					: null;
			},
			debouceSearch(event) {
				clearTimeout(this.debounce);
				this.debounce = setTimeout(() => {
					this.searchText = event.target.value;
				}, 300);
			},
			scrollToElementID(divId) {
				document.getElementById(divId).scrollIntoView();
			},
			toggleMobileMenu() {
				this.showMobileMenu = !this.showMobileMenu;
			},
			getFilteredWeaponsList() {
				const searchText = this.searchText.toLocaleLowerCase();
				const result = {};
				Object.keys(this.weaponsList)
					.sort()
					.forEach((type) => {
						const filtered = this.weaponsList[type].filter((weapon) => {
							return (
								this.getDisplayName(weapon)
									.toLocaleLowerCase()
									.includes(searchText) ||
								weapon.Quality.toLocaleLowerCase().includes(searchText)
							);
						});
						if (filtered.length) {
							result[type] = filtered;
						}
					});
				return result;
			},
			isAvailableAtVendor(weapon) {
				return this.vendorWeapons.some((item) => item.Name === weapon.Name);
			},
			whereIsAvailable(weapon) {
				const found = this.vendorWeapons.find(
					(item) => item.Name === weapon.Name
				);
				return found.Vendor;
			},
			onSelection(weapon) {
				this.$emit("close");
				this.onModalClose(weapon);
			},
		},
		created() {
			Promise.all([
				IsEverythingLoadedPromise,
				weaponsData.WeaponTalents,
				weaponsData.WeaponAttributes,
				VendorData,
				//   gearMetaData.BrandsData,
			]).then((data) => {
				this.WeaponTalents = data[1].reduce(function(o, val) {
					o[val.Name] = val.Desc;
					return o;
				}, {});
				const sorted = this.gearData.sort(
					(a, b) =>
						QualityPriority[a["Quality"]] - QualityPriority[[b["Quality"]]] ||
						a["Name"].localeCompare(b["Name"])
				);
				this.perfectAttributes = data[2].filter((a) => a.Quality === "N");
				this.vendorWeapons = data[3].Weapons;
				this.weaponsList = groupArrayOfObjectsByKey(sorted, "Weapon Type");
			});
		},
	};
</script>

<style lang="scss" scoped>
	.weapon-selection-modal {
		height: 100%;
		width: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	.weapon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 8px;
		padding: 8px;

		.tile {
			padding: unset; /* must unset so we can apply to content below */
			height: 100%;
			min-height: 10px;

			.tile-content {
				padding: 16px;
			}
		}
		.remove-item {
			grid-column: 1 / -1;
		}
		.weapon-type {
			grid-column: 1 / -1;
			font-size: 20px;
			font-weight: 600;
		}

		.weapon-slot {
			min-width: 250px; /* must be the same as grid min */
			max-width: 500px;
			cursor: pointer;

			.name {
				width: 100%;
				font-size: 18px;
				font-weight: 600;
			}

			.perks-container {
				display: flex;
				margin-top: 5px;
				align-items: center;

				.perk-icon {
					height: 18px;
					width: 18px;
					&.perfect {
						content: url("data:image/svg+xml,%3Csvg version='1.0' xmlns='http://www.w3.org/2000/svg' style='fill:white' viewBox='-25 -25 350 350'%3E%3Cpath d='M67.2 16.4 59 24.8l.2 36.8.3 36.9 20.3.3c15.8.2 20.2 0 20.3-1 0-.7 0-11-.1-22.9-.1-18.3.1-21.8 1.4-23 3.1-2.9 4.1-3.8 5.4-5.4 1.1-1.3 6.6-1.5 43.7-1.5H193l1.6 2.5c.9 1.3 2.4 2.7 3.5 3 1.7.6 1.9 2.1 2.1 24.3l.3 23.7h41l.3-36.8.2-36.8-8.4-8.4-8.4-8.5-74.9.1H75.5l-8.3 8.3zM42.3 114.4l-3.3 3.3v169.4l3.5 3.4 3.4 3.5h105c103.2 0 105 0 105.6-1.9.3-1.1 1.5-2.3 2.6-2.6 1-.4 1.9-.9 1.9-1.3v-86l.1-85.3-3-2.9-2.9-3-104.9.1H45.5l-3.2 3.3zm132.5 43.8c1.4 1.4 1.7 85.4.4 87.6-.7.9-6.4 1.2-25.3 1l-24.4-.3-.3-43.4c-.1-31.2.1-43.8.9-44.7 1.6-1.9 46.9-2 48.7-.2z'/%3E%3C/svg%3E");
					}
				}

				.perk {
					padding-left: 6px;
				}
			}

			.talent {
				white-space: pre-line;
			}

			&.named {
				background: rgba(255, 174, 0, 0.8);
			}

			&.exotic {
				background: rgba(225, 76, 50, 0.8);
			}

			&.gearset {
				background: rgba(75, 175, 100, 0.8);
			}
		}
	}

	.overflow-handler {
		max-height: 100%;
		overflow: auto;
	}

	.search-toolbar {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 8px;
		padding: 8px;
		background: #252525;
		z-index: 2;
		border-bottom: 1px solid white;
		.mx-btt {
			margin: 0;
		}
	}

	/// - TODO: DUPED CODE

	.menu-btt {
		display: none;
		height: 31px;
		line-height: 31px;
		color: white;
		padding-left: 8px;
		padding-right: 6px;
		background-color: transparent;
		border: 0px;
		background-position: right;
		border-bottom: 1px solid white;
		margin-top: 8px;
		margin-bottom: 4px;
		margin-right: 8px;
		margin-left: 8px;
		width: auto;
		cursor: pointer;
		.arrow-down {
			margin-top: 6px;
		}
	}

	// mobile switch to menu W/ button
	@media only screen and (max-width: 850px) {
		.menu-btt {
			display: flex;
		}
		.search-toolbar {
			display: none;
			&.showOnMobile {
				display: grid;
			}
		}
	}
</style>
