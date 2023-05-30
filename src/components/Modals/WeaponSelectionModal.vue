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
					v-if="filterWeaponList(weapons).length > 0"
					:id="key"
					>{{ key }}
				</span>
				<div
					class="weapon-grid"
					v-if="filterWeaponList(weapons).length > 0"
				>
					<div
						class="weapon-slot"
						:class="[qualityToCSS(weapon.Quality)]"
						@click="onSelection(weapon)"
						v-for="(weapon, idx) in filterWeaponList(weapons)"
						v-bind:key="idx"
					>
						<BasicTile :classes="'anim-enabled'">
							<span class="name">
								{{ getDisplayName(weapon) }}
							</span>
							<ul class="perfect-attributes" v-if="getPerfectAttributes(weapon).length > 0">
								<li
									v-for="(attribute, idx) in getPerfectAttributes(weapon)"
									v-bind:key="idx"
								>
									{{ attribute }}
								</li>
							</ul>
							<div
								v-if="getTalentDesc(weapon.Talent)"
								class="talent-wrap"
							>
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
				perfectAttributes: [],
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
			getPerfectAttributes(weapon) {
				let result = [];
				if (weapon['Quality'] !== 'Named') {
					return result;
				}
				['Attribute 1'].forEach((key) => {
					if (weapon[key] && weapon[key].length > 1) {
						let found = this.perfectAttributes.find((a) => a.Stat === weapon[key]);
						if (found) {
							result.push(`${found.Stat.trim()} ${found.Max}`);
						}
					}
				})
				return result;
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
			filterByName(list) {
				return list.filter((weapon) =>
					this.getDisplayName(weapon)
						.toLocaleLowerCase()
						.includes(this.searchText.toLocaleLowerCase())
				);
			},
			filterWeaponList(list) {
				return list.filter((weapon) => {
					return (
						this.getDisplayName(weapon)
							.toLocaleLowerCase()
							.includes(this.searchText.toLocaleLowerCase()) ||
						weapon.Quality.toLocaleLowerCase().includes(
							this.searchText.toLocaleLowerCase()
						)
					);
				});
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
						QualityPriority[a["Quality"]] -
							QualityPriority[[b["Quality"]]] ||
						a["Name"].localeCompare(b["Name"])
				);
				this.perfectAttributes = data[2].filter( a => a.Quality === 'N');
				this.vendorWeapons = data[3].Weapons;
				this.weaponsList = groupArrayOfObjectsByKey(
					sorted,
					"Weapon Type"
				);
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

			.name {
				width: 100%;
				font-size: 18px;
				font-weight: 600;
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


	ul.perfect-attributes {
		list-style-type :none;
	}

	ul.perfect-attributes > li::before {
		content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -256 1792 1792'%3E%3Cpath d='M704 512q0 53-37.5 90.5T576 640q-53 0-90.5-37.5T448 512q0-37 19-67t51-47l-69-229q-5-15 5-28t26-13h192q16 0 26 13t5 28l-69 229q32 17 51 47t19 67zM320 768h512v192q0 106-75 181t-181 75q-106 0-181-75t-75-181V768zm832-96V96q0-40-28-68t-68-28H96Q56 0 28 28T0 96v576q0 40 28 68t68 28h32v192q0 184 132 316t316 132q184 0 316-132t132-316V768h32q40 0 68-28t28-68z' style='fill:currentColor' transform='matrix(1 0 0 -1 318.915 1346.17)'/%3E%3C/svg%3E");
		filter: invert(100%);
		display: inline-block;
		width: 1.5em;
		margin-left: -2.75em;
		vertical-align: text-top;
	}

</style>
