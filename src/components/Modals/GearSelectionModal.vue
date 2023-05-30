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
                :start="gear.Quality === 'Gearset' ? 2 : 1"
                v-if="getBonuses(gear).length > 0"
            >
              <li
                class="bonus-wrap"
                v-for="(bonuses, idx) in getBonuses(gear)"
                v-bind:key="idx"
              >
                <span
                  class="bonus talent-wrap"
                  v-for="bonus in bonuses"
                  v-bind:key="bonus"
                >
                  {{ bonus }}
                  <br />
                </span>
              </li>
            </ol>
            <ul class="perfect-attributes" v-if="getPerfectAttributes(gear).length > 0">
              <li
                v-for="(attribute, idx) in getPerfectAttributes(gear)"
                v-bind:key="idx"
              >
                {{ attribute }}
              </li>
            </ul>
            <ul class="extra-mod-slot" v-if="hasExtraModSlot(gear)">
              <li>
                Extra Mod Slot
              </li>
            </ul>
            <div class="talent-wrap" v-if="getTalentDesc(gear.Talent)">
              {{ getTalentDesc(gear.Talent) }}
            </div>
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
        gearTalentsMap: {},
        perfectAttributes: [],
        searchText: "",
        vendorGear: [],
      };
    },
    methods: {
      getBrandOrGearsetIcon(name) {
        return this.BrandsData[name]
          ? `/icons/brands/${this.BrandsData[name].Icon}`
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
      getPerfectAttributes(gear) {
        let result = [];
        if (gear['Quality'] !== 'Named') {
          return result;
        }
        ['Attribute 1', 'Attribute 2', 'Attribute 3'].forEach((key) => {
          if (gear[key] && gear[key].length > 1) {
            let found = this.perfectAttributes.find((a) => a.Stat === gear[key]);
            if (found) {
              result.push(`${found.Stat.trim()} ${found.Max}`);
            }
          }
        })
        return result;
      },
      hasExtraModSlot(gear){
        return (
          (gear['Mod 2'] && ['Mask','Chest','Backpack'].includes(this.gearSlot)) ||
          (gear['Mod'] && ['Gloves','Holster','Kneepads'].includes(this.gearSlot))
        );
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

  ul.extra-mod-slot {
    list-style-type :none;
  }

  ul.extra-mod-slot > li::before {
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -256 1792 1792'%3E%3Cpath d='M1024 640q0 106-75 181t-181 75q-106 0-181-75t-75-181q0-106 75-181t181-75q106 0 181 75t75 181zm512 109V527q0-12-8-23t-20-13l-185-28q-19-54-39-91 35-50 107-138 10-12 10-25t-9-23q-27-37-99-108t-94-71q-12 0-26 9l-138 108q-44-23-91-38-16-136-29-186-7-28-36-28H657q-14 0-24.5 8.5T621-98L593 86q-49 16-90 37L362 16q-10-9-25-9-14 0-25 11-126 114-165 168-7 10-7 23 0 12 8 23 15 21 51 66.5t54 70.5q-27 50-41 99L29 495q-13 2-21 12.5T0 531v222q0 12 8 23t19 13l186 28q14 46 39 92-40 57-107 138-10 12-10 24 0 10 9 23 26 36 98.5 107.5T337 1273q13 0 26-10l138-107q44 23 91 38 16 136 29 186 7 28 36 28h222q14 0 24.5-8.5T915 1378l28-184q49-16 90-37l142 107q9 9 24 9 13 0 25-10 129-119 165-170 7-8 7-22 0-12-8-23-15-21-51-66.5t-54-70.5q26-50 41-98l183-28q13-2 21-12.5t8-23.5z' style='fill:currentColor' transform='matrix(1 0 0 -1 121.492 1285.424)'/%3E%3C/svg%3E");
    filter: invert(100%);
    display: inline-block;
    width: 1.5em;
    margin-left: -2.75em;
    vertical-align: text-top;
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
