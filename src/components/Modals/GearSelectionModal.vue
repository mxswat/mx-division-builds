<template>
	<div class="gear-selection-modal">
		<input
			class="mx-input search"
			placeholder="Search..."
			type="text"
			@input="debouceSearch"
		/>
		<div class="overflow-handler">
			<div class="gear-grid">
				<div
					class="gear-slot"
					v-for="(gear, idx) in filterByName(gearList)"
					v-bind:key="idx"
					:class="[qualityToCSS(gear.Quality)]"
					@click="onSelection(gear)"
				>
					<img
						v-if="getBrandOrGearsetIcon(gear['Brand'])"
						class="gear-logo"
						:src="getBrandOrGearsetIcon(gear['Brand'])"
						alt=""
					/>
					<BasicTile :classes="'anim-enabled'">
						<span class="name">
							{{ getDisplayName(gear) }}
						</span>
						<ol
							class="bonuses-container"
							v-if="getBonuses(gear).length > 0"
						>
							<li
								class="bonus-wrap"
								v-for="(bonuses, idx) in getBonuses(gear)"
								v-bind:key="idx"
							>
								<span
									class="bonus white-space-pre-wrap"
									v-for="bonus in bonuses"
									v-bind:key="bonus"
								>
									{{ bonus }}
									<br />
								</span>
							</li>
						</ol>
						<div class="white-space-pre-wrap">
							{{ getTalentDesc(gear.Talent) }}
						</div>
						<div
							v-if="isAvailableAtVendor(gear)"
							class="vendor-label"
						>
							Sold at <b>{{ whereIsAvailable(gear) }}</b>
						</div>
					</BasicTile>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		gearData as gearMetaData,
		IsEverythingLoadedPromise,
		VendorData,
	} from "../../utils/dataImporter";
	import { qualityToCss, QualityPriority } from "../../utils/utils";
	import BasicTile from "../BasicTile";
	const gearNameProp = "Item Name";

	export default {
		name: "GearSelectionModal",
		props: ["gearData", "onModalClose", "gearSlot"],
		components: {
			BasicTile,
		},
		data() {
			return {
				gearList: [],
				BrandsData: [],
				gearTalentsMap: {},
				searchText: "",
				vendorGear: [],
			};
		},
		methods: {
			getBrandOrGearsetIcon(name) {
				return this.BrandsData[name] ? this.BrandsData[name].Icon : "";
			},
			qualityToCSS(quality) {
				return qualityToCss[quality];
			},
			getDisplayName(gear) {
				return gear["Brand"] === gear[gearNameProp]
					? gear[gearNameProp]
					: `${gear[gearNameProp]} (${gear["Brand"]})`;
			},
			getTalentDesc(talent) {
				return this.gearTalentsMap[talent]
					? this.gearTalentsMap[talent].Desc
					: null;
			},
			getBonuses(gear) {
				const isBrandOrGS = !!this.BrandsMapping[gear["Brand"]];
				return isBrandOrGS ? this.BrandsMapping[gear["Brand"]] : [];
			},
			onSelection(gear) {
				this.$emit("close");
				this.onModalClose(gear);
			},
			buildBrandAndGearsetsMapping(brandSetBonuses) {
				return brandSetBonuses.reduce((o, brandBonus) => {
					const brandName = brandBonus.Brand.slice(0, -1); // remove the last char which is used in the DB
					o[brandName] = o[brandName] || [];
					const bonuses = [`${brandBonus.stat} ${brandBonus.val}`];
					if (brandBonus.stat === "Talent") {
						bonuses[0] = brandBonus.Talent.trim();
					}
					if (brandBonus.stat1) {
						bonuses.push(`${brandBonus.stat1} ${brandBonus.val1}`);
					}

					o[brandName].push(bonuses);
					return o;
				}, {});
			},
			debouceSearch(event) {
				clearTimeout(this.debounce);
				this.debounce = setTimeout(() => {
					this.searchText = event.target.value;
				}, 300);
			},
			filterByName(list) {
				return list.filter((gear) =>
					this.getDisplayName(gear)
						.toLocaleLowerCase()
						.includes(this.searchText.toLocaleLowerCase())
				);
			},
			isAvailableAtVendor(gear) {
				return this.vendorGear.some(
					(item) => item.Name === gear[gearNameProp]
				);
			},
			whereIsAvailable(gear) {
				const found = this.vendorGear.find(
					(item) => item.Name === gear[gearNameProp]
				);
				return found.Vendor;
			},
		},
		created() {
			Promise.all([
				IsEverythingLoadedPromise,
				gearMetaData.BrandsData,
				gearMetaData.BrandSetBonuses,
				gearMetaData.GearTalents,
				VendorData,
			]).then((data) => {
				this.BrandsData = data[1].reduce(function(o, val) {
					o[val.Brand] = val;
					return o;
				}, {});
				this.BrandsMapping = this.buildBrandAndGearsetsMapping(data[2]);
				this.gearList = this.gearData.sort(
					(a, b) =>
						QualityPriority[a["Quality"]] -
							QualityPriority[[b["Quality"]]] ||
						a[gearNameProp].localeCompare(b[gearNameProp])
				);
				this.gearTalentsMap = data[3].reduce(function(o, val) {
					o[val.Talent] = val;
					return o;
				}, {});
				this.vendorGear = data[4].Gear[this.gearSlot];
			});
		},
		mounted() {},
	};
</script>

<style lang="scss">
	.gear-selection-modal {
		height: 100%;
		width: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.gear-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 8px;
		padding: 8px;
		.tile {
			min-height: 100px;
			width: 100%;
		}
		.gear-slot {
			display: flex;
			flex-wrap: wrap;
			position: relative;
			min-height: 90px;
			cursor: pointer;

			.name {
				width: 100%;
				font-size: 18px;
				font-weight: 600;
			}

			.bonuses-container {
				display: flex;
				flex-direction: column;
				padding-left: 18px;
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

		.gear-logo {
			height: 84px;
			width: 84px;
			object-fit: contain;
			opacity: 0.7;
			position: absolute;
			top: 60px;
			right: 16px;
			z-index: 0;
		}

		.bonus-wrap {
			border-left: 2px solid white;
			margin-top: 5px;
			padding-left: 4px;
		}
	}

	.overflow-handler {
		max-height: 100%;
		overflow: auto;
	}

	.exotic .gear-logo {
		bottom: 20px;
		top: auto;
	}
</style>
