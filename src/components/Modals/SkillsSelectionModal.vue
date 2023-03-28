<template>
	<div class="skills-selection-modal">
		<input
			class="mx-input search"
			placeholder="Search..."
			type="text"
			@input="debouceSearch"
		/>
		<a
			@click="showMobileMenu = !showMobileMenu"
			class="menu-btt arrow-down"
		>
			Skill Types
		</a>
		<div class="search-toolbar" :class="{ showOnMobile: showMobileMenu }">
			<a
				class="mx-btt"
				v-for="(skills, key) in skillsList"
				v-bind:key="key"
				@click="scrollToElementID(key)"
				>{{ key }}</a
			>
		</div>
		<div class="overflow-handler">
			<div v-for="(skills, key) in skillsList" v-bind:key="key">
				<span
					class="skill-type"
					v-if="filterByName(skills).length > 0"
					:id="key"
					>{{ key }}
				</span>
				<div class="skills-grid" v-if="filterByName(skills).length > 0">
					<div
						class="skills-slot"
						v-for="(skill, idx) in filterByName(skills)"
						v-bind:key="idx"
						:class="[qualityToCSS(skill.Variant)]"
						@click="onSelection(skill)"
					>
						<img class="skill-icon" :src="skill['Icon']" alt="" />
						<BasicTile :classes="'anim-enabled'">
							<span class="name">
								{{ getDisplayName(skill) }}
							</span>
							<div class="white-space-pre-wrap">
								{{ skill.Desc }}
							</div>
							<div class="white-space-pre-wrap">
								<ul
									class="bonuses-container"
									v-if="getSkillStats(skill).length > 0"
								>
									<li
										class="stats-wrap"
										v-for="(stat, idx) in getSkillStats(
											skill
										)"
										v-bind:key="idx"
									>
										<span class="stat white-space-pre-wrap">
											{{ stat.Stat }}
											{{ stat.Val }}
											<br />
										</span>
									</li>
								</ul>
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
		skillsData,
		IsEverythingLoadedPromise,
	} from "../../utils/dataImporter";
	import { qualityToCss, groupArrayOfObjectsByKey } from "../../utils/utils";
	import BasicTile from "../BasicTile";
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
				showMobileMenu: false,
			};
		},
		methods: {
			scrollToElementID(divId) {
				document.getElementById(divId).scrollIntoView();
			},
			getSkillStats(skill) {
				const stats = this.skillStats.filter((stat) => {
					return (
						`${skill["Variant"]} ${skill["Item Name"]}` ===
							stat["Variant"] &&
						!stat.Stat.toLowerCase().includes("pvp") &&
						!stat.Stat.toLowerCase().includes("conflict") &&
						!stat.Stat.toLowerCase().includes("(blank)")
					);
				});
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
			filterByName(list) {
				return list.filter((skill) =>
					this.getDisplayName(skill)
						.toLocaleLowerCase()
						.includes(this.searchText.toLocaleLowerCase())
				);
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
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 8px;
		padding: 8px;
		.tile {
			min-height: 100px;
			width: 100%;
		}
		.skills-slot {
			display: flex;
			flex-wrap: wrap;
			position: relative;
			min-height: 90px;
			cursor: pointer;

			.name {
				width: 100%;
				font-size: 18px;
				font-weight: 600;
			}

			.bonuses-container {
				display: flex;
				flex-direction: column;
				padding-left: 18px;
			}
			.overflow-handler {
				max-height: 100%;
				overflow: auto;
			}
		}

		.skill-icon {
			height: 84px;
			width: 84px;
			object-fit: contain;
			opacity: 0.7;
			position: absolute;
			top: 60px;
			right: 16px;
			z-index: 0;
		}

		.stats-wrap {
			border-left: 2px solid white;
			margin-top: 5px;
			padding-left: 4px;
		}
	}

	.skill-type {
		font-size: 20px;
		font-weight: 600;
		margin-left: 8px;
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

	.menu-btt {
		display: none;
		height: 31px;
		line-height: 31px;
		color: white;
		padding-right: 24px;
		background-color: transparent;
		border: 0px;
		background-position: right;
		border-bottom: 1px solid white;
		margin-top: 8px;
		margin-bottom: 4px;
		margin-right: 8px;
		margin-left: 8px;
		width: auto;
	}

	// mobile switch to menu W/ button
	@media only screen and (max-width: 550px) {
		.menu-btt {
			display: flex;
		}
		.search-toolbar {
			display: none;
			&.showOnMobile {
				display: flex;
				flex-direction: column;
				button {
					margin-right: 0;
				}
			}
		}
	}
</style>
