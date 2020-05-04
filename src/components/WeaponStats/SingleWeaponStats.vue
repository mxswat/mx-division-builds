<template>
  <div class="weapon-stat">
    Get all general stats, add on top of them the specific weapon Buff
    <span
      v-for="(weaponStatsKey, idx) in weaponStatsArr"
      v-bind:key="idx"
    >{{weaponStatsKey}} {{weaponStats[weaponStatsKey].value}}</span>
  </div>
</template>

<script>
import { statsProvider } from "../../utils/statsCalculator";
import { GearProvider } from "../../utils/gearService";
import { combineLatest, map, timer } from "rxjs";
import { debounce } from "rxjs/operators";

export default {
  name: "SingleWeaponStats",
  props: {
    name: null
  },
  data() {
    return {
      weapon: null,
      stats: null,
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
        "Optimal Range": { value: 0 },
        "Swap Speed": { value: 0 }
      }
    };
  },
  created() {
    // https://www.learnrxjs.io/learn-rxjs/operators/combination/combinelatest
    const _vm = this;
    combineLatest(
      GearProvider.subscribeGear(this.name),
      statsProvider.getStats()
    )
      // https://www.learnrxjs.io/learn-rxjs/operators/filtering/debounce
      .pipe(debounce(() => timer(300)))
      .subscribe(([weapon, stats]) => {
        _vm.updateStatsUI(weapon, stats);
      });
  },
  methods: {
    updateStatsUI(weapon, stats) {
      this.weapon = weapon;
      this.stats = stats.stats;
      this.brandsStats = stats.brand;
      console.log(weapon, stats.stats);
      const statsKey = Object.keys(this.stats);
      for (let i = 0; i < statsKey.length; i++) {
        const stat = statsKey[i];
        if (this.weaponStats[stat]) {
          this.weaponStats[stat].value = this.stats[stat].reduce(
            (a, b) => parseFloat(a) + parseFloat(b),
            0
          );
        }
      }
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