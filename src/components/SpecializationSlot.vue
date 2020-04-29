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

export default {
  name: "SpecializationSlot",
  data() {
    return {
      specializations: [],
      currentSpecialization: null
    };
  },
  created() {
    specializationList.Specialization.then(specializations => {
      const holder = {};
      for (let i = 0; i < specializations.length; i++) {
        const specialization = specializations[i];
        holder[specialization.Name] = holder[specialization.Name] || {};
        holder[specialization.Name].name = specialization.Name;
        holder[specialization.Name].stats =
          holder[specialization.Name].stats || [];
        holder[specialization.Name].stats.push({
          name: specialization.Stat,
          val: specialization.Val
        });
      }
      this.specializations = Object.values(holder);
    });
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