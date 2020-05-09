<template>
  <div class="specialization-container">
    <div class="slot-element spec-slot" v-if="specializations">
      <v-select
        placeholder="Choose a specialization"
        :clearable="false"
        :options="specializations"
        v-model="currentSpecialization"
        label="name"
      >
        <template v-slot:option="option">
          <div class="spec-option-container">
            <span class="spec-name">{{option.name}}</span>
            <div class="spec-stats">
              <span
                class="spec-stat"
                v-for="stat in option.stats"
                v-bind:key="stat.name"
              >{{stat.name}} {{stat.val}}</span>
            </div>
          </div>
        </template>
        <template #selected-option="option">
          <div class="spec-option-container">
            <span class="spec-name">{{option.name}}</span>
          </div>
        </template>
      </v-select>
      <span v-if="currentSpecialization" class="spec-stats">
        <span
          class="spec-stat"
          v-for="stat in currentSpecialization.stats"
          v-bind:key="stat.name"
        >{{stat.name}} {{stat.val}}</span>
      </span>
    </div>
  </div>
</template>

<script>
import { specializationList } from "../utils/dataImporter";
import { decodedSlots } from "../utils/urlEncorder";

export default {
  name: "SpecializationSlot",
  props: {
    init: null
  },
  data() {
    return {
      specializations: [],
      currentSpecialization: null
    };
  },
  created() {
    let specIndex = 0;
    specializationList.Specialization.then(specializations => {
      const holder = {};
      for (let i = 0; i < specializations.length; i++) {
        const specialization = specializations[i];
        if (!holder[specialization.Name]) {
          holder[specialization.Name] = holder[specialization.Name] || {};
          holder[specialization.Name].name = specialization.Name;
          holder[specialization.Name].stats =
            holder[specialization.Name].stats || [];
          holder[specialization.Name].id = ++specIndex;
        }
        holder[specialization.Name].stats.push({
          name: specialization.Stat,
          val: specialization.Val
        });
      }
      this.specializations = Object.values(holder);
    });
    this.initSpec();
  },
  methods: {
    initSpec() {
      decodedSlots['Specialization'].subscribe(ids => {
        const specId = parseInt(ids) - 1;
        if (specId >= 0) {
          this.currentSpecialization = this.specializations[specId];
        }
      });
    }
  },
  watch: {
    currentSpecialization: {
      handler: function(val, oldVal) {
        this.$parent.slotChanged(val);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.spec-option-container,
.spec-stats {
  display: flex;
  flex-direction: column;
}
.spec-stats {
  padding: 6px 10px;
  color: white;
}
</style>