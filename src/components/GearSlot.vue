<template>
  <div @click="onClick()" class="gear-container">
    <template v-if="isGearSelected()">
      <div class="slot-element gear-name" v-on:click="openGearModal()">{{ currentGear.itemName}}</div>
      <!-- <div class="brand-name">{{ currentGear.brand}}</div> -->
      <div class="slot-element core-attribute">
        <v-select
          placeholder="Core attribute"
          :clearable="false"
          v-model="currentGear.core"
          :options="currentGear.quality === 'Exotic' ? [] : coreAttributes"
        >
          <template v-slot:option="option">
            <img class="attribute-image" v-bind:src="typeToImgSrc[option.Type]" />
            <span class="attribute-label">{{ option.label }}</span>
            <span class="attribute-value">{{option.value}}</span>
          </template>
          <template #selected-option="option">
            <img class="attribute-image" v-bind:src="typeToImgSrc[option.Type]" />
            <span class="attribute-label">{{ option.label }}</span>
            <span class="attribute-value">{{option.value}}</span>
          </template>
        </v-select>
      </div>
      <div class="slot-element attribute-one">
        <v-select
          placeholder="Minor attribute 1"
          :clearable="false"
          :options="filterGearAttributes(gearAttributes, currentGear.attributeTwo)"
          v-model="currentGear.attributeOne"
          label="Stat"
        >
          <template v-slot:option="option">
            <img class="attribute-image" v-bind:src="typeToImgSrc[option.Type]" />
            <span class="attribute-label">{{ option.Stat }}</span>
            <span class="attribute-value">{{option.Max}}</span>
          </template>
          <template #selected-option="option">
            <img class="attribute-image" v-bind:src="typeToImgSrc[option.Type]" />
            <span class="attribute-label">{{ option.Stat }}</span>
            <span class="attribute-value">{{option.Max}}</span>
          </template>
        </v-select>
      </div>
      <div class="slot-element attribute-two">
        <v-select
          placeholder="Minor attribute 2"
          :clearable="false"
          :options="filterGearAttributes(gearAttributes, currentGear.attributeOne)"
          v-model="currentGear.attributeTwo"
          label="Stat"
        >
          <template v-slot:option="option">
            <img class="attribute-image" v-bind:src="typeToImgSrc[option.Type]" />
            <span class="attribute-label">{{ option.Stat }}</span>
            <span class="attribute-value">{{option.Max}}</span>
          </template>
          <template #selected-option="option">
            <img class="attribute-image" v-bind:src="typeToImgSrc[option.Type]" />
            <span class="attribute-label">{{ option.Stat }}</span>
            <span class="attribute-value">{{option.Max}}</span>
          </template>
        </v-select>
      </div>
      <div class="slot-element mod-slot" v-if="currentGear.filters.mod">
        <v-select
          placeholder="Mod"
          :clearable="false"
          :options="filterGearMods(gearMods)"
          v-model="currentGear.mod"
          label="Stat"
        >
          <template v-slot:option="option">
            <img class="attribute-image" v-bind:src="typeToImgSrc[option.Type]" />
            <span class="attribute-label">{{ option.Stat }}</span>
            <span class="attribute-value">{{option.Max}}</span>
          </template>
          <template #selected-option="option">
            <img class="attribute-image" v-bind:src="typeToImgSrc[option.Type]" />
            <span class="attribute-label">{{ option.Stat }}</span>
            <span class="attribute-value">{{option.Max}}</span>
          </template>
        </v-select>
      </div>
      <div class="slot-element talent" v-if="gearTalents.length > 0 || this.currentGear.talent">
        <v-select
          placeholder="Talent"
          :clearable="false"
          label="Talent"
          v-model="currentGear.talent"
          :options="filterGearTalents(gearTalents)"
        ></v-select>
        <div class="talent-description" v-if="currentGear.talent">{{currentGear.talent.Desc}}</div>
      </div>
    </template>

    <span class="no-element-selected" v-if="!isGearSelected()">
      <p>CHOSE YOUR GEAR</p>
    </span>
  </div>
</template>

<script>
import { openGearModal } from "../utils/modalService";
import { GearBase } from "../utils/classes";
import { typeToImgSrc } from "../utils/utils";
import {
  gearModsList,
  gearAttributesList,
  gearTalentsList
} from "../utils/dataImporter";

export default {
  name: "GearSlot",
  props: {
    gearList: undefined,
    name: undefined,
    init: null
  },
  data() {
    return {
      currentGear: GearBase,
      coreAttributes: [
        { label: "Weapon Damage", value: 15, Type: "O", index: 1 },
        { label: "Skill Tier", value: 1, Type: "U", index: 0 },
        { label: "Armor", value: 170000, Type: "D", index: 2 }
      ],
      typeToImgSrc: null,
      gearMods: null,
      gearAttributes: null,
      gearTalents: null,
      allTalents: null,
      allAttributes: null
    };
  },
  methods: {
    isGearSelected() {
      return this.currentGear && this.currentGear.itemName;
    },
    onClick() {
      if (!this.isGearSelected()) {
        this.openGearModal();
      }
    },
    onModalClose(data) {
      this.currentGear = new GearBase(data);
      switch (this.currentGear.quality) {
        case "Exotic":
        case "Named":
          this.currentGear.core = this.coreAttributes.find(
            attribute => attribute.label === this.currentGear.filters.core
          );
          this.currentGear.attributeOne = this.gearAttributes.find(
            attribute =>
              attribute.Stat === this.currentGear.filters.attributeOne
          );
          this.currentGear.attributeTwo = this.gearAttributes.find(
            attribute =>
              attribute.Stat === this.currentGear.filters.attributeTwo
          );
          this.currentGear.talent = this.allTalents.find(talent => {
            return talent.Talent === this.currentGear.filters.talent;
          });
          break;
        case "Gearset":
          this.currentGear.talent = this.allTalents.find(talent => {
            return talent.Talent === this.currentGear.filters.talent;
          });
          break;
        default:
          break;
      }
    },
    openGearModal() {
      openGearModal(this.gearList, this.onModalClose);
    },
    initGearMods() {
      gearModsList.GearMods.then(res => {
        this.gearMods = res;
      });
    },
    initGearAttributes() {
      gearAttributesList.Attributes.then(attributes => {
        this.allAttributes = attributes;
        this.gearAttributes = attributes.filter(attribute => {
          return attribute.Quality === "A";
        });
      });
    },
    initGearTalentsList() {
      // At the moment I don't need to divide the talent by gear
      // So, no separate files
      gearTalentsList.GearTalents.then(talents => {
        this.allTalents = talents;
        this.gearTalents = talents.filter(talent => {
          return talent.Slot === this.name && talent.Quality === "A";
        });
      });
    },
    filterGearMods(mods) {
      if (this.currentGear.quality === "Exotic") {
        mods = mods.filter(mod => {
          return mod.Type === this.currentGear.filters.mod;
        });
      }
      return mods;
    },
    filterGearAttributes(attributes, otherAttribute) {
      const isTheOtherAttributeTheNamedOne =
        otherAttribute &&
        otherAttribute.index === this.currentGear.attributeOne.index;
      switch (this.currentGear.quality) {
        case "Exotic": {
          attributes = [];
          break;
        }
        case "Named":
          if (
            !this.isNamedTalent(this.currentGear.filters) &&
            !isTheOtherAttributeTheNamedOne
          ) {
            attributes = [];
          }
          break;
        case "Gearset":
          break;
        default:
          break;
      }
      return attributes.filter(attribute => {
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
      return !!currentGearFilters.talent;
    }
  },
  components: {},
  created() {
    this.typeToImgSrc = typeToImgSrc;
    this.initGearMods();
    this.initGearAttributes();
    this.initGearTalentsList();
  },
  watch: {
    currentGear: {
      handler: function(val, oldVal) {
        this.$parent.gearChanged(val);
      },
      deep: true
    },
    init: {
      handler: function(ids) {
        const splittedIdS = ids.split("-");
        const gearId = parseInt([splittedIdS[0]]);
        // id 0
        // attributeOne.index 1
        // attributeTwo.index 2
        // core.index 3
        // mod.index 4
        // talent.index 5
        if (gearId) {
          const fromUrlGear = new GearBase(
            this.gearList.find(gear => gear.index === gearId)
          );
          this.currentGear = fromUrlGear;
          this.currentGear.attributeOne = this.gearAttributes.find(
            attribute => attribute.index === parseInt(splittedIdS[1])
          );
          this.currentGear.attributeTwo = this.gearAttributes.find(
            attribute => attribute.index === parseInt(splittedIdS[2])
          );
          this.currentGear.core = this.coreAttributes.find(
            attribute => attribute.index === parseInt(splittedIdS[3])
          );
          this.currentGear.mod = this.gearMods.find(
            mod => mod.index === parseInt(splittedIdS[4])
          );
          this.currentGear.talent = this.allTalents.find(
            talent => talent.index === parseInt(splittedIdS[5])
          );
        }
      }
    }
  }
};
</script>

<style lang="scss">
.gear-container {
  height: 100%;
  color: white;
}

.slot-element {
  margin-top: 8px;
  align-items: center;
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  .attribute-image {
    height: 25px;
    width: 25px;
    padding: 4px;
    margin-top: -3px;
  }
}

.gear-name {
  border-bottom: 1px solid white;
  padding: 8px;
  cursor: pointer;
  position: relative;
  &::after {
    content: "";
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABaklEQVR4Xu2aTUoDQRCFv2yNP9cInsCtbkWCl9EraE4jwWXIVo8gXiIkxL0URNBON3Yyq6p6s00z9Hv1VVdPpUYkf0bJ9SMDREByB5QCyQHQIagUUAokd0Ap0ABgAjwBN8CZc0i+gCXwAHyUWmoEmPh34MK58HL7a+CqNKFmwAswDSb+R8681FYzYBMA+1b8tqW2mgG2aByUgC4DDJO7oAZYet//1pbpEFztDsHP/wyw360SPO/K4KlzGgz7BfAI/BFvunQRch7dwdsXAYMtdP4CEeA8gIO3LwIGW+j8BS0CLoEZcA2cONd4cD/AxL8B586FH90PeAVug4k/qB9gyHjHXv2AhgPqB6gfUHwSt8qg+gFBq8CeLF2Fs0S6pVMEiIDkDigFkgPQ/F9A/QD1A2LmRtd8gPoBmg/QfEDIISnNB2g+oFLZdBWOWe77VYmAfq9irhQBMePar0oE9HsVc6UIiBnXflXpCfgGC8dCQbbkoGgAAAAASUVORK5CYII=");
    height: 15px;
    width: 15px;
    position: absolute;
    right: 6px;
    background-position: center;
    background-size: cover;
    filter: invert(1);
  }
}

.talent-description {
  padding: 10px;
}

// attribute-label
.attribute-value {
  margin-left: auto;
}
</style>