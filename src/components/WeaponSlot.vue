<template>
  <div @click="onClick()" class="weapon-container">
    <template v-if="isWeaponSelected()">
      <div class="slot-element weapon-name" v-on:click="openWeaponsModal()">{{ currentWeapon.name}}</div>
      <div class="slot-element stat-edit">
        <span class="core">{{ currentWeapon.filters['core 1']}}</span>
        <StatInput v-bind:stat="currentWeapon.filters" v-bind:maxPath="'core 1 max'"></StatInput>
      </div>
      <div class="slot-element stat-edit">
        <span
          v-if="!currentWeapon.filters['core 2']"
          class="core"
          style="opacity: 0.5"
        >Core 2 is not available on this weapon</span>
        <template v-if="currentWeapon.filters['core 2']">
          <span class="core">{{ currentWeapon.filters['core 2']}}</span>
          <StatInput v-bind:stat="currentWeapon.filters" v-bind:maxPath="'core 2 max'"></StatInput>
        </template>
      </div>
      <div class="slot-element stat-edit attribute-one">
        <v-select
          placeholder="Attribute"
          :clearable="false"
          :options="weaponAttributes"
          v-model="currentWeapon['attribute 1']"
          label="Stat"
        >
          <template v-slot:option="option">
            <span class="attribute-label">{{option.Stat}}</span>
            <span class="attribute-value">{{option.Max}}</span>
          </template>
          <template #selected-option="option">
            <span class="attribute-label">{{option.Stat}}</span>
            <!-- <span class="attribute-value">{{option.Max}}</span> -->
          </template>
        </v-select>
        <StatInput v-bind:stat="currentWeapon['attribute 1']" v-bind:maxPath="'Max'"></StatInput>
      </div>
      <div class="slot-element talent">
        <v-select
          placeholder="Talent"
          :clearable="false"
          :options="filterTalents(weaponTalents)"
          v-model="currentWeapon['talent']"
          label="Name"
        >
          <template v-slot:option="option">
            <div class="talent-info-container">
              <span class="talent-label">{{option.Name}}</span>
              <span class="talent-desc">{{option.Desc}}</span>
            </div>
          </template>
          <template #selected-option="option">
            <div class="talent-info-container label-selected">
              <span class="talent-label">{{option.Name}}</span>
            </div>
          </template>
        </v-select>
        <div class="talent-description" v-if="currentWeapon.talent">{{currentWeapon.talent.Desc}}</div>
      </div>
      <div class="mods-toggle" @click="showModSlots = !showModSlots">
        <span>Mods</span>
        <div class="arrow-down"></div>
      </div>
      <div class="mods-slots-container" v-if="showModSlots">
        <template v-for="(mod, i) in modSlots">
          <template v-if="weaponHasThisMod(mod)">
            <div class="slot-element mod-slot" v-bind:key="i">
              <v-select
                :placeholder="'Mod Slot: '+ mod"
                :clearable="false"
                :options="filterWeaponModsByType(currentWeapon.filters[mod], mod)"
                v-model="currentWeapon[mod]"
                label="Name"
              >
                <template v-slot:option="option">
                  <div class="mod-option-container">
                    <span class="mod-name">{{option.Name}}</span>
                    <span class="mod-stat">
                      <span class="mod-increase" v-if="option.pos">{{option.pos}} +{{option.valPos}}</span>
                      <span class="mod-decrease" v-if="option.neg">{{option.neg}} {{option.valNeg}}</span>
                    </span>
                  </div>
                </template>
                <template #selected-option="option">
                  <div class="mod-option-container">
                    <span class="mod-name">{{option.Name}}</span>
                    <!-- <span class="mod-stat">
                      <span class="mod-increase" v-if="option.pos">{{option.pos}} +{{option.valPos}}</span>
                      <span class="mod-decrease" v-if="option.neg">{{option.neg}} {{option.valNeg}}</span>
                    </span>-->
                  </div>
                </template>
              </v-select>
              <span class="mod-stat" v-if="currentWeapon[mod]">
                <span
                  class="mod-increase"
                  v-if="currentWeapon[mod].pos"
                >{{currentWeapon[mod].pos}} +{{currentWeapon[mod].valPos}}</span>
                <span
                  class="mod-decrease"
                  v-if="currentWeapon[mod].neg"
                >{{currentWeapon[mod].neg}} {{currentWeapon[mod].valNeg}}</span>
              </span>
            </div>
          </template>
        </template>
      </div>
    </template>
    <span class="no-element-selected" v-if="!isWeaponSelected()">
      <p>CHOSE YOUR WEAPON</p>
    </span>
  </div>
</template>

<script>
import { openWeaponsModal } from "../utils/modalService";
import { weaponsData } from "../utils/dataImporter";
import { WeaponBase } from "../utils/classes";
import StatInput from "./StatInput";
export default {
  name: "WeaponSlot",
  components: { StatInput },
  props: {
    init: null,
    slotFilter: null
  },
  data() {
    return {
      weaponsList: null,
      weaponAttributes: null,
      weaponMods: null,
      weaponTalents: null,
      currentWeapon: new WeaponBase(),
      modSlots: ["optic", "under barrel", "magazine", "muzzle"],
      showModSlots: false
    };
  },
  created() {
    weaponsData.Weapons.then(weapons => {
      this.weaponsList = !this.slotFilter
        ? weapons
        : weapons.filter(gun => {
            return gun.Slot === this.slotFilter;
          });
    });
    weaponsData.WeaponAttributes.then(weaponsAttr => {
      this.weaponAttributes = weaponsAttr;
    });
    weaponsData.WeaponMods.then(weaponMods => {
      this.weaponMods = weaponMods;
    });
    weaponsData.WeaponTalents.then(weaponTalents => {
      this.weaponTalents = weaponTalents;
    });
  },
  methods: {
    isWeaponSelected() {
      return this.currentWeapon && this.currentWeapon.name;
    },
    onClick() {
      if (!this.isWeaponSelected()) {
        this.openWeaponsModal();
      }
    },
    openWeaponsModal() {
      openWeaponsModal(this.weaponsList, this.onModalClose);
    },
    onModalClose(data) {
      this.currentWeapon = new WeaponBase(data);
      const isExotic = this.currentWeapon.quality === "Exotic";
      const isNamed = this.currentWeapon.quality === "Named";
      if (isExotic || isNamed) {
        this.currentWeapon["attribute 1"] = this.weaponAttributes.find(el => {
          return el["Stat"] === this.currentWeapon.filters["attribute 1"];
        });
        this.currentWeapon["talent"] = this.weaponTalents.find(el => {
          return el["Name"] === this.currentWeapon.filters["talent"];
        });
        if (isExotic) {
          const modMap = [
            { target: "optic", source: this.weaponMods, toMatch: "Slot" },
            {
              target: "under barrel",
              source: this.weaponMods,
              toMatch: "Slot"
            },
            { target: "magazine", source: this.weaponMods, toMatch: "Slot" },
            { target: "muzzle", source: this.weaponMods, toMatch: "Slot" }
          ];
          for (let i = 0; i < modMap.length; i++) {
            const mappedMod = modMap[i];
            const mappedFilter = this.currentWeapon.filters[mappedMod.target];
            this.currentWeapon[mappedMod.target] = mappedMod.source.find(el => {
              return (
                el[mappedMod.toMatch].toLowerCase() === mappedMod.target &&
                el.Type === mappedFilter
              );
            });
          }
        }
      }
    },
    filterWeaponModsByType(type, slot) {
      let result = [];
      if (this.currentWeapon.quality !== "Exotic") {
        result = this.weaponMods.filter(
          mod => slot === mod.Slot.toLowerCase() && type.indexOf(mod.Type) >= 0
        );
      }
      return result;
    },
    filterTalents(weaponTalents) {
      let result = [];
      if (
        this.currentWeapon.quality !== "Exotic" &&
        this.currentWeapon.filters.talent === "A"
      ) {
        // TODO: Or is not a named talent
        result = weaponTalents.filter(talent => {
          return !!talent[this.currentWeapon["weapon type"]];
        });
      }
      return result;
    },
    weaponHasThisMod(mod) {
      return this.currentWeapon.filters[mod];
    }
  },
  watch: {
    currentWeapon: {
      handler: function(val, oldVal) {
        this.$parent.slotChanged(val);
      },
      deep: true
    },
    init: {
      handler: function(ids) {
        const splittedIdS = ids.split("-");
        const id = parseInt([splittedIdS[0]]);
        if (id) {
          // Like From urlEncoder
          const map = [
            null,
            { target: "attribute 1", source: this.weaponAttributes },
            { target: "talent", source: this.weaponTalents },
            { target: "optic", source: this.weaponMods },
            { target: "under barrel", source: this.weaponMods },
            { target: "magazine", source: this.weaponMods },
            { target: "muzzle", source: this.weaponMods }
          ];
          const fromUrlGear = new WeaponBase(
            this.weaponsList.find(weapon => weapon.index === id)
          );
          this.currentWeapon = fromUrlGear;
          // Start from 1 because 0 is used to build the object
          for (let i = 1; i < splittedIdS.length; i++) {
            const id = parseInt(splittedIdS[i]);
            const mapped = map[i];
            this.currentWeapon[mapped.target] = mapped.source.find(
              el => el.index === id
            );
          }
        }
      }
    }
  }
};
</script>

<style lang="scss">
.weapon-container {
  height: 100%;
  color: white;
}

.weapon-name {
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

span.core {
  flex: 3;
  padding: 8px;
  border-bottom: 1px solid white;
}

.mod-option-container {
  display: flex;
  flex-direction: column;
}

.mod-stat {
  display: flex;
  flex-wrap: wrap;
  padding: 6px 10px;
}

.mod-increase {
  margin-right: 8px;
}

.talent-info-container {
  display: flex;
  flex-direction: column;
}

.talent-label,
.talent-desc {
  white-space: break-spaces;
}

.arrow-down {
  height: 14px;
  width: 14px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' fill='white' height='10' role='presentation' class='vs__open-indicator'%3E%3Cpath d='M9.211364 7.59931l4.48338-4.867229c.407008-.441854.407008-1.158247 0-1.60046l-.73712-.80023c-.407008-.441854-1.066904-.441854-1.474243 0L7 5.198617 2.51662.33139c-.407008-.441853-1.066904-.441853-1.474243 0l-.737121.80023c-.407008.441854-.407008 1.158248 0 1.600461l4.48338 4.867228L7 10l2.211364-2.40069z'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  margin-left: auto;
  background-position: bottom;
}

.mods-toggle {
  margin-top: 8px;
  padding: 8px;
  padding-right: 6px;
  display: flex;
  // background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid white;
  cursor: pointer;
}
</style>