<template>
  <div class="weapon-selection-modal">
    <input
      class="mx-input search"
      placeholder="Search..."
      type="text"
      @input="debouceSearch"
    />
    <div class="search-toolbar">
      <a
        class="mx-btt"
        v-for="(weapons, key) in weaponsList"
        v-bind:key="key"
        @click="scrollToElementID(key)"
        >{{ key }}</a
      >
    </div>
    <div class="overflow-handler">
      <div v-for="(weapons, key) in weaponsList" v-bind:key="key">
        <span :id="key">{{ key }} </span>
        <div class="weapon-grid">
          <div
            class="weapon-slot"
            :class="[qualityToCSS(weapon.Quality)]"
            @click="onSelection(weapon)"
            v-for="(weapon, idx) in filterByName(weapons)"
            v-bind:key="idx"
          >
            <BasicTile :classes="'anim-enabled'">
              <span class="name">
                {{ getDisplayName(weapon) }}
              </span>
              <div>
                {{ getTalentDesc(weapon.Talent) }}
              </div>
            </BasicTile>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  IsEverythingLoadedPromise,
  weaponsData,
} from "../../utils/dataImporter";
import {
  qualityToCss,
  QualityPriority,
  groupArrayOfObjectsByKey,
} from "../../utils/utils";
import BasicTile from "../BasicTile";

export default {
  name: "WeaponSelectionModal",
  props: ["gearData", "onModalClose", "tableHeaders"],
  components: {
    BasicTile,
  },
  data() {
    return {
      WeaponTalents: {},
      weaponsList: [],
      searchText: "",
      debounce: null,
    };
  },
  methods: {
    qualityToCSS(quality) {
      return qualityToCss[quality];
    },
    getDisplayName(weapon) {
      return weapon.Name == weapon.Variant
        ? weapon.Name
        : `${weapon.Name} (${weapon.Variant})`;
    },
    getTalentDesc(talent) {
      return this.WeaponTalents[talent]
        ? this.WeaponTalents[talent].Desc
        : null;
    },
    debouceSearch(event) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.searchText = event.target.value;
      }, 300);
    },
    scrollToElementID(divId) {
      document.getElementById(divId).scrollIntoView();
    },
    filterByName(list) {
      return list.filter((weapon) =>
        this.getDisplayName(weapon)
          .toLocaleLowerCase()
          .includes(this.searchText.toLocaleLowerCase())
      );
    },
  },
  created() {
    Promise.all([
      IsEverythingLoadedPromise,
      weaponsData.WeaponTalents,
      //   gearMetaData.BrandsData,
    ]).then((res) => {
      this.WeaponTalents = res[1].reduce(function (o, val) {
        o[val.Talent] = val;
        return o;
      }, {});
      const sorted = this.gearData.sort(
        (a, b) =>
          QualityPriority[a["Quality"]] - QualityPriority[[b["Quality"]]] ||
          a["Name"].localeCompare(b["Name"])
      );
      this.weaponsList = groupArrayOfObjectsByKey(sorted, "Weapon Type");
      console.log(this.weaponsList);
    });
  },
};
</script>

<style lang="scss" scoped>
.weapon-selection-modal {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.weapon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 8px;
  padding: 8px;

  .tile {
    min-height: 10px;
    width: 100%;
  }

  .weapon-slot {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    min-height: 90px;
    cursor: pointer;
  }

  .overflow-handler {
    max-height: 100%;
    overflow: auto;
  }
}
.search-toolbar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;
  padding: 8px;
  background: #252525;
  z-index: 2;
  border-bottom: 1px solid white;
  .mx-btt {
    margin: 0;
  }
}
.search {
  margin: 0px 8px;
}
</style>