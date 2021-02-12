<template>
  <div class="overflow-handler">
    <div class="gear-grid">
      <div
        class="gear-slot"
        v-for="(gear, idx) in gearList"
        v-bind:key="idx"
        :class="[qualityToCSS(gear.Quality)]"
        @click="onSelection(gear)"
      >
        <BasicTile :classes="'anim-enabled'">
          <span class="name">
            {{ getDisplayName(gear) }}
          </span>
          <ol class="bonuses-container" v-if="getBonuses(gear).length > 0">
            <li
              class="bonus-wrap"
              v-for="(bonuses, idx) in getBonuses(gear)"
              v-bind:key="idx"
            >
              <span class="bonus" v-for="bonus in bonuses" v-bind:key="bonus">
                {{ bonus }}
                <br />
              </span>
            </li>
          </ol>
          <div>
            {{ getTalentDesc(gear.Talent) }}
          </div>
        </BasicTile>
        <img
          v-if="getBrandOrGearsetIcon(gear['Brand'])"
          class="gear-logo"
          :src="getBrandOrGearsetIcon(gear['Brand'])"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>

import {
  gearData as gearMetaData,
  IsEverythingLoadedPromise,
} from "../../utils/dataImporter";
import { qualityToCss, QualityPriority } from "../../utils/utils";
import BasicTile from "../BasicTile";
export default {
  name: "GearSelectionModal",
  props: ["gearData", "onModalClose", "tableHeaders"],
  components: {
    BasicTile,
  },
  data() {
    return {
      gearList: [],
      BrandsData: [],
      gearTalentsMap: {},
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
      return gear["Brand"] === gear["Item Name"]
        ? gear["Item Name"]
        : `${gear["Item Name"]} (${gear["Brand"]})`;
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
      return brandSetBonuses.reduce((o, val) => {
        o[val.Brand.slice(0, -1)] = o[val.Brand.slice(0, -1)] || [];
        const bonuses = [`${val.stat} ${val.val}`];
        if (val.stat1) {
          bonuses.push(`${val.stat1} ${val.val1}`);
        }
        o[val.Brand.slice(0, -1)].push(bonuses);
        return o;
      }, {});
    },
  },
  created() {
    Promise.all([
      IsEverythingLoadedPromise,
      gearMetaData.BrandsData,
      gearMetaData.BrandSetBonuses,
      gearMetaData.GearTalents,
    ]).then((res) => {
      this.BrandsData = res[1].reduce(function (o, val) {
        o[val.Brand] = val;
        return o;
      }, {});
      this.BrandsMapping = this.buildBrandAndGearsetsMapping(res[2]);
      this.gearList = this.gearData.sort(
        (a, b) =>
          QualityPriority[a["Quality"]] - QualityPriority[[b["Quality"]]] ||
          a["Item Name"].localeCompare(b["Item Name"])
      );
      this.gearTalentsMap = res[3].reduce(function (o, val) {
        o[val.Talent] = val;
        return o;
      }, {});
    });
  },
  mounted() {},
};
</script>

<style lang="scss">
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
</style>