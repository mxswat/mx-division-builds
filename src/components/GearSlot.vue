<template>
  <div @click="onClick()" class="gear-container">
    <template v-if="isGearSelected()">
      <div class="gear-element gear-name" v-on:click="openGearModal()">{{ currentGear.itemName}}</div>
      <!-- <div class="brand-name">{{ currentGear.brand}}</div> -->
      <div class="gear-element core-attribute">
        <v-select
          placeholder="Core attribute"
          :clearable="false"
          v-model="currentGear.core"
          :options="coreAttributes"
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
      <div class="gear-element attribute-one">
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
      <div class="gear-element attribute-two">
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
      <div class="gear-element mod-slot" v-if="currentGear.filters.mod">
        <v-select
          placeholder="Mod"
          :clearable="false"
          :options="gearMods"
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
      <div class="gear-element talent" v-if="gearTalents.length > 0">
        <v-select
          placeholder="Talent"
          :clearable="false"
          label="Talent"
          v-model="currentGear.talent"
          :options="gearTalents"
        ></v-select>
        <div class="talent-description" v-if="currentGear.talent">{{currentGear.talent.Desc}}</div>
      </div>
    </template>

    <span class="no-gear-selected" v-if="!isGearSelected()">
      <p>CHOSE YOUR GEAR</p>
    </span>
  </div>
</template>

<script>
import { openGearModal } from "../utils/openGearModal";
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
    name: undefined
  },
  data() {
    return {
      currentGear: null,
      coreAttributes: [
        { label: "Weapon Damage", value: 15, Type: "O", index: 0 },
        { label: "Skill Tier", value: 1, Type: "U", index: 1 },
        { label: "Armor", value: 170000, Type: "D", index: 2 }
      ],
      typeToImgSrc: null,
      gearMods: undefined,
      gearAttributes: undefined,
      gearTalents: undefined,
      allTalents: undefined
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
      gearAttributesList.Attributes.then(res => {
        this.gearAttributes = res;
      });
    },
    initGearTalentsList() {
      // At the moment I don't need to divide the talent by gear
      // So, no separate files
      gearTalentsList.GearTalents.then(talents => {
        this.allTalents = talents;
        this.gearTalents = talents.filter(talent => {
          return talent.Slot === this.name;
        });
      });
    },
    filterGearAttributes(attributes, otherAttribute) {
      return attributes.filter(attribute => {
        return !otherAttribute ? true : otherAttribute.index !== attribute.index;
      });
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
        // console.log("watched", val, oldVal);
        this.$parent.gearChanged(val);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.gear-container {
  height: 100%;
  color: white;
}

.gear-element {
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

.no-gear-selected {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  cursor: pointer;
  p {
    position: absolute;
    bottom: 16px;
    left: 0px;
    right: 0px;
    color: orange;
    text-align: center;
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