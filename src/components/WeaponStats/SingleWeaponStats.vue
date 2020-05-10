<template>
  <div class="weapon-stat">
    <template v-if="weapon">
      <span class="weapon-name-stat bold">{{weapon.name}}</span>
      <template v-for="(weaponStatsKey, idx) in weaponStatsArr">
        <span
          v-if="weaponStats[weaponStatsKey].value"
          v-bind:key="idx"
        >{{weaponStatsKey}} {{weaponStats[weaponStatsKey].value}}</span>
      </template>
    </template>
    <span class="weapon-name-stat bold" v-if="!weapon">
      No weapon selected
    </span>
  </div>
</template>

<script>
import coreService from "../../utils/coreService";
import { combineLatest, map, timer } from "rxjs";
import { debounce } from "rxjs/operators";
import statsService from "../../utils/statsService";

export default {
  name: "SingleWeaponStats",
  props: {
    name: null
  },
  data() {
    return {
      weapon: null,
      // stats: null,
      weaponStatsArr: [
        "Weapon Damage",
        "Critical Hit Chance",
        "Critical Hit Damage",
        "Headshot Damage",
        "Damage to Armor",
        "Damage to Health",
        "Damage to TOC",
        "Rate of Fire %",
        "Mag Size %",
        "Extra Rounds",
        "Reload Speed %",
        "Stability",
        "Accuracy",
        "Weapon Handling",
        "Optimal Range",
        "Swap Speed"
      ],
      weaponStats: {
        "Weapon Damage": { value: 0 },
        "Critical Hit Chance": { value: 0 },
        "Critical Hit Damage": { value: 0 },
        "Headshot Damage": { value: 0 },
        "Damage to Armor": { value: 0 },
        "Damage to Health": { value: 0 },
        "Damage to TOC": { value: 0 },
        "Rate of Fire %": { value: 0 },
        "Mag Size %": { value: 0 },
        "Extra Rounds": { value: 0 },
        "Reload Speed %": { value: 0 },
        Stability: { value: 0 },
        Accuracy: { value: 0 },
        "Weapon Handling": { value: 0 },
        "Optimal Range": { value: 0 },
        "Swap Speed": { value: 0 }
      }
    };
  },
  created() {
    const _vm = this;
    combineLatest(
      coreService.subscribeSlotData(this.name),
      statsService.getStats$()
    ).subscribe(([weapon, stats]) => {
        _vm.updateStatsUI(weapon, stats);
      });
  },
  methods: {
    updateStatsUI(weapon, stats) {
      this.weapon = weapon;
      if (this.weapon && stats) {
        const statsKey = Object.keys(stats);
        for (let i = 0; i < statsKey.length; i++) {
          const stat = statsKey[i];
          if (this.weaponStats[stat]) {
            this.weaponStats[stat].value = stats[stat].reduce(
              (a, b) => parseFloat(a) + parseFloat(b),
              0
            );
          }
        }
        const attributeone = this.weapon["attribute 1"];
        const coreone = this.weapon["core 1"];
        const coretwo = this.weapon["core 2"];
        // Mods
        const magazine = this.weapon["magazine"];
        const muzzle = this.weapon["muzzle"];
        const optic = this.weapon["optic"];
        const underbarrel = this.weapon["under barrel"];

        this.addToStat("Headshot Damage", this.weapon["hsd"], null);
        if (attributeone) {
          this.addToStat(
            attributeone.Stat,
            attributeone.StatValue,
            attributeone.Max
          );
        }

        // this.weapon["base damage"]; Combine with Coreone
        if (coretwo && coretwo.stat) {
          this.addToStat(coretwo.stat, coretwo.StatValue, coretwo.max);
        }

        const mods = [magazine, muzzle, optic, underbarrel];
        for (let i = 0; i < mods.length; i++) {
          const mod = mods[i];
          if (mod) {
            this.addToStat(mod.pos, mod.valPos);
            if (mod.neg) {
              this.reduceStat(mod.neg, mod.valNeg);
            }
          }
        }
      }

      // this.weapon["mag size"];
      // this.weapon["name"];
      // this.weapon["optimal range"];
      // this.weapon["quality"];
      // this.weapon["reload speed (ms)"];
      // this.weapon["rpm"];
      // this.weapon["talent"];
      // this.weapon["variant"];
      // this.weapon["weapon type"];
    },
    addToStat(statName, value, fallbackVal) {
      if (this.weaponStats[statName]) {
        this.weaponStats[statName].value += value
          ? parseFloat(value)
          : parseFloat(fallbackVal);
      }
    },
    // Used for mods negative bonus
    reduceStat(statName, value) {
      this.weaponStats[statName].value += parseFloat(value);
    }
  }
};
</script>

<style lang="scss" scoped>
.weapon-stat {
  color: white;
  display: flex;
  flex-direction: column;
  span {
    border-bottom: 1px solid white;
    padding: 8px;
  }
}
</style>