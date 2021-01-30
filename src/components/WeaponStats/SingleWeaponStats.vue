<template>
  <div class="weapon-stat">
    <template v-if="weapon">
      <span class="weapon-name-stat bold">{{ weapon.name }}</span>
      <div class="toggle-chd-hsd">
        <Toggle
          @input="updatedToggle()"
          v-model="toggleHSD"
          :label="'Toggle Headshot'"
        ></Toggle>
        <Toggle
          @input="updatedToggle()"
          v-model="toggleCHD"
          :label="'Toggle Critical'"
        ></Toggle>
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
        >Max Damage per {{ totalMagSize }} rounds
        <span>{{ roundValue(dmgToOutOfCoverArmoredPerMag) }}</span></span
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
      <span
        >Magazine Size <span>{{ roundValue(totalMagSize) }}</span></span
      >
      <span
        >Reload speed <span>{{ roundValue(reloadSpeed / 1000) }}s</span></span
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
import Plotly from 'plotly.js-dist'
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
      // this.stats: null
      weapon: null,
      chc: null,
      chd: null,
      weaponDamage: null,
      damageIncrease: null,
      dmgToArmored: 0,
      dmgToOutOfCover: 0,
      dmgToOutOfCoverArmored: 0,
      dmgToOutOfCoverArmoredPerMag: 0,
      dta: 0,
      dtooc: 0,
      hsd: 0,
      totalMagSize: 0,
      toggleHSD: false,
      toggleCHD: false,
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
      this.stats = stats;
      this.weapon = weapon;
      const weaponCore1 = this.weapon[WEAPON_PROP_ENUM.CORE_1];
      const weaponCore2 = this.weapon[WEAPON_PROP_ENUM.CORE_2];
      const weaponAttribute1 = this.weapon["attribute 1"];
      const weaponCoreType = weaponCore1.stat;
      const weaponBaseDamage = Number(
        this.weapon[WEAPON_PROP_ENUM.BASE_DAMAGE]
      );
      const AWD =
        this.stats.Cores.Offensive.length > 0
          ? this.stats.Cores.Offensive.reduce((a, b) => a + b)
          : 0; // All weapon damages from cores
      const weaponSpecificDamage =
        (this.stats.Offensive[weaponCoreType] || 0) + // Damage from the brands and SHD(?)(To test)
        (weaponCore1.StatValue || weaponCore1.max); // Get the weapon CORE 1
      const genericWeaponDamage =
        this.stats.Offensive[STATS_ENUM.WEAPON_DAMAGE] || 0; // SHD Levels and Walker brand

      this.damageIncrease = AWD + weaponSpecificDamage + genericWeaponDamage;

      this.hsd =
        Number(this.weapon.hsd) +
        this.getStatValueFromGunMods(this.weapon, STATS_ENUM.HEADSHOT_DAMAGE);
      this.hsd += this.getStatValueFromGunAndGear(
        weaponCore2,
        weaponAttribute1,
        this.stats.Offensive,
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
        this.stats.Offensive,
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
        this.stats.Offensive,
        STATS_ENUM.CRITICAL_HIT_CHANCE
      );

      this.weaponDamage = this.flatWeaponDamage(
        weaponBaseDamage,
        AWD,
        weaponSpecificDamage,
        genericWeaponDamage
      );

      this.weaponDamage = this.addCHDAndOrHSDOnTopOfFlatDamage(
        this.weaponDamage,
        this.chd,
        this.hsd
      );

      this.dta = this.getStatValueFromGunAndGear(
        weaponCore2,
        weaponAttribute1,
        this.stats.Offensive,
        STATS_ENUM.DAMAGE_TO_ARMOR
      );
      this.dmgToArmored = this.calcDmgToArmored(this.weaponDamage, this.dta);

      this.dtooc = this.getStatValueFromGunAndGear(
        weaponCore2,
        weaponAttribute1,
        this.stats.Offensive,
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

      this.totalMagSize = Number(this.weapon[WEAPON_PROP_ENUM.MAG_SIZE]);
      this.totalMagSize += this.getExtraMagazineSize(
        this.weapon[WEAPON_PROP_ENUM.MAGAZINE]
      );
      this.dmgToOutOfCoverArmoredPerMag =
        this.dmgToOutOfCoverArmored * this.totalMagSize;

      const timeToEmptyMagazine = (this.totalMagSize / (this.weapon.rpm / 60)) * 1000;
      const reloadSpeedModifier = this.getReloadSpeedModifier(
        this.weapon[WEAPON_PROP_ENUM.MAGAZINE]
      );
      this.reloadSpeed = this.calcReloadSpeed(
        this.weapon[WEAPON_PROP_ENUM.RELOAD_SPEED],
        reloadSpeedModifier
      );

      // Data point count
      const dataPointsCount = Math.round(60000 / (timeToEmptyMagazine + this.reloadSpeed));
      const dataPoints = new Array(dataPointsCount + 1);
      let isReloadingTime = false
      let damageDelta = 0
      let timeDelta = 0
      const timeAxis = new Array(dataPointsCount + 1);
      const damageAxis = new Array(dataPointsCount + 1);
      timeAxis[0] = 0;
      damageAxis[0] = 0;
      for (let i = 1; i < dataPoints.length; i++) {
        let damage = !isReloadingTime ? Number(this.weaponDamage) + damageDelta : damageDelta;
        let time = isReloadingTime ? timeDelta + this.reloadSpeed : timeDelta + timeToEmptyMagazine;
        timeAxis[i] = time;
        damageAxis[i] = damage;
        timeDelta = time;
        damageDelta = damage;
        isReloadingTime = !isReloadingTime;
      }
      const TESTER = document.getElementById('chart-test');

      Plotly.plot( TESTER, [{
          name: this.weapon[WEAPON_PROP_ENUM.NAME],
          x: timeAxis,
          y: damageAxis }], { 
          margin: { t: 0 } }, {showSendToCloud:true} );

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
    addCHDAndOrHSDOnTopOfFlatDamage(flatDamage, chd, hsd) {
      let toAdd = 0;
      toAdd += this.toggleHSD ? Number(hsd) : 0;
      toAdd += this.toggleCHD ? Number(chd) : 0;
      // (1 + CHC * CHD + HsD * headshot chance)
      return (flatDamage * (1 + toAdd / 100)).toFixed(0);
    },
    roundValue(number) {
      return Number(Number(number).toFixed(2));
    },
    // TODO: Add Stats Modifiers
    getExtraMagazineSize(magazine) {
      if (!magazine) {
        return 0;
      } else if (magazine.pos == "Extra Rounds") {
        return Number(magazine.valPos);
      }
      return 0;
    },
    calcReloadSpeed(weapReloadSpeed, reloadSpeedModifier) {
      let reloadSpeedBase = weapReloadSpeed;
      return (reloadSpeedBase * (1 + (reloadSpeedModifier / 100)));
    },
    // TODO: Add Stats Modifiers
    getReloadSpeedModifier(magazine) {
      if (!magazine) {
        return 0;
      } else if (magazine.pos == "Reload Speed %") {
        return Number(magazine.valPos);
      } else if (magazine.neg == "Reload Speed %") {
        return Number(magazine.valNeg);
      }
      return 0;
    },
    updatedToggle() {
      this.updateStatsUI(this.weapon, this.stats);
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