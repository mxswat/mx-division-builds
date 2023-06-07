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
          v-for="(item, idx) in gridItems"
          v-bind:key="idx"
          :class="[item.classes]"
          @click="onSelection(item.gear)"
        >
          <img
            v-if="item.gear && getBrandOrGearsetIcon(item.gear['Brand'])"
            class="gear-logo"
            :src="getBrandOrGearsetIcon(item.gear['Brand'])"
            alt=""
          />
          <BasicTile :classes="'anim-enabled'">
            <div class="tile-content">
              <template v-if="item.gear === null">
                <span class="name">
                  Empty Slot
                </span>
                <div class="talent"
                  >Remove the item from this slot.</div
                >
              </template>
              <template v-else>
                <span class="name">
                  {{ getDisplayName(item.gear) }}
                </span>
                <ol class="bonuses-container"
                    v-if="getBonuses(item.gear).length > 0"
                    :start="item.gear.Quality === 'Gearset' ? 2 : 1"
                >
                  <li
                    class="bonus-wrap"
                    v-for="(bonuses, idx) in getBonuses(item.gear)"
                    v-bind:key="idx"
                  >
                    <span
                      class="bonus"
                      v-for="bonus in bonuses"
                      v-bind:key="bonus"
                      >{{ bonus }}<br /></span
                    >
                  </li>
                </ol>
                <div
                  class="perks-container"
                  v-for="(perk, idx) in getPerks(item.gear)"
                  v-bind:key="idx"
                >
                  <div class="perk-icon" :class="perk.type"></div>
                  <div class="perk">{{ perk.desc }}</div>
                </div>
                <div class="talent"
                  >{{ getTalentDesc(item.gear.Talent) }}</div
                >
                <div v-if="isAvailableAtVendor(item.gear)" class="vendor-label">
                  Sold at <b>{{ whereIsAvailable(item.gear) }}</b>
                </div>
              </template>
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
        perfectAttributes: [],
        gearTalentsMap: {},
        searchText: "",
        vendorGear: [],
      };
    },
    computed: {
      gridItems: function () {
        // computed list of items which can be filtered by user searches
        
        // filter the full list of gear if needed before
        // generating the list of items for the grid
        const gears = this.searchText.length
          ? this.getFilteredGearList()
          : this.gearList;

        const itemList = [];
        // add an empty slot at the beginning of the list
        itemList.push({
          classes: 'remove-item',
          gear: null,
        });
        gears.forEach((gear) => {
          // then add all of the gear to the list
          itemList.push({
            classes: 'gear-slot ' + qualityToCss[gear.Quality],
            gear: gear,
          });
        });
        return itemList;
      },
    },
    methods: {
      getBrandOrGearsetIcon(name) {
        return this.BrandsData[name]
          ? `icons/brands/${this.BrandsData[name].Icon}`
          : "";
      },
      getDisplayName(gear) {
        return gear["Brand"] === gear[gearNameProp]
          ? gear[gearNameProp]
          : `${gear[gearNameProp]} (${gear["Brand"]})`;
      },
      getTalentDesc(talent) {
        return this.gearTalentsMap[talent]
          ? `Talent: ${talent}\n${this.gearTalentsMap[talent].Desc}`
          : null;
      },
      getBonuses(gear) {
        const isBrandOrGS = !!this.BrandsMapping[gear["Brand"]];
        return isBrandOrGS ? this.BrandsMapping[gear["Brand"]] : [];
      },
      getPerks(gear) {
        let perks = [];
        if (gear['Quality'] === 'Named') {
          ['Attribute 1', 'Attribute 2', 'Attribute 3'].forEach((key) => {
            if (gear[key] && gear[key].length > 1) {
              let found = this.perfectAttributes.find((a) => a.Stat === gear[key]);
              if (found) {
                perks.push({
                  type: 'perfect',
                  desc: `${found.Stat.trim()} ${found.Max}`,
                });
              }
            }
          });
        }
        if ( ( ['Mask','Chest','Backpack'].includes(this.gearSlot) && gear['Mod 2'] ) ||
             ( ['Gloves','Holster','Kneepads'].includes(this.gearSlot) && gear['Mod'] ) )
        {
          perks.push({
            type: 'mod',
            desc: 'Extra Mod Slot',
          });
        }
        return perks;
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
      getFilteredGearList() {
        return this.gearList.filter((gear) =>
          this.getDisplayName(gear)
            .toLocaleLowerCase()
            .includes(this.searchText.toLocaleLowerCase())
        );
      },
      isAvailableAtVendor(gear) {
        return this.vendorGear.some((item) => item.Name === gear[gearNameProp]);
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
        gearMetaData.Attributes,
        VendorData,
      ]).then((data) => {
        this.BrandsData = data[1].reduce(function(o, val) {
          o[val.Brand] = val;
          return o;
        }, {});
        this.BrandsMapping = this.buildBrandAndGearsetsMapping(data[2]);
        this.gearList = this.gearData.sort(
          (a, b) =>
            QualityPriority[a["Quality"]] - QualityPriority[[b["Quality"]]] ||
            a[gearNameProp].localeCompare(b[gearNameProp])
        );
        this.gearTalentsMap = data[3].reduce(function(o, val) {
          o[val.Talent] = val;
          return o;
        }, {});
        this.perfectAttributes = data[4].filter( a => a.Quality === 'N');
        this.vendorGear = data[5].Gear[this.gearSlot];
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
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 8px;
    padding: 8px;

    .tile {
      padding: unset; /* must unset so we can apply to content below */
      height:100%;
      min-height: 10px;

      .tile-content {
        padding: 16px;
      }
		}
    .remove-item {
      grid-column: 1 / -1;
		}
    .gear-slot {
      position: relative;
      min-width: 250px; /* must be the same as grid min */
      max-width: 500px;
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
        .bonus-wrap {
          border-left: 2px solid white;
          margin-top: 5px;
          padding-left: 6px;
          .bonus {
            white-space: pre-line;
          }
        }
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
          &.mod {
            content: url("data:image/svg+xml,%3Csvg version='1.0' xmlns='http://www.w3.org/2000/svg' style='fill:white' viewBox='0 0 300 300'%3E%3Cpath d='M149 10c-14 0-18 1-20 2-3 2-5 7-5 15l-3 11c-2 6-3 7-9 10-6 4-16 7-21 7l-7-2-12-9-3-3-5-2-3-2c-2 0-31 28-31 30 0 3 2 7 5 11 8 8 12 14 12 21l-5 13c-5 12-5 11-21 13-14 1-16 2-18 5s-2 4-2 25l1 17 9 3 8 2 10 2 10 2 2 6 4 8c6 8 5 12-3 20l-8 10-3 4-1 5c0 4 1 5 13 16 11 11 16 14 18 13l2-1 6-3 6-4 4-4 6-4c3-3 9-3 12 0l6 2c7 2 11 3 14 6 2 3 4 5 4 8a393 393 0 0 1 4 19c0 5 1 6 4 7l21 1h18l4-3c3-4 4-5 5-11l1-10c0-3 4-11 7-13l7-2 10-4c5-4 7-3 13 1l5 2 3 2c0 2 2 3 3 4l6 3c6 5 9 4 19-5l14-13c5-5 5-6 5-9l-4-6-3-3-3-5-6-7-3-6c-1-2-1-2 1-5 2-2 3-5 3-7l4-9c4-5 6-6 19-7 14 0 15-1 18-5l3-4 1-17-1-19-5-5c-3-2-4-3-15-3-14-1-17-2-20-10l-4-9-3-7c0-3 0-4 3-8l15-20c2-3 2-4-7-13-20-20-19-19-24-18-3 0-5 0-7 3l-7 4-7 5-7 4c-4 0-12-2-14-4l-7-2c-8-2-10-6-12-23-1-8-1-9-5-12l-5-4h-20zm18 58 9 2 8 2 6 3 8 4a103 103 0 0 1 25 22c1 1 3 3 3 5l4 7c2 2 3 5 4 10l3 12c2 3 2 8 3 13 0 8 0 10-2 16l-3 10c0 3-2 7-7 18l-16 19c-9 9-14 13-17 13l-6 3c-4 4-4 4-24 7-12 2-14 2-26 1-9-1-14-2-18-4l-7-2-6-3-7-3-6-3a503 503 0 0 1-24-29c-1-1-3-4-3-7l-4-10c-2-5-2-6-2-20l1-19 3-10c1-4 2-8 4-10l3-6c0-2 4-7 9-13l4-5 3-3 6-4 6-3 5-4 7-4 10-3 10-3c5-1 29-1 34 1z'/%3E%3Cpath d='m141 83-11 2c-10 1-16 3-16 5l-4 3c-4 2-16 13-18 18l-9 12c-1 2-3 6-4 14-2 12-2 17 0 25l2 9c0 4 7 17 13 24 5 6 11 11 16 14l6 3 7 3 8 2c5 3 13 4 28 2 10-1 13-1 19-4l8-4 4-2 5-5c4-2 7-5 15-14l5-8 3-8c4-5 5-18 4-31s-3-18-5-20l-4-6a55 55 0 0 0-27-26l-6-3-6-3a197 197 0 0 0-34-2zm14 11 10 3c8 1 17 5 22 9 12 11 18 21 20 32l1 17c-1 10-1 11-5 19-4 10-15 22-20 23l-7 4c-7 4-19 6-33 6-9-1-11-1-14-3l-7-3-7-4a106 106 0 0 1-16-17c-3-4-4-7-6-17-3-13-1-27 5-37 7-13 11-17 15-19 2 0 5-2 6-4l10-4 11-4c7-2 11-2 15 0z'/%3E%3Cpath d='M142 113c-2 1-2 3-2 9 0 11-1 15-3 16l-14 2-13 3c-3 3-3 15 0 17l12 1h11l3 4c3 3 3 3 4 13 1 13 2 14 10 14 10 0 11-1 11-14l2-12c1-3 4-4 12-4 7 0 16-3 18-7v-10c-1-3-11-6-21-7-7 0-9-1-10-2l-1-12-2-12c-2-2-15-2-17 1z'/%3E%3C/svg%3E");
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
