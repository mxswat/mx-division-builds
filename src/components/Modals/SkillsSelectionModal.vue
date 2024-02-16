<template>
	<div class="skills-selection-modal">
		<input
			class="mx-input search"
			placeholder="Search..."
			type="text"
			@input="debouceSearch"
		/>
		<div class="button-container">
			<ToggleButton
				class="menu-btt"
				v-model="showMobileMenu"
				onLabel="Skill Types"
				offLabel="Skill Types"
				onIcon="pi pi-minus"
				offIcon="pi pi-plus"
				iconPos="right"
			/>
		</div>
		<div class="search-toolbar" :class="{ showOnMobile: showMobileMenu }">
			<button
				class="mx-btt"
				v-for="(type, key) in skillTypes"
				v-bind:key="key"
				@click="
					scrollToElementID(type);
					showMobileMenu = false;
				"
			>
				{{ type }}
			</button>
		</div>
		<div class="overflow-handler">
			<div class="skills-grid">
				<div
					v-for="(item, index) in gridItems"
					v-bind:key="index"
					:class="item.classes"
					@[item.event]="onSelection(item.skill)"
				>
					<template v-if="item.type">
						<div :id="item.type">{{ item.type }}</div>
					</template>
					<template v-else>
						<BasicTile :classes="'anim-enabled'">
							<div class="tile-content">
								<template v-if="!item.skill">
									<span class="name">
										Empty Slot
									</span>
									<div class="description">Remove the item from this slot.</div>
								</template>
								<template v-else>
									<span class="name">
										{{ getDisplayName(item.skill) }}
									</span>
									<div>
										<img
											v-if="getSkillIcon(item.skill)"
											class="skill-icon"
											:src="getSkillIcon(item.skill)"
											alt=""
										/>
										<div class="description">{{ item.skill.Desc }}</div>
										<div class="status">Applies {{ item.skill.Status }} status effect on affected target.</div>
										<div>
											<ul
												class="stats-container"
												v-if="getSkillStats(item.skill).length > 0"
											>
												<li class="stats-wrap">
													<span class="stat"
														>Expertise: {{ item.skill["Expertise Bonus"]
														}}<br />
													</span>
												</li>
												<li
													class="stats-wrap"
													v-for="(stat, idx) in getSkillStats(item.skill)"
													v-bind:key="idx"
												>
													<span class="stat"
														>{{ stat.Stat }} {{ stat.Val }}<br />
													</span>
												</li>
											</ul>
										</div>
									</div>
								</template>
							</div>
						</BasicTile>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		IsEverythingLoadedPromise,
		skillsData,
	} from "../../utils/dataImporter";
	import { qualityToCss, groupArrayOfObjectsByKey } from "../../utils/utils";
	import BasicTile from "../BasicTile.vue";

	const skillNameProp = "Item Name";

	export default {
		name: "SkillsSelectionModal",
		props: ["skillsData", "onModalClose", "skillSlot"],
		components: {
			BasicTile,
		},
		data() {
			return {
				skillsList: [],
				skillStats: [],
				searchText: "",
				debounce: null,
				showMobileMenu: false,
			};
		},
		computed: {
			skillTypes: function() {
				// this updates if the grid items are filtered by the user
				return this.gridItems
					.filter((item) => item.type)
					.map((item) => item.type);
			},
			gridItems: function() {
				// computed list of items which can be filtered by user searches

				// vue won't let us loop on templates for the alternating grid sections
				// so we flatten the list sections and weapons into a single list

				// filter the full list of sklls if needed before
				// generating the list of items for the grid
				const skills = this.searchText.length
					? this.getFilteredSkillsList()
					: this.skillsList;

				const itemList = [];
				// add an empty slot at the beginning of each section
				itemList.push({
					type: null,
					classes: "remove-item",
					event: "click",
					skill: null,
				});
				Object.keys(skills).forEach((type) => {
					// add each skill type section heading
					itemList.push({
						type: type,
						classes: "skill-type",
						event: null,
						skill: null,
					});
					skills[type].forEach((skill) => {
						// then add all of the skills for the section
						itemList.push({
							type: null,
							classes: "skill-slot",
							event: "click",
							skill: skill,
						});
					});
				});
				return itemList;
			},
		},
		methods: {
			getSkillIcon(skill) {
				// console.log(skill);
				return skill.Icon ? `./icons/skills/${skill.Icon}` : "";
			},
			scrollToElementID(divId) {
				document.getElementById(divId).scrollIntoView();
			},
			getSkillStats(skill) {
				const stats = this.skillStats
					.filter((skillStat) => {
						return (
							`${skill["Variant"]} ${skill["Item Name"]}` ===
								skillStat["Skill Variant Name"] &&
							// !stat.Stat.toLowerCase().includes("pvp") &&
							// !stat.Stat.toLowerCase().includes("conflict") &&
							!skillStat.Stat.toLowerCase().includes("(blank)") &&
							skillStat.Display.toLowerCase() === "true"
						);
					})
					.sort((a, b) => (a.Stat > b.Stat ? 1 : -1));
				// console.log(stats);
				// let uniqueObjArray = [
				// 	...new Map(
				// 		stats.map((item) => [item["Stat"], item])
				// 	).values(),
				// ];
				// // console.log(uniqueObjArray);
				// return uniqueObjArray;
				return stats;
			},
			qualityToCSS(quality) {
				// TODO Cleanup this - Maybe use it for Spec Specific Skills
				return qualityToCss[quality];
			},
			getDisplayName(skill) {
				return `${skill["Variant"]} ${skill[skillNameProp]}`;
			},
			onSelection(skill) {
				this.$emit("close");
				this.onModalClose(skill);
			},
			debouceSearch(event) {
				clearTimeout(this.debounce);
				this.debounce = setTimeout(() => {
					this.searchText = event.target.value;
				}, 300);
			},
			getFilteredSkillsList() {
				const searchText = this.searchText.toLocaleLowerCase();
				const result = {};
				Object.keys(this.skillsList).forEach((type) => {
					const filtered = this.skillsList[type].filter((skill) => {
						return this.getDisplayName(skill)
							.toLocaleLowerCase()
							.includes(searchText);
					});
					if (filtered.length) {
						result[type] = filtered;
					}
				});
				return result;
			},
		},
		created() {
			Promise.all([
				IsEverythingLoadedPromise,
				skillsData.Skills,
				skillsData.SkillStats,
			]).then((data) => {
				this.skillsList = data[1];
				this.skillsList = groupArrayOfObjectsByKey(
					this.skillsList,
					"Item Name"
				);
				this.skillStats = data[2];
			});
		},
	};
</script>

<style lang="scss" scoped>
	.skills-selection-modal {
		height: 100%;
		width: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	.skills-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 8px;
		padding: 8px;

		.tile {
			padding: unset; /* must unset so we can apply to content below */
			height: 100%;
			min-height: 10px;

			.tile-content {
				padding: 16px;
			}
		}
		.remove-item {
			grid-column: 1 / -1;
			cursor: pointer;
		}
		.skill-type {
			grid-column: 1 / -1;
			font-size: 20px;
			font-weight: 600;
		}

		.skill-slot {
			min-width: 250px; /* must be the same as grid min */
			max-width: 500px;
			cursor: pointer;

			.skill-icon {
				height: 84px;
				width: 84px;
				object-fit: contain;
				opacity: 0.7;
				// position: absolute;
				// top: 60px;
				// right: 16px;
				float: right;
				z-index: 0;
			}

			.name {
				width: 100%;
				font-size: 18px;
				font-weight: 600;
			}

			.stats-container {
				display: flex;
				flex-direction: column;
				padding-left: 18px;

				.stats-wrap {
					border-left: 2px solid white;
					margin-top: 5px;
					padding-left: 6px;
				}
			}
		}
	}

	.description,
	.status,
	.stat {
		white-space: pre-line;
	}

	.overflow-handler {
		max-height: 100%;
		overflow: auto;
	}

	.search-toolbar {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 8px;
		padding: 8px;
		background: #252525;
		z-index: 2;
		border-bottom: 1px solid white;
		.mx-btt {
			margin: 0;
		}
	}

	// don't show the menu button normally
	.button-container {
		display: none;
		margin: 8px;

		.menu-btt {
			width: 100%;
			text-align: left;
			padding: 0 .5rem;
			background: unset;
			border: 0;
			border-bottom: 1px solid #fff;
			border-radius: 0;
		}
	}

	// mobile switch to menu W/ button
	@media only screen and (max-width: 850px) {
		.button-container {
			display: flex;
		}
		.search-toolbar {
			display: none;
			&.showOnMobile {
				display: grid;
			}
		}
	}
</style>
