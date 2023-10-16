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
						<span class="spec-name">{{ option.name }}</span>
						<div class="spec-stats">
							<span
								class="spec-stat"
								v-for="stat in option.stats"
								v-bind:key="stat.name"
								>{{ stat.name }} {{ stat.val }}</span
							>
						</div>
					</div>
				</template>
				<template #selected-option="option">
					<div class="spec-option-container">
						<span class="spec-name">{{ option.name }}</span>
					</div>
				</template>
			</v-select>
			<span v-if="currentSpecialization" class="spec-stats">
				<span
					class="spec-stat"
					v-for="stat in currentSpecialization.stats"
					v-bind:key="stat.name"
					>{{ stat.name }} {{ stat.val }}</span
				>
			</span>
		</div>
	</div>
</template>

<script>
	import { specializationList } from "../utils/dataImporter";
	import { decodedSlots } from "../utils/urlEncorder";
	import coreService from "../utils/coreService";

	export default {
		name: "SpecializationSlot",
		props: {
			init: null,
		},
		data() {
			return {
				specializations: [],
				currentSpecialization: null,
			};
		},
		created() {
			let specIndex = 0;
			specializationList.Specialization.then((specializations) => {
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
						val: specialization.Val,
					});
				}
				this.specializations = Object.values(holder);

				if (this.specializations.length) {
					// push a dummy attribute onto the front of the list
					this.specializations.unshift({
						name: "(Blank)",
						stats: [],
						id: -1,
					});
				}
			});
			this.initSpec();
		},
		methods: {
			initSpec() {
				coreService.getSlotInit$("Specialization").subscribe((ids) => {
					const specId = parseInt(ids);
					if (specId >= 0) {
						this.currentSpecialization = this.specializations[specId];
					}
				});
			},
		},
		watch: {
			currentSpecialization: {
				handler: function(val, oldVal) {
					// console.log(`val: ${JSON.stringify(val)}`)
					if (val && val["name"] === "(Blank)") {
						// setting this to null will clear the select control
						// and trigger another run though this code with val === null
						this.currentSpecialization = null;
					} else {
						coreService.sendSlotData("Specialization", val);
					}
				},
				deep: true,
			},
		},
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
		flex-direction: row;
		flex-wrap: wrap;
	}

	.spec-stat {
		display: flex;
		flex-shrink: 0;
		flex-grow: 1;
		flex-basis: 258px;
		margin-right: 8px;
		border-bottom: 1px solid white;
		padding: 4px 0px;
	}
</style>
