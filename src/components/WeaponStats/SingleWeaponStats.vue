<template>
  <div class="weapon-stat">
    <template v-if="weapon">
      <span class="weapon-name-stat bold">{{ weapon.name }}</span>
      <div class="toggle-chd-hsd">
        <Toggle :label="'Toggle Headshot'"></Toggle>
        <Toggle :label="'Toggle Critical'"></Toggle>
      </div>
      <span
        >Weapon damage <span> {{ roundValue(weaponDamage) }}</span></span
      >
      <span
        >Damage to Armored target
        <span>{{ roundValue(dmgToArmored) }}</span></span
      >
      <span
        >Damage to Out Of Cover target
        <span>{{ roundValue(dmgToOutOfCover) }}</span></span
      >
      <span
        >Damage to Armored OOC target
        <span>{{ roundValue(dmgToOutOfCoverArmored) }}</span></span
      >
      <span
        >Damage (additive) increase by
        <span>{{ roundValue(damageIncrease) }}%</span></span
      >
      <span
        >Headshot Damage <span>{{ roundValue(hsd) }}%</span></span
      >
      <span
        >Critical Hit Damage <span>{{ roundValue(chd) }}%</span></span
      >
      <span
        >Critical Hit Chance <span>{{ roundValue(chc) }}/60%</span></span
      >
      <span
        >Damage To Target Out of Cover
        <span>{{ roundValue(dtooc) }}%</span></span
      >
      <span
        >Damage To Armor <span>{{ roundValue(dta) }}%</span></span
      >
    </template>
    <span class="weapon-name-stat bold" v-if="!weapon">No weapon selected</span>
  </div>
</template>

<script>
import coreService from "../../utils/coreService";
import { combineLatest } from "rxjs";
import statsService from "../../utils/statsService";
import { WEAPON_PROP_ENUM, STATS_ENUM } from "../../utils/utils";
import Toggle from "../generic/Toggle";
export default {
  name: "SingleWeaponStats",
  props: {
    name: null,
  },
  components: {
    Toggle,
  },
  data() {
    return {
      // stats: null
      weapon: null,
      chc: null,
      chd: null,
      weaponDamage: null,
      damageIncrease: null,
      dmgToArmored: 0,
      dmgToOutOfCover: 0,
      dmgToOutOfCoverArmored: 0,
      dta: 0,
      dtooc: 0,
      hsd: 0,
    };
  },
  created() {
    const _vm = this;
    combineLatest([
      coreService.subscribeSlotData(this.name),
      statsService.getStats$(),
    ]).subscribe(([weapon, stats]) => {
      _vm.updateStatsUI(weapon, stats);
    });
  },
  methods: {
    updateStatsUI(weapon, stats) {
      if (!weapon || !stats) {
        return;
      }
      // this.stats = stats;
      this.weapon = weapon;
      const weaponCore1 = this.weapon[WEAPON_PROP_ENUM.CORE_1];
      const weaponCore2 = this.weapon[WEAPON_PROP_ENUM.CORE_2];
      const weaponAttribute1 = this.weapon["attribute 1"];
      const weaponCoreType = weaponCore1.stat;
      const weaponBaseDamage = Number(
        this.weapon[WEAPON_PROP_ENUM.BASE_DAMAGE]
      );
      const AWD =
        stats.Cores.Offensive.length > 0
          ? stats.Cores.Offensive.reduce((a, b) => a + b)
          : 0; // All weapon damages from cores
      const weaponSpecificDamage =
        (stats.Offensive[weaponCoreType] || 0) + // Damage from the brands and SHD(?)(To test)
        (weaponCore1.StatValue || weaponCore1.max); // Get the weapon CORE 1
      const genericWeaponDamage =
        stats.Offensive[STATS_ENUM.WEAPON_DAMAGE] || 0; // SHD Levels and Walker brand

      this.damageIncrease = AWD + weaponSpecificDamage + genericWeaponDamage;

      this.hsd =
        Number(this.weapon.hsd) +
        this.getStatValueFromGunMods(this.weapon, STATS_ENUM.HEADSHOT_DAMAGE);
      this.hsd += this.getStatValueFromGunAndGear(
        weaponCore2,
        weaponAttribute1,
        stats.Offensive,
        STATS_ENUM.HEADSHOT_DAMAGE
      );

      // 25 is the innate CHD of every gun
      this.chd =
        25 +
        this.getStatValueFromGunMods(
          this.weapon,
          STATS_ENUM.CRITICAL_HIT_DAMAGE
        );
      this.chd += this.getStatValueFromGunAndGear(
        weaponCore2,
        weaponAttribute1,
        stats.Offensive,
        STATS_ENUM.CRITICAL_HIT_DAMAGE
      );
      this.chc =
        0 +
        this.getStatValueFromGunMods(
          this.weapon,
          STATS_ENUM.CRITICAL_HIT_CHANCE
        );
      this.chc += this.getStatValueFromGunAndGear(
        weaponCore2,
        weaponAttribute1,
        stats.Offensive,
        STATS_ENUM.CRITICAL_HIT_CHANCE
      );

      this.weaponDamage = this.flatWeaponDamage(
        weaponBaseDamage,
        AWD,
        weaponSpecificDamage,
        genericWeaponDamage
      );

      this.dta = this.getStatValueFromGunAndGear(
        weaponCore2,
        weaponAttribute1,
        stats.Offensive,
        STATS_ENUM.DAMAGE_TO_ARMOR
      );
      this.dmgToArmored = this.calcDmgToArmored(this.weaponDamage, this.dta);

      this.dtooc = this.getStatValueFromGunAndGear(
        weaponCore2,
        weaponAttribute1,
        stats.Offensive,
        STATS_ENUM.DAMAGE_TO_TOC
      );
      this.dmgToOutOfCover = this.calcDmgToOutOfCover(
        this.weaponDamage,
        this.dtooc
      );

      this.dmgToOutOfCoverArmored = this.calcDmgToOutOfCover(
        this.dmgToArmored,
        this.dtooc
      );
    },
    flatWeaponDamage(
      weaponBaseDamage,
      AWD,
      weaponSpecificDamage,
      genericWeaponDamage
    ) {
      return (
        weaponBaseDamage *
        (1 + (AWD + weaponSpecificDamage + genericWeaponDamage) / 100)
      ).toFixed(0);
    },
    calcDmgToArmored(flatDamage, DTA) {
      return (flatDamage * (1 + DTA / 100)).toFixed(0);
    },
    calcDmgToOutOfCover(flatDamage, DTOOC) {
      return (flatDamage * (1 + DTOOC / 100)).toFixed(0);
    },
    getStatValueFromGunAndGear(
      weaponCore2,
      weaponAttribute1,
      statsObj,
      statName
    ) {
      let value = statsObj[statName] || 0;
      if (weaponCore2 && weaponCore2.stat === statName) {
        value += weaponCore2.StatValue || Number(weaponCore2.max);
      }
      if (weaponAttribute1 && weaponAttribute1.Stat === statName) {
        value += weaponAttribute1.StatValue || Number(weaponAttribute1.Max);
      }
      return value;
    },
    getStatValueFromGunMods(weapon, statName) {
      let value = 0;
      const modSlots = ["optic", "under barrel", "magazine", "muzzle"];
      modSlots.forEach((mod) => {
        const modEl = weapon[mod];
        if (!modEl) {
          return;
        }
        if (modEl.neg === statName) {
          value += Number(modEl.valNeg);
        }
        if (modEl.pos === statName) {
          value += Number(modEl.valPos);
        }
      });
      return value;
    },
    roundValue(number) {
      return Number(Number(number).toFixed(2));
    },
  },
};
</script>

<style lang="scss" scoped>
.weapon-stat {
  color: white;
  display: flex;
  flex-direction: column;
  > span {
    border-bottom: 1px solid white;
    padding: 8px;
    > span {
      float: right;
    }
  }
}

.toggle-chd-hsd {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>