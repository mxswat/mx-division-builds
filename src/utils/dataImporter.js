import Papa from "papaparse";
import {
	csvToArrayWithKeys,
	getAppRootPath,
	groupArrayOfObjectsByKey,
} from "./utils";
let IsEverythingLoadedPromiseResolve, IsEverythingLoadedPromiseReject;

const IsEverythingLoadedPromise = new Promise(function(resolve, reject) {
	IsEverythingLoadedPromiseResolve = resolve;
	IsEverythingLoadedPromiseReject = reject;
});

const ClientDBVersion = localStorage.getItem("localDBversion") || "";
let RemoteDBVersion = process.env.VUE_APP_DB_VERSION;

function getFromGoogleDrive(dataSources, listToPopulate) {
	for (let i = 0; i < dataSources.length; i++) {
		const DataTableName = dataSources[i].key;
		const url = dataSources[i].url;
		if (!ClientDBVersion || ClientDBVersion !== RemoteDBVersion) {
			listToPopulate[DataTableName] = new Promise((resolve, reject) => {
				Papa.parse(url, {
					download: true,
					complete: function(incomingData, fileName) {
						try {
							// console.log("Parsing complete:", incomingData, fileName);
							const headers = incomingData.data.shift();
							let result = csvToArrayWithKeys(headers, incomingData.data);
							localStorage.setItem(DataTableName, JSON.stringify(result));
							resolve(result);
						} catch (error) {
							reject(
								"Something when wrong during the download of one data table"
							);
						}
					},
					error: function returnError(params) {
						reject(
							"Something when wrong during the download of one data table"
						);
					},
				});
			});
		} else {
			const localData = localStorage.getItem(DataTableName);
			listToPopulate[DataTableName] = Promise.resolve(JSON.parse(localData));
		}
	}
}

const urls = ["gear", "weapons"];

const VendorPromises = Promise.all(
	urls.map((url) =>
		fetch(
			`${getAppRootPath()}vendors/${url}.json?${new Date().toISOString()}`
		).then((e) => e.json())
	)
).then((data) => {
	const gear = data[0].map((g) => {
		return {
			Name: g.rarity.includes("named") ? g.name : g.brand,
			Slot: g.slot,
			Vendor: g.vendor,
		};
	});

	const weapons = data[1].map((g) => {
		return {
			Name: g.rarity.includes("named")
				? g.name.replace(/-.*/i, "").trim()
				: g.name,
			Vendor: g.vendor,
		};
	});
	const gearBySlot = groupArrayOfObjectsByKey(gear, "Slot");
	return {
		Gear: gearBySlot,
		Weapons: weapons,
	};
});

// DB.version path
const path = getAppRootPath() + "DB.Version";

// Disable browser cache for the DB version using new Date
fetch(`${path}?${new Date().toISOString()}`, { method: "GET" })
	.then((response) => response.blob())
	.then((blob) => blob.text())
	.then((DownloadedDBVersion) => {
		RemoteDBVersion = DownloadedDBVersion;
		if (DownloadedDBVersion !== ClientDBVersion) {
			window.localStorage.clear(); //clear all localstorage after new per sheet versioning
		}
		getFromGoogleDrive(wearableSource, gearData);
		getFromGoogleDrive(weaponsDataSource, weaponsData);
		getFromGoogleDrive(skillsDataSource, skillsData);
		getFromGoogleDrive(specializationListSource, specializationList);

		Promise.all([
			...Object.values(gearData),
			...Object.values(skillsData),
			...Object.values(weaponsData),
			...Object.values(specializationList),
			VendorPromises,
		])
			.then(() => {
				localStorage.setItem("localDBversion", RemoteDBVersion);
				IsEverythingLoadedPromiseResolve();
			})
			.catch(() => {
				IsEverythingLoadedPromiseReject();
				window.localStorage.clear();
				// location.reload();
			});
	});

const skillsData = {
	Skills: null,
	SkillStats: null,
	SkillMods: null,
};

const skillsDataSource = [
	{
		key: "Skills",
		url: process.env.VUE_APP_DATA_URL_SKILLS,
	},
	{
		key: "SkillStats",
		url: process.env.VUE_APP_DATA_URL_SKILL_STATS,
	},
	{
		key: "SkillMods",
		url: process.env.VUE_APP_DATA_URL_SKILL_MODS,
	},
];

const weaponsData = {
	Weapons: null,
	WeaponAttributes: null,
	WeaponMods: null,
	WeaponTalents: null,
};

const weaponsDataSource = [
	{
		key: "Weapons",
		url: process.env.VUE_APP_DATA_URL_WEAPONS,
	},
	{
		key: "WeaponAttributes",
		url: process.env.VUE_APP_DATA_URL_WEAPON_ATTRIBUTES,
	},
	{
		key: "WeaponMods",
		url: process.env.VUE_APP_DATA_URL_WEAPON_MODS,
	},
	{
		key: "WeaponTalents",
		url: process.env.VUE_APP_DATA_URL_WEAPON_TALENTS,
	},
];

const specializationList = {
	Specialization: null,
};

const specializationListSource = [
	{
		key: "Specialization",
		url: process.env.VUE_APP_DATA_URL_SPECIALIZATION,
	},
];

const gearData = {
	Chest: null,
	Gloves: null,
	Holster: null,
	Kneepads: null,
	Backpack: null,
	Mask: null,
	Attributes: null,
	GearMods: null,
	GearTalents: null,
	BrandSetBonuses: null,
	StatsMapping: null,
	BrandsData: null,
};

const wearableSource = [
	{
		key: "Chest",
		url: process.env.VUE_APP_DATA_URL_CHEST,
	},
	{
		key: "Gloves",
		url: process.env.VUE_APP_DATA_URL_GLOVES,
	},
	{
		key: "Holster",
		url: process.env.VUE_APP_DATA_URL_HOLSTER,
	},
	{
		key: "Kneepads",
		url: process.env.VUE_APP_DATA_URL_KNEEPADS,
	},
	{
		key: "Backpack",
		url: process.env.VUE_APP_DATA_URL_BACKPACK,
	},
	{
		key: "Mask",
		url: process.env.VUE_APP_DATA_URL_MASK,
	},
	{
		key: "Attributes",
		url: process.env.VUE_APP_DATA_URL_GEAR_ATTRIBUTES,
	},
	{
		key: "GearMods",
		url: process.env.VUE_APP_DATA_URL_GEAR_MODS,
	},
	{
		key: "GearTalents",
		url: process.env.VUE_APP_DATA_URL_GEAR_TALENTS,
	},
	{
		key: "BrandSetBonuses",
		url: process.env.VUE_APP_DATA_URL_BRAND_SET_BONUSES,
	},
	{
		key: "StatsMapping",
		url: process.env.VUE_APP_DATA_URL_STATS_MAPPING,
	},
	{
		key: "BrandsData",
		url: process.env.VUE_APP_DATA_URL_BRANDS_DATA,
	},
];

export {
	IsEverythingLoadedPromise,
	gearData,
	skillsData,
	weaponsData,
	specializationList,
	VendorPromises as VendorData,
};
