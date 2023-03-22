import { Subject, BehaviorSubject, combineLatest, timer } from "rxjs";
import { debounce } from "rxjs/operators";

const slotsToEncode = {
	Mask: new BehaviorSubject(),
	Backpack: new BehaviorSubject(),
	Chest: new BehaviorSubject(),
	Gloves: new BehaviorSubject(),
	Holster: new BehaviorSubject(),
	Kneepads: new BehaviorSubject(),
	Primary: new BehaviorSubject(),
	Secondary: new BehaviorSubject(),
	SideArm: new BehaviorSubject(),
	Specialization: new BehaviorSubject(),
	Skill1: new BehaviorSubject(),
	Skill2: new BehaviorSubject(),
};

const slotsToDecode = {
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

const SHDLevels$ = new Subject();

class CoreService {
	sendSlotInit(name, data) {
		slotsToDecode[name].next(data);
	}

	getSlotInit$(name) {
		return slotsToDecode[name];
	}

	sendSlotData(name, data) {
		return slotsToEncode[name].next(data);
	}

	updateSHDLevels(SHDLevels) {
		return SHDLevels$.next(SHDLevels);
	}

	subscribeSlotData(name) {
		return slotsToEncode[name]
			.asObservable()
			.pipe(debounce(() => timer(300)));
	}

	subscribeAllSlotsData$() {
		return combineLatest([
			slotsToEncode.Mask.asObservable(),
			slotsToEncode.Backpack.asObservable(),
			slotsToEncode.Chest.asObservable(),
			slotsToEncode.Gloves.asObservable(),
			slotsToEncode.Holster.asObservable(),
			slotsToEncode.Kneepads.asObservable(),
			slotsToEncode.Primary.asObservable(),
			slotsToEncode.Secondary.asObservable(),
			slotsToEncode.SideArm.asObservable(),
			slotsToEncode.Specialization.asObservable(),
			SHDLevels$.asObservable(),
			slotsToEncode.Skill1.asObservable(),
			slotsToEncode.Skill2.asObservable(),
		]).pipe(debounce(() => timer(300)));
	}
}

const coreService = new CoreService();

export default coreService;
