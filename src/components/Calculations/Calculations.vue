<template>
	<div class="stats-container">
		<BasicTile classes="stats-weapons">
			<div class="stats-weapons">
				<span class="section-title"> Calculations </span>
				<!-- <div class="toolbar">
          <StatInputV2
          :label="'Critical chance'"
          v-model="criticalChance"
          v-bind:max="100"
          :showMaxVal="true"
          @input="applyCHCandHSDtoTheTables()"
          ></StatInputV2>
          <StatInputV2
          :label="'Headshot Chance'"
          v-model="headshotChance"
          v-bind:max="100"
          :showMaxVal="true"
          @input="applyCHCandHSDtoTheTables()"
          ></StatInputV2>
          <div class="spacer"></div>
        </div> -->
				<template v-for="(tablesData, idx) in data">
					<div
						class="weapon-tables-container"
						v-bind:key="idx"
						v-if="tablesData"
					>
						<span class="ttk-weapon-name">{{
							tablesData.header
						}}</span>
						<div class="ttk-tables">
							<ResponsiveTable
								v-for="(tables, idx) in tablesData.tables"
								v-bind:key="idx"
								:title="`Stats`"
								:headers="tables.headers"
								:rowData="tables.rowData"
							></ResponsiveTable>
						</div>
					</div>
				</template>
			</div>
		</BasicTile>
		<button @click="saveAndShare()">Save & Share</button>
	</div>
</template>

<script>
	import coreService from "../../utils/coreService";
	import statsService from "../../utils/statsService";
	import BasicTile from "../BasicTile";
	import ResponsiveTable from "./ResponsiveTable";
	import TTKCoreService from "../../utils/TTKCore";
	// import StatInputV2 from "../generic/StatInputV2";

	const obj = {
		_meta: {
			buildUri:
				"IwJgtOAMbbP3RCYC4CsbnHsAzEuKZWFAFiOm0sgOLsnXqdsTOfZbZY-pRADZcYPMMgBOHiRAgJ0NNwIpQpScRQMFCdZKA",
			builderVersion: null,
		},
		gear: {
			primary: {
				itemName: null,
				isNamed: null,
				isExotic: null,
				talentName: null,
				weaponStats: {
					weaponDamage: 200947,
					chc: 0,
					chd: 25,
					hsd: 111,
					magazineSize: 20,
					dta: 0,
					dtooc: 0,
					baseWeaponDamage: null,
					rpm: null,
				},
			},
			secondary: {
				itemName: null,
				isNamed: null,
				isExotic: null,
				talentName: null,
				weaponStats: {
					weaponDamage: 115931,
					chc: 21,
					chd: 25,
					hsd: 50,
					magazineSize: 50,
					dta: 0,
					dtooc: 0,
					baseWeaponDamage: null,
					rpm: null,
				},
			},
			sidearm: {
				itemName: null,
				isNamed: null,
				isExotic: null,
				talentName: null,
				weaponStats: {
					weaponDamage: 104983,
					chc: 0,
					chd: 25,
					hsd: 100,
					magazineSize: 15,
					dta: 0,
					dtooc: 0,
					baseWeaponDamage: null,
					rpm: null,
				},
			},
			backpack: {
				itemName: null,
				isNamed: null,
				isExotic: null,
				isGearsetItem: null,
				talentName: null,
			},
			chest: {
				itemName: null,
				isNamed: null,
				isExotic: null,
				isGearsetItem: null,
				talentName: null,
			},
			mask: {
				itemName: null,
				isNamed: null,
				isExotic: null,
				isGearsetItem: null,
				talentName: null,
			},
			gloves: {
				itemName: null,
				isNamed: null,
				isExotic: null,
				isGearsetItem: null,
				talentName: null,
			},
			kneepads: {
				itemName: null,
				isNamed: null,
				isExotic: null,
				isGearsetItem: null,
				talentName: null,
			},
			holster: {
				itemName: null,
				isNamed: null,
				isExotic: null,
				isGearsetItem: null,
				talentName: null,
			},
		},
	};

	const weaponsTableData = [
		{
			header: "Offense",
			tables: [
				{
					rowData: [
						[
							"Weapon Damage",
							"103614",
							"474777",
							"596300",
							"2378950",
						],
						["Expertise", "", "", "2%", ""],
						[
							"PvP Weapon Damage",
							"41404",
							"126480",
							"198567",
							"633752",
						],
						["CHC", "50.00%", "50%", "50%", "50%"],
						["CHD", "161.40%", "175.40%", "151.40%", "151.40%"],
						["HSD", "90%", "110%", "145%", "235%"],
						["Armor DMG", "8%", "8%", "8%", "8%"],
						["Health DMG", "15%", "0%", "0%", "0%"],
						["Reload Time", "2.2", "2.7", "1.5", "2.9"],
						["Reload Speed Bonus", "10%", "10%", "20%", "10%"],
						["Accuracy", "10%", "10%", "30%", "10%"],
						["Stability", "25%", "25%", "25%", "25%"],
						["Weapon Handling", "0%", "0%", "0%", "0%"],
						["Ammo Capacity", "20%", "20%", "20%", "20%"],
						[
							"All Weapon Bonus",
							"94.40%",
							"94.40%",
							"96.40%",
							"94.40%",
						],
						["MMR DMG Bonus", "15%", "15%", "15%", "15%"],
						["Rifle DMG Bonus", "25%", "36.70%", "25%", "25%"],
						["AR DMG Bonus", "26%", "15%", "15%", "15%"],
						["LMG DMG Bonus", "10%", "10%", "10%", "10%"],
						["SMG DMG Bonus", "0%", "0%", "0%", "0%"],
						["Shotgun DMG Bonus", "0%", "0%", "0%", "0%"],
						["Pistol DMG Bonus", "0%", "0%", "15%", "0%"],
						["Explosive DMG", "0%", "0%", "0%", "0%"],
					],
					headers: [
						"   ",
						"Primary Weapon",
						"Secondary Weapon",
						"Sidearm",
						"Special Weapon",
					],
				},
			],
		},
		{
			header: "Defense",
			tables: [
				{
					rowData: [
						["Armor", "726015"],
						["Armor on Kill", "0"],
						["Armor Regen", "0"],
						["Max Health", "337138"],
						["Health on Kill", "0"],
						["Health Regeneration", "1686"],
						["Incoming Repairs", "0%"],
						["PfE", "0%"],
						["Pulse Resitance", "50%"],
						["Explosive Resistance", "50%"],
						["Hazard Protection", "10%"],
						["Bleed Resistance", "10%"],
						["Blind Deaf Resistance", "10%"],
						["Burn Resistance", "10%"],
						["Disorient Resistance", "10%"],
						["Disrupt Resistance", "10%"],
						["Ensnare Resistance", "10%"],
						["Poison Resistance", "10%"],
						["Shock Resistance", "10%"],
					],
					headers: ["Stat", "Value"],
				},
			],
		},
		{
			header: "Skill 1",
			tables: [
				{
					rowData: [
						["Tier", "0", ""],
						["Skill Haste", "10%", ""],
						["Cooldown", "17.2", ""],
						["Duration", "9.6", ""],
						["Effect Radius", "100", ""],
						["Conflict Cooldown", "103", ""],
						["Mod - Coil Slot", "7.50%", "Cone Size"],
						["Mod - Housing Slot", "5.70%", "Skill Haste"],
					],
					headers: ["Scanner Pulse", "Value", "Comment"],
				},
			],
		},
		{
			header: "Skill 2",
			tables: [
				{
					rowData: [
						["Tier", "0", ""],
						["Skill Haste", "10%", ""],
						["Ammo", "2", ""],
						["Ammo Cooldown", "27.3", ""],
						["Cloud Radius", "3", ""],
						["Ensnare Duration", "6", ""],
						["Foam Health", "452470", ""],
						["PvP Ensare Duration", "2", ""],
						["Mod - Agitator Slot", "4.90%", "Damage"],
						["Mod Pneumatics Slot", "1", "Ammo"],
					],
					headers: ["Riot Foam Chem Launcher", "Value", "Comment"],
				},
			],
		},
	];

	const weaponMappings = {
		1: "primary",
		2: "secondary",
		3: "sidearm",
		primary: 1,
		secondary: 2,
		sidearm: 3,
	};

	const weaponSlots = [
		{ id: "primary", name: "Primary" },
		{ id: "secondary", name: "Secondary" },
		{ id: "sidearm", name: "SideArm" },
	];

	const weaponStats = [
		{ name: "Weapon Damage", prop: "weaponDamage", unit: "" },
		{ name: "Expertise", prop: "expertise", unit: "%" },
		{ name: "Critical Hit Chance", prop: "chc", unit: "%" },
		{ name: "Critical Hit Damage", prop: "chd", unit: "%" },
		{ name: "Headshot Damage", prop: "hsd", unit: "%" },
		{ name: "Armor Damage", prop: "dmgToArmored", unit: "" },
		{ name: "Health Damage", prop: "dth", unit: "" },
		{ name: "Reload Time", prop: "reloadSpeed", unit: "ms" },
		{ name: "Reload Speed Bonus", prop: "", unit: "%" },
		{ name: "Accuracy", prop: "", unit: "%" },
		{ name: "Stability", prop: "", unit: "%" },
		{ name: "Weapon Handling", prop: "", unit: "%" },
		{ name: "Ammo Capacity", prop: "", unit: "%" },
		{ name: "All Weapon Bonus", prop: "", unit: "%" },
		{ name: "MMR DMG Bonus", prop: "", unit: "%" },
		{ name: "Rifle DMG Bonus", prop: "", unit: "%" },
		{ name: "AR DMG Bonus", prop: "", unit: "%" },
		{ name: "LMG DMG Bonus", prop: "", unit: "%" },
		{ name: "SMG DMG Bonus", prop: "", unit: "%" },
		{ name: "Shotgun DMG Bonus", prop: "", unit: "%" },
		{ name: "Pistol DMG Bonus", prop: "", unit: "%" },
		{ name: "Explosive DMG", prop: "", unit: "%" },
	];

	const buildStats = {
		mask: null,
		backpack: null,
		chest: null,
		gloves: null,
		holster: null,
		kneepads: null,
		primary: null,
		secondary: null,
		sidearm: null,
		specialization: null,
		shdlevels: null,
		skill1: null,
		skill2: null,
	};

	const statsInfo = {
		cores: null,
		defensive: null,
		handling: null,
		offensive: null,
		skills: null,
		utility: null,
		weapons: null,
		brands: null,
		shdlevels: null,
	};

	function buildMetaMoJoe(stats = null) {
		// console.log(window.location);
		let urlParams = new URLSearchParams(window.location.search);
		// if (urlParams.get("raw")) console.log("GOTIT");
		// // console.log("buildStats:", buildStats);
		// // console.log("stats:", stats);
		// // console.groupCollapsed("buildMetaMoJoe");
		const metaMoJoe = {
			_meta: {
				buildUri: window.location.hash.replace("#/", ""),
				builderVersion: null,
			},
			gear: {
				primary: {
					itemName: getItemInfo("primary", "name"),
					isNamed: getItemInfo("primary", "quality", "", "Named"),
					isExotic: getItemInfo("primary", "quality", "", "Exotic"),
					talentName: getItemInfo("primary", "Name", "talent"),
					weaponStats: {
						weaponDamage: 0,
						baseWeaponDamage: 0,
						chc: 0,
						chd: 0,
						hsd: 0,
						headshotChance: 0,
						rpm: 0,
						magazineSize: 0,
						dth: 0,
						dta: 0,
						dtooc: 0,
					},
				},
				secondary: {
					itemName: getItemInfo("secondary", "name"),
					isNamed: getItemInfo("secondary", "quality", "", "Named"),
					isExotic: getItemInfo("secondary", "quality", "", "Exotic"),
					talentName: getItemInfo("secondary", "Name", "talent"),
					weaponStats: {
						weaponDamage: 0,
						baseWeaponDamage: 0,
						chc: 0,
						chd: 0,
						hsd: 0,
						headshotChance: 0,
						rpm: 0,
						magazineSize: 0,
						dth: 0,
						dta: 0,
						dtooc: 0,
					},
				},
				sidearm: {
					itemName: getItemInfo("sidearm", "name"),
					isNamed: getItemInfo("sidearm", "quality", "", "Named"),
					isExotic: getItemInfo("sidearm", "quality", "", "Exotic"),
					talentName: getItemInfo("sidearm", "Name", "talent"),
					weaponStats: {
						weaponDamage: 0,
						baseWeaponDamage: 0,
						chc: 0,
						chd: 0,
						hsd: 0,
						headshotChance: 0,
						rpm: 0,
						magazineSize: 0,
						dth: 0,
						dta: 0,
						dtooc: 0,
					},
				},
				backpack: {
					itemName: getItemInfo("backpack", "itemName"),
					isNamed: getItemInfo("backpack", "quality", "", "Named"),
					isExotic: getItemInfo("backpack", "quality", "", "Exotic"),
					isGearsetItem: getItemInfo(
						"backpack",
						"quality",
						"",
						"Gearset"
					),
					talentName: getItemInfo("backpack", "Talent", "talent"),
				},
				chest: {
					itemName: getItemInfo("chest", "itemName"),
					isNamed: getItemInfo("chest", "quality", "", "Named"),
					isExotic: getItemInfo("chest", "quality", "", "Exotic"),
					isGearsetItem: getItemInfo(
						"chest",
						"quality",
						"",
						"Gearset"
					),
					talentName: getItemInfo("chest", "Talent", "talent"),
				},
				mask: {
					itemName: getItemInfo("mask", "itemName"),
					isNamed: getItemInfo("mask", "quality", "", "Named"),
					isExotic: getItemInfo("mask", "quality", "", "Exotic"),
					isGearsetItem: getItemInfo(
						"mask",
						"quality",
						"",
						"Gearset"
					),
					talentName: getItemInfo("mask", "Talent", "talent"),
				},
				gloves: {
					itemName: getItemInfo("gloves", "itemName"),
					isNamed: getItemInfo("gloves", "quality", "", "Named"),
					isExotic: getItemInfo("gloves", "quality", "", "Exotic"),
					isGearsetItem: getItemInfo(
						"gloves",
						"quality",
						"",
						"Gearset"
					),
					talentName: getItemInfo("gloves", "Talent", "talent"),
				},
				kneepads: {
					itemName: getItemInfo("kneepads", "itemName"),
					isNamed: getItemInfo("kneepads", "quality", "", "Named"),
					isExotic: getItemInfo("kneepads", "quality", "", "Exotic"),
					isGearsetItem: getItemInfo(
						"kneepads",
						"quality",
						"",
						"Gearset"
					),
					talentName: getItemInfo("kneepads", "Talent", "talent"),
				},
				holster: {
					itemName: getItemInfo("holster", "itemName"),
					isNamed: getItemInfo("holster", "quality", "", "Named"),
					isExotic: getItemInfo("holster", "quality", "", "Exotic"),
					isGearsetItem: getItemInfo(
						"holster",
						"quality",
						"",
						"Gearset"
					),
					talentName: getItemInfo("holster", "Talent", "talent"),
				},
				// exoticGear: {
				// 	itemName: "",
				// 	talentName: "",
				// },
				// gearsetName: "",
				// hasFullGearsetBonus: false,
			},
		};
		console.groupEnd();
		if (stats) {
			// // console.groupCollapsed("build weapon stats");
			// // console.log("stats.Weapons:", stats.Weapons);
			for (const slot in weaponSlots) {
				// // console.log("stats.Weapons (primary):", stats.Weapons);
				if (Object.hasOwnProperty.call(weaponSlots, slot)) {
					const element = weaponSlots[slot];
					// // console.log(element.id);
					// // console.log(element.name);
					if (
						stats.Weapons &&
						Object.hasOwnProperty.call(stats.Weapons, element.name)
					) {
						// // console.groupCollapsed(`NEW (${element.name})`);
						// // console.log(
						// // 	`stats.Weapons[element.name] (${element.name}):`,
						// // 	stats.Weapons[element.name]
						// // );
						metaMoJoe["gear"][element.id]["weaponStats"] = {
							weaponDamage: parseInt(
								stats.Weapons[element.name].weaponDamage
							),
							chc: stats.Weapons[element.name].chc,
							chd: stats.Weapons[element.name].chd,
							hsd: stats.Weapons[element.name].hsd,
							headshotChance: stats.Weapons[element.name].hsc,
							magazineSize:
								stats.Weapons[element.name].totalMagSize,
							dth: stats.Weapons[element.name].dth,
							dta: stats.Weapons[element.name].dta,
							dtooc: stats.Weapons[element.name].dtooc,
						};
						// // console.groupEnd();
					}
					metaMoJoe["gear"][element.id]["weaponStats"][
						"baseWeaponDamage"
					] = getItemInfo(element.id, "base damage");
					metaMoJoe["gear"][element.id]["weaponStats"][
						"rpm"
					] = getItemInfo(element.id, "rpm");
				}
			}
			// // console.groupEnd();
		}

		// console.log("buildStats:", buildStats);
		// // console.log("buildMetaMoJoe:", metaMoJoe);
	}

	function getItemInfo(parent, item, child = null, check = null) {
		// // console.log(`parent (${parent}):`, buildStats[parent]);
		// // console.log("child:", child);
		// // console.log("item:", item);
		// // console.log("check:", check);
		// parent with child
		if (
			parent &&
			child &&
			Object.hasOwnProperty.call(buildStats, parent) &&
			buildStats[parent] &&
			Object.hasOwnProperty.call(buildStats[parent], child) &&
			buildStats[parent][child] &&
			Object.hasOwnProperty.call(buildStats[parent][child], item)
		) {
			if (check && buildStats[parent][child][item] === check) {
				// // console.log("true");
				return true;
			} else if (check && buildStats[parent][child][item] !== check) {
				// // console.log("false");
				return false;
			} else if (!check) {
				// // console.log(buildStats[parent][child][item]);
				return buildStats[parent][child][item];
			}
		}
		// parent no child
		if (
			parent &&
			Object.hasOwnProperty.call(buildStats, parent) &&
			buildStats[parent] &&
			Object.hasOwnProperty.call(buildStats[parent], item)
		) {
			if (check && buildStats[parent][item] === check) {
				// // console.log("true");
				return true;
			} else if (check && buildStats[parent][item] !== check) {
				// // console.log("false");
				return false;
			} else if (!check) {
				// // console.log(buildStats[parent][item]);
				return buildStats[parent][item];
			}
		}
		// // console.log("null");
		return null;
	}

	function getItemStats(stats, parent, item, child = null, check = null) {
		// // console.log(`parent (${parent}):`, stats[parent]);
		// // console.log("child:", child);
		// // console.log("item:", item);
		// // console.log("check:", check);
		// parent with child
		if (
			parent &&
			child &&
			Object.hasOwnProperty.call(stats, parent) &&
			stats[parent] &&
			Object.hasOwnProperty.call(stats[parent], child) &&
			stats[parent][child] &&
			Object.hasOwnProperty.call(stats[parent][child], item)
		) {
			if (check && stats[parent][child][item] === check) {
				// // console.log("true");
				return true;
			} else if (check && stats[parent][child][item] !== check) {
				// // console.log("false");
				return false;
			} else if (!check) {
				// // console.log(stats[parent][child][item]);
				return stats[parent][child][item];
			}
		}
		// parent no child
		if (
			parent &&
			Object.hasOwnProperty.call(stats, parent) &&
			stats[parent] &&
			Object.hasOwnProperty.call(stats[parent], item)
		) {
			if (check && stats[parent][item] === check) {
				// // console.log("true");
				return true;
			} else if (check && stats[parent][item] !== check) {
				// // console.log("false");
				return false;
			} else if (!check) {
				// // console.log(stats[parent][item]);
				return stats[parent][item];
			}
		}
		// // console.log(0);
		return 0;
	}

	coreService
		.subscribeAllSlotsData$()
		.subscribe(
			([
				Mask,
				Backpack,
				Chest,
				Gloves,
				Holster,
				Kneepads,
				Primary,
				Secondary,
				SideArm,
				Specialization,
				SHDLevels,
				Skill1,
				Skill2,
			]) => {
				// console.log([Mask][0].itemName);
				buildStats.mask = [Mask][0];
				buildStats.backpack = [Backpack][0];
				buildStats.chest = [Chest][0];
				buildStats.gloves = [Gloves][0];
				buildStats.holster = [Holster][0];
				buildStats.kneepads = [Kneepads][0];
				buildStats.primary = [Primary][0];
				buildStats.secondary = [Secondary][0];
				buildStats.sidearm = [SideArm][0];
				buildStats.specialization = [Specialization][0];
				buildStats.shdlevels = [SHDLevels][0];
				buildStats.skill1 = [Skill1][0];
				buildStats.skill2 = [Skill2][0];
				buildMetaMoJoe(buildStats);
			}
		);

	// statsService.getStats$().subscribe((stats) => {
	// console.log("statsService:", stats);
	// statsInfo.cores = stats.Cores;
	// console.log(statsInfo);
	// });

	export default {
		name: "Calculations",
		components: {
			ResponsiveTable,
			// StatInputV2,
			BasicTile,
		},
		data() {
			return {
				data: [],
				criticalChance: 0,
				headshotChance: 0,
				buildStats: buildStats,
				meta_mojoe: {},
			};
		},
		created() {
			statsService.getStats$().subscribe((stats) => {
				// console.log("statsService:", stats);
				this.updateMoJoeData(stats);
				this.updateTables(stats);
			});
			TTKCoreService.subscribeToCoreWeaponData().subscribe(
				(tableData) => {
					// console.log(tableData);
					// this.updateTables(tableData);
					if (this.isCHCandHSDSet()) {
						this.applyCHCandHSDtoTheTables();
					}
				}
			);
			// console.log(this.buildMetaMoJoe());
		},
		methods: {
			updateTables(data) {
				// I need to come up with a better name with this variable
				// this.data = data;
				this.data = weaponsTableData;
				this.buildStats = buildStats;
			},
			applyCHCandHSDtoTheTables() {
				TTKCoreService.applyCHCandHSDtoTheTables(
					this.criticalChance,
					this.headshotChance
				);
			},
			isCHCandHSDSet() {
				return this.criticalChance !== 0 || this.headshotChance !== 0;
			},
			updateMoJoeData(stats) {
				if (stats) {
					buildMetaMoJoe(stats);
					// console.log(stats);
					weaponsTableData[0].tables[0].headers = [
						"   ",
						"Primary Weapon",
						"Secondary Weapon",
						"Sidearm",
						"Special Weapon",
					];
					const primaryWeaponStats = statsService.getWeaponStatsPerSlot(
						"Primary"
					);
					const secondaryWeaponStats = statsService.getWeaponStatsPerSlot(
						"Secondary"
					);
					const sidearmWeaponStats = statsService.getWeaponStatsPerSlot(
						"SideArm"
					);
					// console.log(primaryWeaponStats);
					const rowData = [];
					if (stats && Object.hasOwnProperty.call(stats, "Weapons")) {
						weaponStats.forEach((element) => {
							// console.log(
							// 	statsService.getWeaponStatsPerSlot("Primary")
							// );
							// console.log(
							// 	`Primary`,
							// 	stats.Weapons["Primary"][element.prop]
							// );
							// console.log(element.prop);
							if (
								(Object.hasOwnProperty.call(
									stats.Weapons["Primary"],
									element.prop
								) ||
									Object.hasOwnProperty.call(
										stats.Weapons["Secondary"],
										element.prop
									) ||
									Object.hasOwnProperty.call(
										stats.Weapons["SideArm"],
										element.prop
									)) &&
								(stats.Weapons["Primary"][element.prop] ||
									stats.Weapons["Secondary"][element.prop] ||
									stats.Weapons["SideArm"][element.prop])
							) {
								rowData.push([
									element.name,
									this.formatValue(
										primaryWeaponStats,
										element
									),
									this.formatValue(
										secondaryWeaponStats,
										element
									),
									this.formatValue(
										sidearmWeaponStats,
										element
									),
									"[Placeholder Value]",
								]);
							}
						});
					}
					weaponsTableData[0].tables[0].rowData = rowData;
					weaponsTableData[0].tables[0].headers[1] =
						primaryWeaponStats.weaponName;
					weaponsTableData[0].tables[0].headers[2] =
						secondaryWeaponStats.weaponName;
					weaponsTableData[0].tables[0].headers[3] =
						sidearmWeaponStats.weaponName;
					// console.log(weaponsTableData[0]);
				}
			},
			formatValue(stats, element) {
				const value = parseInt(stats[element.prop]).toLocaleString();
				const unit = element.unit ? element.unit : "";
				return `${value} ${unit}`;
			},
		},
	};
</script>

.<style scoped>
	.stats-container {
		display: grid;
		grid-template-columns: repeat(5, [col] 1fr);
		grid-template-rows: repeat(2, [row] auto);
		gap: 8px;
		margin-top: 8px;
		margin-left: 8px;
		margin-right: 8px;
		margin-bottom: 70px;
	}

	.stats-weapons {
		grid-column: col / span 5;
		grid-row: row 1;
	}

	.ttk-tables {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
	}

	span.ttk-weapon-name {
		font-weight: 800;
		font-size: 18px;
		margin-top: 16px;
		display: block;
	}
</style>
