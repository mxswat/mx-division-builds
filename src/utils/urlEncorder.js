import { Subject, BehaviorSubject } from "rxjs";

import coreService from "./coreService";
import statsService from "./statsService";
import router from "../router";

const gearEncoderMap = {
	Mask: 0,
	Backpack: 1,
	Chest: 2,
	Gloves: 3,
	Holster: 4,
	Kneepads: 5,
	Primary: 6,
	Secondary: 7,
	SideArm: 8,
	Specialization: 9,
	Skill1: 10,
	Skill2: 11,
	0: "Mask",
	1: "Backpack",
	2: "Chest",
	3: "Gloves",
	4: "Holster",
	5: "Kneepads",
	6: "Primary",
	7: "Secondary",
	8: "SideArm",
	9: "Specialization",
	10: "Skill1",
	11: "Skill2",
};

import { IsEverythingLoadedPromise } from "./dataImporter";

import {
	compressToEncodedURIComponent,
	decompressFromEncodedURIComponent,
} from "lz-string";

import { getByString } from "./utils";

const objectPropToNumber = function(object, path, separator) {
	return "" + getByString(object, path) + separator;
};

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
			const wearablesIds = wearableToIds([
				Mask,
				Backpack,
				Chest,
				Gloves,
				Holster,
				Kneepads,
			]);
			const weaponsIds = weaponsToIds([Primary, Secondary, SideArm]);
			const specializationIds = specializationToIds(Specialization);
			// console.log('newEncoder', {
			//     wearablesIds: wearablesIds,
			//     weaponsIds: weaponsIds,
			//     specializationIds: specializationIds,
			// });
			const skillsIds = skillsToIds([Skill1, Skill2]);
			const buildData = [
				wearablesIds.join(":"),
				weaponsIds.join(":"),
				specializationIds.join(":"),
				skillsIds.join(":"),
			].join(":");

			statsService.updateStats({
				gear: [Mask, Backpack, Chest, Gloves, Holster, Kneepads],
				weapons: [Primary, Secondary, SideArm],
				specialization: Specialization,
				SHDLevels,
				Skill1,
				Skill2,
			});

			// Lazy fix because of the new versioning an encoding will be triggered but all the values are 0
			if (
				Number(buildData.replaceAll("-", "").replaceAll(":", "")) === 0
			) {
				return;
			}
			const encodedBuild = compressToEncodedURIComponent(buildData);
			const _router = router;
			if (_router.history.current.params.encodedBuild !== encodedBuild) {
				router.push({
					name: "homeId",
					params: {
						encodedBuild: "" + encodedBuild,
					},
				});
			}
		}
	);

function wearableToIds(wearables) {
	let ids = [];
	for (let i = 0; i < wearables.length; i++) {
		const wearable = wearables[i];
		ids[i] = "";
		ids[i] += objectPropToNumber(wearable, "id", "-");
		ids[i] += objectPropToNumber(wearable, "attributeOne.index", "-");
		ids[i] += objectPropToNumber(wearable, "attributeTwo.index", "-");
		ids[i] += objectPropToNumber(wearable, "core.index", "-");
		ids[i] += objectPropToNumber(wearable, "mod.index", "-");
		ids[i] += objectPropToNumber(wearable, "talent.index", "-");
		ids[i] += objectPropToNumber(wearable, "core.StatValue", "-");
		ids[i] += objectPropToNumber(wearable, "attributeOne.StatValue", "-");
		ids[i] += objectPropToNumber(wearable, "attributeTwo.StatValue", "-");
		ids[i] += objectPropToNumber(wearable, "mod.StatValue", "-");
		ids[i] += objectPropToNumber(wearable, "coreTwo.index", "-");
		ids[i] += objectPropToNumber(wearable, "coreThree.index", "-");
		ids[i] += objectPropToNumber(wearable, "coreTwo.StatValue", "-");
		ids[i] += objectPropToNumber(wearable, "coreThree.StatValue", "-");
		ids[i] += objectPropToNumber(wearable, "modTwo.index", "-");
		ids[i] += objectPropToNumber(wearable, "modTwo.StatValueModTwo", "");
	}
	return ids;
}

function weaponsToIds(weapons) {
	let ids = [];
	for (let i = 0; i < weapons.length; i++) {
		const weapon = weapons[i];
		ids[i] = "";
		ids[i] += objectPropToNumber(weapon, "id", "-");
		ids[i] += objectPropToNumber(weapon, "attribute 1.index", "-");
		ids[i] += objectPropToNumber(weapon, "talent.index", "-");
		ids[i] += objectPropToNumber(weapon, "optic.index", "-");
		ids[i] += objectPropToNumber(weapon, "under barrel.index", "-");
		ids[i] += objectPropToNumber(weapon, "magazine.index", "-");
		ids[i] += objectPropToNumber(weapon, "muzzle.index", "-");
		ids[i] += objectPropToNumber(weapon, "attribute 1.StatValue", "-");
		ids[i] += objectPropToNumber(weapon, "core 1.StatValue", "-");
		ids[i] += objectPropToNumber(weapon, "core 2.StatValue", "-");
		ids[i] += objectPropToNumber(weapon, "expertise.StatValue", "");
	}
	return ids;
}

function skillsToIds(skills) {
	let ids = [];
	for (let i = 0; i < skills.length; i++) {
		const skill = skills[i];
		ids[i] = "";
		ids[i] += objectPropToNumber(skill, "skillID", "-");
		ids[i] += objectPropToNumber(skill, "modOne.Skill Stat ID", "-");
		ids[i] += objectPropToNumber(skill, "modTwo.Skill Stat ID", "-");
		ids[i] += objectPropToNumber(skill, "modThree.Skill Stat ID", "-");
		ids[i] += objectPropToNumber(skill, "modOne.StatValueModOne", "-");
		ids[i] += objectPropToNumber(skill, "modTwo.StatValueModTwo", "-");
		ids[i] += objectPropToNumber(skill, "modThree.StatValueModThree", "");
	}
	return ids;
}

function specializationToIds(specialization) {
	const ids = [];
	ids[0] = "";
	ids[0] += objectPropToNumber(specialization, "id", "");
	return ids;
}

const urlDecoder = function(encodedBuild) {
	// Lazy fix, the reference to the text changes if the promise is not resolved in time in production
	const _encodedBuild = encodedBuild;
	IsEverythingLoadedPromise.then(() => {
		console.log("Everything loaded and ready for decode");
		const splitted = decompressFromEncodedURIComponent(_encodedBuild).split(
			":"
		);
		for (let i = 0; i < splitted.length; i++) {
			const slotEncoded = splitted[i];
			// VERY LAZY FIX - TODO: Handle correctly the init of a weapon/gear slot before the data promise is resolved in the component created()
			setTimeout(() => {
				coreService.sendSlotInit(gearEncoderMap[i], slotEncoded);
			}, 100);
		}
	});
};

const decodedSlots = {
	Mask: new Subject(),
	Backpack: new Subject(),
	Chest: new Subject(),
	Gloves: new Subject(),
	Holster: new Subject(),
	Kneepads: new Subject(),
	Primary: new Subject(),
	Secondary: new Subject(),
	SideArm: new Subject(),
	Specialization: new Subject(),
	Skill1: new Subject(),
	Skill2: new Subject(),
};

const updatedInput$ = new Subject();
updatedInput$.subscribe((encodedBuild) => {
	urlDecoder(encodedBuild);
});

export { gearEncoderMap, urlDecoder, updatedInput$ };
