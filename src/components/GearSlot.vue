<template>
  <div @click="onClick()" class="gear-container">
    <template v-if="isGearSelected()">
      <div class="slot-element gear-name" v-on:click="openGearModal()">{{ currentGear.itemName}}</div>
      <!-- <div class="brand-name">{{ currentGear.brand}}</div> -->
      <div class="slot-element stat-edit core-attribute">
        <v-select
          placeholder="Core attribute"
          :clearable="false"
          v-model="currentGear.core"
          :options="currentGear.quality === 'Exotic' ? [] : coreAttributes"
        >
          <template v-slot:option="option">
            <img class="attribute-image" v-bind:src="typeToImgSrc.core[option.Type]" />
            <span class="attribute-label">{{ option.label }}</span>
            <span class="attribute-value">{{option.value}}</span>
          </template>
          <template #selected-option="option">
            <img class="attribute-image" v-bind:src="typeToImgSrc.core[option.Type]" />
            <span class="attribute-label">{{ option.label }}</span>
          </template>
        </v-select>
        <StatInput v-bind:stat="currentGear.core" v-bind:maxPath="'value'"></StatInput>
      </div>
      <div class="slot-element stat-edit attribute-one">
        <v-select
          placeholder="Minor attribute 1"
          :clearable="false"
          :options="filterGearAttributes(gearAttributes, currentGear.attributeTwo, currentGear.filters.attributeOne)"
          v-model="currentGear.attributeOne"
          label="Stat"
        >
          <template v-slot:option="option">
            <img class="attribute-image" v-bind:src="typeToImgSrc.attribute[option.Type]" />
            <span class="attribute-label">{{ option.Stat }}</span>
            <span class="attribute-value">{{option.Max}}</span>
          </template>
          <template #selected-option="option">
            <img class="attribute-image" v-bind:src="typeToImgSrc.attribute[option.Type]" />
            <span class="attribute-label">{{ option.Stat }}</span>
          </template>
        </v-select>
        <StatInput v-bind:stat="currentGear.attributeOne" v-bind:maxPath="'Max'"></StatInput>
      </div>
      <div class="slot-element stat-edit attribute-two" v-if="currentGear.filters.attributeTwo">
        <v-select
          placeholder="Minor attribute 2"
          :clearable="false"
          :options="filterGearAttributes(gearAttributes, currentGear.attributeOne, currentGear.filters.attributeTwo)"
          v-model="currentGear.attributeTwo"
          label="Stat"
        >
          <template v-slot:option="option">
            <img class="attribute-image" v-bind:src="typeToImgSrc.attribute[option.Type]" />
            <span class="attribute-label">{{ option.Stat }}</span>
            <span class="attribute-value">{{option.Max}}</span>
          </template>
          <template #selected-option="option">
            <img class="attribute-image" v-bind:src="typeToImgSrc.attribute[option.Type]" />
            <span class="attribute-label">{{ option.Stat }}</span>
          </template>
        </v-select>
        <StatInput v-bind:stat="currentGear.attributeTwo" v-bind:maxPath="'Max'"></StatInput>
      </div>
      <div class="slot-element stat-edit mod-slot" v-if="currentGear.filters.mod">
        <v-select
          placeholder="Mod"
          :clearable="false"
          :options="filterGearMods(gearMods)"
          v-model="currentGear.mod"
          label="Stat"
        >
          <template v-slot:option="option">
            <img class="attribute-image" v-bind:src="typeToImgSrc.mod[option.Type]" />
            <span class="attribute-label">{{ option.Stat }}</span>
            <span class="attribute-value">{{option.Max}}</span>
          </template>
          <template #selected-option="option">
            <img class="attribute-image" v-bind:src="typeToImgSrc.mod[option.Type]" />
            <span class="attribute-label">{{ option.Stat }}</span>
          </template>
        </v-select>
        <StatInput v-bind:stat="currentGear.mod" v-bind:maxPath="'Max'"></StatInput>
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
import StatInput from "./StatInput";

export default {
  name: "GearSlot",
  components: { StatInput },
  props: {
    gearList: undefined,
    name: undefined,
    init: null
  },
  data() {
    return {
      currentGear: new GearBase(),
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
      allGearAttributes: null
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
          this.currentGear.attributeOne = this.allGearAttributes.find(
            attribute =>
              attribute.Stat === this.currentGear.filters.attributeOne
          );
          this.currentGear.attributeTwo = this.allGearAttributes.find(
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
        this.allGearAttributes = attributes;
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
    filterGearAttributes(attributes, otherAttribute, filter) {
      // TODO  Clean code like I did for filterWeaponModsByType();
      switch (this.currentGear.quality) {
        case "Exotic": {
          attributes = [];
          break;
        }
        case "Named":
          // If it is longer than 1 is clearly a name on not just A,O or U
          if (filter.length > 1) {
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
      return currentGearFilters.talent !== "A";
    }
  },
  created() {
    this.typeToImgSrc = typeToImgSrc;
    this.initGearMods();
    this.initGearAttributes();
    this.initGearTalentsList();
  },
  watch: {
    currentGear: {
      handler: function(val, oldVal) {
        this.$parent.slotChanged(val);
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
          this.currentGear.attributeOne = this.allGearAttributes.find(
            attribute => attribute.index === parseInt(splittedIdS[1])
          );
          this.currentGear.attributeTwo = this.allGearAttributes.find(
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

// attribute-label
.attribute-value {
  margin-left: auto;
}
</style>