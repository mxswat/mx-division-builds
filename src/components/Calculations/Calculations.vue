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
							tablesData.weaponName
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
	</div>
</template>

<script>
	import BasicTile from "../BasicTile";
	import ResponsiveTable from "./ResponsiveTable";
	import TTKCoreService from "../../utils/TTKCore";
	// import StatInputV2 from "../generic/StatInputV2";

	const weaponsTableData = [
		{
			weaponName: "Offense",
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
			weaponName: "Defense",
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
			weaponName: "Skill 1",
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
			weaponName: "Skill 2",
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
			};
		},
		created() {
			TTKCoreService.subscribeToCoreWeaponData().subscribe(
				(tableData) => {
					// console.log(tableData);
					this.updateTables(tableData);
					if (this.isCHCandHSDSet()) {
						this.applyCHCandHSDtoTheTables();
					}
				}
			);
		},
		methods: {
			updateTables(data) {
				// I need to come up with a better name with this variable
				// this.data = data;
				this.data = weaponsTableData;
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
