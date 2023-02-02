<template>
	<div class="weapon-selection-modal">
		<input
			class="mx-input search"
			placeholder="Search..."
			type="text"
			@input="debouceSearch"
		/>
		<a
			@click="showMobileMenu = !showMobileMenu"
			class="menu-btt arrow-down"
		>
			Weapon Types
		</a>
		<div class="search-toolbar" :class="{ showOnMobile: showMobileMenu }">
			<a
				class="mx-btt"
				v-for="(weapons, key) in weaponsList"
				v-bind:key="key"
				@click="scrollToElementID(key)"
				>{{ key }}</a
			>
		</div>
		<div class="overflow-handler">
			<div v-for="(weapons, key) in weaponsList" v-bind:key="key">
				<span
					class="weap-type"
					v-if="filterByName(weapons).length > 0"
					:id="key"
					>{{ key }}
				</span>
				<div
					class="weapon-grid"
					v-if="filterByName(weapons).length > 0"
				>
					<div
						class="weapon-slot"
						:class="[qualityToCSS(weapon.Quality)]"
						@click="onSelection(weapon)"
						v-for="(weapon, idx) in filterByName(weapons)"
						v-bind:key="idx"
					>
						<BasicTile :classes="'anim-enabled'">
							<span class="name">
								{{ getDisplayName(weapon) }}
							</span>
							<div class="white-space-pre-wrap">
								{{ getTalentDesc(weapon.Talent) }}
							</div>
							<div
								v-if="isAvailableAtVendor(weapon)"
								class="vendor-label"
							>
								Sold at <b>{{ whereIsAvailable(weapon) }}</b>
							</div>
						</BasicTile>
					</div>
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
				weaponsList: [],
				searchText: "",
				debounce: null,
				showMobileMenu: false,
				vendorWeapons: [],
			};
		},
		methods: {
			qualityToCSS(quality) {
				return qualityToCss[quality];
			},
			getDisplayName(weapon) {
				return weapon.Name == weapon.Variant
					? weapon.Name
					: `${weapon.Name} (${weapon.Variant})`;
			},
			getTalentDesc(talent) {
				return this.WeaponTalents[talent]
					? this.WeaponTalents[talent]
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
			filterByName(list) {
				return list.filter((weapon) =>
					this.getDisplayName(weapon)
						.toLocaleLowerCase()
						.includes(this.searchText.toLocaleLowerCase())
				);
			},
			isAvailableAtVendor(weapon) {
				return this.vendorWeapons.some(
					(item) => item.Name === weapon.Name
				);
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
				VendorData,
				//   gearMetaData.BrandsData,
			]).then((data) => {
				this.WeaponTalents = data[1].reduce(function(o, val) {
					o[val.Name] = val.Desc;
					return o;
				}, {});
				const sorted = this.gearData.sort(
					(a, b) =>
						QualityPriority[a["Quality"]] -
							QualityPriority[[b["Quality"]]] ||
						a["Name"].localeCompare(b["Name"])
				);
				this.vendorWeapons = data[2].Weapons;
				this.weaponsList = groupArrayOfObjectsByKey(
					sorted,
					"Weapon Type"
				);
				console.log(this.weaponsList);
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
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 8px;
		padding: 8px;

		.tile {
			min-height: 10px;
			width: 100%;
		}

		.weapon-slot {
			display: flex;
			flex-wrap: wrap;
			position: relative;
			min-height: 10px;
			cursor: pointer;
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

		.overflow-handler {
			max-height: 100%;
			overflow: auto;
		}
	}
	.search-toolbar {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 8px;
		padding: 8px;
		background: #252525;
		z-index: 2;
		border-bottom: 1px solid white;
		.mx-btt {
			margin: 0;
		}
	}

	.weap-type {
		font-size: 20px;
		font-weight: 600;
		margin-left: 8px;
	}

	/// - TODO: DUPED CODE

	.menu-btt {
		display: none;
		height: 31px;
		line-height: 31px;
		color: white;
		padding-right: 24px;
		background-color: transparent;
		border: 0px;
		background-position: right;
		border-bottom: 1px solid white;
		margin-top: 8px;
		margin-bottom: 4px;
		margin-right: 8px;
		margin-left: 8px;
		width: auto;
	}

	// mobile switch to menu W/ button
	@media only screen and (max-width: 550px) {
		.menu-btt {
			display: flex;
		}
		.search-toolbar {
			display: none;
			&.showOnMobile {
				display: flex;
				flex-direction: column;
				button {
					margin-right: 0;
				}
			}
		}
	}
</style>
