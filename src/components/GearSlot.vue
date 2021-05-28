<template>
  <div @click="onClick()" class="gear-container">
    <template v-if="isGearSelected()">
      <div
        class="slot-element gear-name"
        v-bind:class="[qualityToCSS(currentGear.quality)]"
        v-on:click="openGearModal()"
      >
        <div v-if="isNamedGear(currentGear)" class="named-container">
          <img src="icons/named.png" class="named-logo" />
          <span> {{ currentGear.itemName }} ({{ currentGear.brand }}) </span>
        </div>
        <div v-else>
          {{ currentGear.itemName }}
        </div>
      </div>
      <!-- <div class="brand-name">{{ currentGear.brand}}</div> -->
      <div class="slot-element stat-edit core-attribute">
        <v-select
          placeholder="Core attribute"
          :clearable="false"
          v-model="currentGear.core"
          :options="currentGear.quality === 'Exotic' ? [] : coreAttributes"
        >
          <template v-slot:option="option">
            <img
              class="attribute-image"
              v-bind:src="typeToImgSrc.core[option.Type]"
            />
            <span class="attribute-label">{{ option.label }}</span>
            <span class="attribute-value">{{ option.Max }}</span>
          </template>
          <template #selected-option="option">
            <img
              class="attribute-image"
              v-bind:src="typeToImgSrc.core[option.Type]"
            />
            <span class="attribute-label">{{ option.label }}</span>
          </template>
        </v-select>
        <StatInput
          v-if="currentGear.core"
          v-model="currentGear.core.StatValue"
          v-bind:max="currentGear.core.Max"
        ></StatInput>
      </div>
      <div
        class="slot-element stat-edit attribute-one"
        v-if="currentGear.filters.attributeOne"
      >
        <v-select
          placeholder="Minor attribute 1"
          :clearable="false"
          :options="
            filterGearAttributes(
              gearAttributes,
              currentGear.attributeTwo,
              currentGear.filters.attributeOne
            )
          "
          v-model="currentGear.attributeOne"
          label="Stat"
        >
          <template v-slot:option="option">
            <img
              class="attribute-image"
              v-bind:src="typeToImgSrc.attribute[option.Type]"
            />
            <span class="attribute-label">{{ option.Stat }}</span>
            <span class="attribute-value">{{ option.Max }}</span>
          </template>
          <template #selected-option="option">
            <img
              class="attribute-image"
              v-bind:src="typeToImgSrc.attribute[option.Type]"
            />
            <span class="attribute-label">{{ option.Stat }}</span>
          </template>
        </v-select>
        <StatInput
          v-if="currentGear.attributeOne"
          v-model="currentGear.attributeOne.StatValue"
          v-bind:max="currentGear.attributeOne.Max"
        ></StatInput>
      </div>
      <div
        class="slot-element stat-edit attribute-two"
        v-if="currentGear.filters.attributeTwo"
      >
        <v-select
          placeholder="Minor attribute 2"
          :clearable="false"
          :options="
            filterGearAttributes(
              gearAttributes,
              currentGear.attributeOne,
              currentGear.filters.attributeTwo
            )
          "
          v-model="currentGear.attributeTwo"
          label="Stat"
        >
          <template v-slot:option="option">
            <img
              class="attribute-image"
              v-bind:src="typeToImgSrc.attribute[option.Type]"
            />
            <span class="attribute-label">{{ option.Stat }}</span>
            <span class="attribute-value">{{ option.Max }}</span>
          </template>
          <template #selected-option="option">
            <img
              class="attribute-image"
              v-bind:src="typeToImgSrc.attribute[option.Type]"
            />
            <span class="attribute-label">{{ option.Stat }}</span>
          </template>
        </v-select>
        <StatInput
          v-if="currentGear.attributeTwo"
          v-model="currentGear.attributeTwo.StatValue"
          v-bind:max="currentGear.attributeTwo.Max"
        ></StatInput>
      </div>
      <div
        class="slot-element stat-edit mod-slot"
        v-if="currentGear.filters.mod"
      >
        <v-select
          placeholder="Mod"
          :clearable="false"
          :options="filterGearMods(gearMods)"
          v-model="currentGear.mod"
          label="Stat"
        >
          <template v-slot:option="option">
            <img
              class="attribute-image"
              v-bind:src="typeToImgSrc.mod[option.Type]"
            />
            <span class="attribute-label">{{ option.Stat }}</span>
            <span class="attribute-value">{{ option.Max }}</span>
          </template>
          <template #selected-option="option">
            <img
              class="attribute-image"
              v-bind:src="typeToImgSrc.mod[option.Type]"
            />
            <span class="attribute-label">{{ option.Stat }}</span>
          </template>
        </v-select>
        <StatInput
          v-if="currentGear.mod"
          v-model="currentGear.mod.StatValue"
          v-bind:max="currentGear.mod.Max"
        ></StatInput>
      </div>
      <div
        class="slot-element talent"
        v-if="gearTalents.length > 0 || this.currentGear.talent"
      >
        <TalentSelect
          v-model="currentGear.talent"
          v-bind:talentList="filterGearTalents(gearTalents)"
          :placeholder="'Talent'"
        >
        </TalentSelect>
      </div>
      <div
        v-if="whereIsAvailable(currentGear)"
        style="text-align: right"
        class="slot-element"
      >
        Sold at <b>{{ whereIsAvailable(currentGear) }}</b>
      </div>
    </template>

    <span class="no-element-selected" v-if="!isGearSelected()">
      <p>CHOOSE YOUR GEAR</p>
    </span>
  </div>
</template>

<script>
import { openGearModal } from "../utils/modalService";
import { GearBase } from "../utils/classes";
import {
  typeToImgSrc,
  coreAttributes,
  qualityToCss,
  getUniqueObject,
} from "../utils/utils";
import { gearData, VendorData } from "../utils/dataImporter";
import StatInput from "./StatInput";
import TalentSelect from "./GearSlot/TalentSelect";
import Vue from "vue";
import coreService from "../utils/coreService";

export default {
  name: "GearSlot",
  components: { StatInput, TalentSelect },
  props: {
    name: undefined,
    init: null,
  },
  data() {
    return {
      gearList: [],
      currentGear: new GearBase(),
      coreAttributes: [],
      typeToImgSrc: null,
      gearMods: null,
      gearAttributes: null,
      gearTalents: null,
      allTalents: null,
      allGearAttributes: null,
      vendorGear: [],
    };
  },
  methods: {
    qualityToCSS(quality) {
      return qualityToCss[quality];
    },
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
            (attribute) => attribute.label === this.currentGear.filters.core
          );
          this.currentGear.attributeOne = this.allGearAttributes.find(
            (attribute) =>
              attribute.Stat === this.currentGear.filters.attributeOne
          );
          this.currentGear.attributeTwo = this.allGearAttributes.find(
            (attribute) =>
              attribute.Stat === this.currentGear.filters.attributeTwo
          );
          this.currentGear.talent = this.allTalents.find((talent) => {
            return talent.Talent === this.currentGear.filters.talent;
          });
          break;
        case "Gearset":
          this.currentGear.talent = this.allTalents.find((talent) => {
            return talent.Talent === this.currentGear.filters.talent;
          });
          break;
        default:
          break;
      }
    },
    openGearModal() {
      openGearModal(this.gearList, this.name, this.onModalClose);
    },
    initGearMods() {
      Promise.all(
        [
          gearData.Chest,
          gearData.Gloves,
          gearData.Holster,
          gearData.Kneepads,
          gearData.Backpack,
          gearData.Mask
        ]
      ).then((res) => {
        const slots = [
          'Chest',
          'Gloves',
          'Holster',
          'Kneepads',
          'Backpack',
          'Mask',
        ]
        for (let i = 0; i < res.length; i++) {
          const data = res[i];
          for (let k = 0; k < data.length; k++) {
            const item = data[k];
            item.slot = slots[i]
          }
        }
        const merged = [].concat.apply([], res);
        const newItemsList = []
        for (let i = 0; i < merged.length; i++) {
          const item = merged[i];
          if (item._found === true) {
            continue;
          }
          const newItemSlots = new Set([item.slot])
          const newItem = {
            "Item Name": item["Item Name"],
            Attributes: [
              item["Attribute 1"],
              item["Attribute 2"]
            ].filter(Boolean),
            Brand: item.Brand,
            Cores: [item.Core],
            Quality: item.Quality,
            Type: item.Type,
            Talents: [
              item.Talent
            ],
            Slots: [],
            ModsPerSlot: {
              Chest: null,
              Gloves: null,
              Holster: null,
              Kneepads: null,
              Backpack: null,
              Mask: null,
            }
          }
          for (let k = 0; k < merged.length; k++) {
            const _item = merged[k];
            if (item["Item Name"] === _item["Item Name"] && _item._found !== true) {
              _item._found = true
              newItem.ModsPerSlot[_item.slot] = _item.Mod 
              newItemSlots.add(_item.slot)
            }
          }
          newItem.Slots = Array.from(newItemSlots)
          newItemsList.push(newItem)
        }

        console.log(newItemsList)
        var json = JSON.stringify(newItemsList);
        var blob = new Blob([json], {type: "application/json"});
        var url  = URL.createObjectURL(blob);

        var a = document.createElement('a');
        a.download    = "backup.json";
        a.href        = url;
        a.textContent = "Download backup.json";
        if (!window._clicked) {
          // a.click()
        }
        window._clicked = true
      });
      gearData.GearMods.then((res) => {
        this.gearMods = getUniqueObject(res);
      });
    },
    initGearAttributes() {
      gearData.Attributes.then((attributes) => {
        this.allGearAttributes = getUniqueObject(attributes);
        this.gearAttributes = this.allGearAttributes.filter((attribute) => {
          return attribute.Quality === "A";
        });
      });
    },
    initGearTalentsList() {
      // At the moment I don't need to divide the talent by gear
      // So, no separate files
      gearData.GearTalents.then((talents) => {
        this.allTalents = talents;
        this.gearTalents = talents
          .filter((talent) => {
            return talent.Slot === this.name && talent.Quality === "A";
          })
          .sort(function (a, b) {
            if (a.Talent < b.Talent) {
              return -1;
            }
            if (a.Talent > b.Talent) {
              return 1;
            }
            return 0;
          });
      });
    },
    filterGearMods(mods) {
      // Filter removed since now mods can go on every brand and exotic
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
      return attributes.filter((attribute) => {
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
    },
    isNamedGear() {
      return this.currentGear.quality === "Named";
    },
    initGearData() {
      coreService.getSlotInit$(this.name).subscribe((ids) => {
        const splittedIdS = ids.split("-");
        const gearId = parseInt([splittedIdS[0]]);
        if (gearId) {
          const fromUrlGear = new GearBase(
            this.gearList.find((gear) => gear.index === gearId)
          );
          this.currentGear = fromUrlGear;
          this.currentGear.attributeOne = this.allGearAttributes.find(
            (attribute) => attribute.index === parseInt(splittedIdS[1])
          );
          this.currentGear.attributeTwo = this.allGearAttributes.find(
            (attribute) => attribute.index === parseInt(splittedIdS[2])
          );
          this.currentGear.core = this.coreAttributes.find(
            (attribute) => attribute.index === parseInt(splittedIdS[3])
          );
          this.currentGear.mod = this.gearMods.find(
            (mod) => mod.index === parseInt(splittedIdS[4])
          );
          this.currentGear.talent = this.allTalents.find(
            (talent) => talent.index === parseInt(splittedIdS[5])
          );

          const stats = [null, "core", "attributeOne", "attributeTwo", "mod"];
          for (let idx = 1; idx < stats.length; idx++) {
            const stat = stats[idx];
            const currentStatToUpdate = this.currentGear[stat];
            const valueToImport = parseFloat(splittedIdS[5 + idx]);
            if (currentStatToUpdate && valueToImport > 0) {
              // Using Vue set because I want this to be reactive and
              // to trigger watch deep when it changes into StatInput
              Vue.set(currentStatToUpdate, "StatValue", valueToImport);
            }
          }
        }
      });
    },
    initWearableList() {
      gearData[this.name].then((values) => {
        this.gearList = values;
      });
    },
    whereIsAvailable(gear) {
      const found = this.vendorGear.find(
        (item) => item?.Name === gear.itemName
      );
      return found?.Vendor;
    },
  },
  created() {
    this.coreAttributes = getUniqueObject(coreAttributes);
    this.typeToImgSrc = typeToImgSrc;
    this.initWearableList();
    this.initGearMods();
    this.initGearAttributes();
    this.initGearTalentsList();
    this.initGearData();
    VendorData.then((vendorGear) => {
      this.vendorGear = vendorGear.Gear[this.name];
    });
  },
  watch: {
    currentGear: {
      handler: function (val, oldVal) {
        coreService.sendSlotData(this.name, val);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
.gear-container {
  height: 100%;
  color: white;
}

// attribute-label
.attribute-value {
  margin-left: auto;
}
</style>