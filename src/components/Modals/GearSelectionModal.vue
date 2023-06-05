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
            <ol class="bonuses-container"
                v-if="getBonuses(gear).length > 0"
                :start="gear.Quality === 'Gearset' ? 2 : 1"
            >
              <li
                class="bonus-wrap"
                v-for="(bonuses, idx) in getBonuses(gear)"
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
              v-for="(perk, idx) in getPerks(gear)"
              v-bind:key="idx"
            >
              <div class="perk-icon" :class="perk.type"></div>
              <div class="perk">{{ perk.desc }}</div>
            </div>
            <div class="talent"
              >{{ getTalentDesc(gear.Talent) }}</div
            >
            <div v-if="isAvailableAtVendor(gear)" class="vendor-label">
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
        perfectAttributes: [],
        gearTalentsMap: {},
        searchText: "",
        vendorGear: [],
      };
    },
    methods: {
      getBrandOrGearsetIcon(name) {
        return this.BrandsData[name]
          ? `icons/brands/${this.BrandsData[name].Icon}`
          : "";
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
      filterByName(list) {
        return list.filter((gear) =>
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
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
      min-height: 180px;
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
            content: url("data:image/svg+xml,%3Csvg version='1.0' xmlns='http://www.w3.org/2000/svg' style='fill:white' viewBox='0 0 300 300'%3E%3Cpath d='M148.5 10c-14 .4-17.6.8-19.7 2.2-3.1 2-4.8 7-4.8 14.3-.1 3.2-1.1 7.4-2.9 11.5-2.5 5.9-3.3 6.8-8.7 9.9C105.5 51.8 96 55 91 55c-1.9 0-5.1-1-7.1-2.3C76 47.9 72 44.9 72 43.9c0-.5-1.5-1.6-3.3-2.4-1.9-.8-3.9-2.1-4.7-2.9-.7-.9-2-1.6-3-1.6-2.2 0-31 28.1-31 30.3 0 3 2.2 7.2 5.3 10.4 8 7.9 11.7 14.5 11.7 20.9 0 2.2-1.8 7.4-4.7 13.4-5.4 11.6-5.1 11.4-21.7 13.1-13.7 1.4-15.5 1.9-17.7 5-2.1 2.8-2.1 3.5-2 24.6.1 12.7.4 16.5 1.6 17.6.8.8 4.4 2 8.1 2.7 3.7.6 7.6 1.6 8.6 2.1s5.5 1.4 10 2c4.5.6 8.8 1.5 9.4 2 .7.5 1.7 3.1 2.4 5.7.6 2.6 2.2 6.1 3.6 7.9 6.1 8 5.6 12.5-2.2 20.8-3.1 3.3-6.7 7.6-8 9.7-1.3 2-2.8 3.9-3.4 4.3-.5.3-1 2.2-1 4.2 0 3.9.8 5 13.1 16.6 11 10.4 15.8 13.9 17.9 13.2 1.1-.3 2-1 2-1.5 0-.4 2.5-1.8 5.6-3.1 3.1-1.3 6-3.1 6.5-4.1.5-1 2.4-2.5 4.2-3.4 1.8-.9 4.2-2.7 5.4-4 2.9-3.1 9.2-3.3 11.8-.4 1 1.1 3.7 2.2 6.4 2.5 7.5 1.1 10.6 2.3 14.1 6 2.1 2.2 3.6 4.9 4.1 7.7.5 2.4 1.3 6.5 1.8 9.3.6 2.7 1.4 7.2 1.8 10 .7 4.6 1.1 5.1 4.4 6.2 2 .6 11.3 1.3 21.2 1.4l17.7.3 3.9-3.8c3.3-3.2 4-4.7 5-10.6.6-3.8 1.1-8.1 1.1-9.6 0-3.5 3.9-11.3 6.6-13 1.1-.8 4.4-1.8 7.4-2.4 2.9-.5 7.4-2.4 9.9-4 5.2-3.5 7.2-3.4 13 .6 1.9 1.3 4.1 2.4 4.8 2.4.7 0 2 1.1 2.9 2.5.9 1.3 2.6 2.7 3.7 3.1 1.2.4 3.7 2 5.5 3.5 5.8 5.1 8.8 4.3 19.5-5.3 5.1-4.5 11.4-10.4 14.1-13.1 4.4-4.5 4.8-5.3 4.2-8.5-.3-2.4-1.6-4.4-3.6-6-1.6-1.3-3-2.8-3-3.4 0-.6-1.5-2.7-3.2-4.8-1.8-2-4.2-5.2-5.3-7-1.1-1.8-2.6-4.3-3.4-5.6-1.3-2-1.2-2.4 1.1-5.2 1.4-1.7 2.8-4.9 3.2-7.2.4-2.3 2-6.2 3.7-8.6 3.5-5.1 5.9-5.9 19.4-6.9 13.2-.9 14.1-1.2 17.7-5.8l3.3-4.1.1-16.6c0-9.1-.3-17.5-.7-18.7-.4-1.1-2.5-3.4-4.5-5-3.4-2.6-4.6-2.8-14.9-3.4-14.1-.6-17-2.1-20.1-10-1.1-3.1-3.1-6.9-4.2-8.5-1.2-1.6-2.4-4.7-2.8-6.9-.5-3.6-.2-4.6 2.8-8.2 4-4.9 12.6-16.5 15-20.1 2.1-3.2 1.7-4-7-12.7-20.4-20.3-18.8-19-23.7-18.9-3.7.1-5.2.7-7.8 3.1-1.8 1.7-4.8 3.9-6.7 4.8-1.9 1-5 3-6.7 4.6-1.8 1.5-4.8 3.1-6.8 3.5-4.1.7-12.2-1.1-14.7-3.3-1-.8-3.9-1.9-6.5-2.4-8.1-1.5-10.5-5.8-12.4-22.7-.9-8-1.3-9-4.5-12.4-2-2-4.6-3.8-5.8-4-1.1-.1-9.8-.1-19.1.2zm18 57.8c2.2.6 6.7 1.5 9.9 2.1 3.2.6 6.7 1.8 7.6 2.6 1 .9 3.5 2.1 5.6 2.7 2.2.5 5.9 2.2 8.3 3.7 6.2 3.8 18.3 14.2 20.6 17.8 1.1 1.8 3 3.7 4.2 4.4 1.2.6 2.9 3 3.8 5.2.9 2.2 2.6 5.3 3.9 6.7 1.4 1.7 2.7 5.4 3.5 10 .7 4 2.2 9.3 3.4 11.8 1.3 3 2.1 7.7 2.5 13.2.4 7.5.1 9.6-2.2 16.2-1.4 4.2-2.6 8.9-2.6 10.3 0 2.4-1.9 6.7-7.4 17.1-2.9 5.6-7.2 10.9-15.5 19.3-9.3 9.3-14.3 13.1-17.3 13.1-.9 0-3.4 1.5-5.7 3.4-4.3 3.6-4.3 3.6-23.9 6.6-11.9 1.8-14.7 1.9-26 .9-9.5-.9-14-1.8-17.8-3.5-2.8-1.3-5.9-2.4-7-2.4-1 0-4.1-1.4-6.9-3-2.7-1.6-5.8-3-6.7-3-1 0-3.4-1.5-5.4-3.4-2-1.9-4-3.8-4.5-4.3-4.5-4.1-14.3-15.2-15.6-17.7-.9-1.7-2.8-4.5-4.3-6.2-1.5-1.7-3-4.9-3.3-7.1-.4-2.2-1.9-6.7-3.4-9.9-2.5-5.6-2.7-6.8-2.7-20.9-.1-12 .2-15.7 1.6-18.5.9-1.9 2.2-6.4 2.9-10 .7-4.1 2.3-8 4-10.4 1.6-2.2 2.9-4.8 2.9-5.7 0-1.6 3.7-6.7 9.3-12.9 1.3-1.4 3.1-3.7 4-5.3 1-1.5 2.3-2.7 3.1-2.7.7 0 3.3-1.6 5.7-3.5 2.4-1.9 4.9-3.5 5.6-3.5.6 0 3-1.6 5.3-3.5s5.4-3.8 6.9-4.1c1.4-.3 5.8-1.7 9.6-3.2 3.9-1.4 8.6-2.9 10.5-3.3 4.9-1 28.7-.4 33.5.9z'/%3E%3Cpath d='M140.7 82.6c-.2.2-5 1.1-10.8 2-10.2 1.6-15.9 3.5-15.9 5.4 0 .5-1.7 1.8-3.7 2.9-4.5 2.3-16 13.3-18.6 17.6-1.9 3.4-5.6 8.7-8.6 12.6-1.4 1.8-2.6 6.2-3.8 13.5-2.1 12.7-2 17.7.1 25.9.9 3.2 1.6 7.2 1.6 8.8 0 3.6 6.9 16.3 12.7 23.5 5.1 6.2 11.3 11.5 16.3 13.8 1.9.9 4.5 2.4 5.8 3.5 1.3 1 4.4 2.1 7 2.5 2.6.3 6.3 1.5 8.2 2.6 4.6 2.7 13.5 3.3 28.3 2 10.2-1 12.7-1.6 18.9-4.7 3.9-1.9 7.7-3.5 8.3-3.5.7 0 2-1 3.1-2.1 1-1.2 3.7-3.3 5.8-4.7 3.8-2.3 6.5-5.1 14.9-14.7 1.9-2.2 4-5.8 4.7-8 .7-2.2 2.2-5.6 3.5-7.5 3.5-5.3 4.9-17.9 3.5-31-1.4-12.8-2.6-17.9-5-20.5-1.1-1.1-2.6-3.7-3.5-5.8-3.3-7.8-12.8-18.1-21-22.6-2.2-1.2-5.1-2.8-6.5-3.6-1.4-.8-4-2.1-5.7-3-1.8-.8-4.5-2.1-6-2.9-1.9-.9-7.9-1.5-18-1.9-8.4-.2-15.4-.3-15.6-.1zm14.2 11.9c1.6.8 6.2 1.8 10.2 2.3 7.6 1 17 5.1 21.8 9.5 11.9 11.1 18 20.6 20.1 31.5.8 3.7 1.1 10.6.8 17.1-.4 10.2-.7 11.4-4.5 19.2-4.7 9.7-15.7 22.4-20.3 23.4-1.6.3-4.9 2-7.4 3.6-6.2 4.1-18.5 6.3-32.6 5.7-8.5-.4-11.2-.9-14-2.6-1.9-1.2-5.1-2.7-7.1-3.2-2-.6-5.1-2.4-7-4-6.1-5.5-12.9-12.3-12.9-13 0-.4-1.4-2.4-3-4.5-3-3.8-3.9-6.3-6.1-17-2.6-13-.6-26.5 5.3-37 6.8-12.1 10.7-16.9 14.5-18.2 1.9-.7 5-2.6 6.8-4.2 2.2-1.9 5.4-3.4 9.1-4.1 3.1-.7 8.4-2.3 11.8-3.6 7.1-2.7 10.6-2.9 14.5-.9z'/%3E%3Cpath d='M141.6 112.6c-1.2 1.1-1.6 3.6-1.6 9.8 0 10.6-.8 14.4-3.1 15.7-1.1.5-7.2 1.4-13.7 2-7.7.7-12.2 1.5-13.3 2.5-3.3 3-3.1 15.4.3 17.5.7.5 6 .9 11.9.9h10.5l3.4 3.5c3.1 3.2 3.4 3.9 4 13 1 13 2.1 14.5 10.3 14.5 9.7 0 10.3-.8 11-13.8.4-6 .9-11.6 1.3-12.6 1-2.5 4.6-3.6 12.2-3.6 7.5 0 16.2-3.3 18.1-6.9 1.4-2.5 1.4-7.6.1-10.1-1.5-2.9-10.9-5.8-21-6.6-6.8-.5-9.3-1.1-9.9-2.3-.5-.9-1.1-6.3-1.4-12-.4-5.6-1.2-10.9-1.8-11.7-1.7-2.1-15.2-1.9-17.3.2z'/%3E%3C/svg%3E");
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
