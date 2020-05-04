import {
    Subject,
    BehaviorSubject
} from 'rxjs';

const behaviorSubjects = {
    // Remember BehaviorSubject has getValue because it saves the last state
    'Primary': new BehaviorSubject(),
    'Secondary': new BehaviorSubject(),
    'SideArm': new BehaviorSubject(),
    'Mask': new BehaviorSubject(),
    'Backpack': new BehaviorSubject(),
    'Chest': new BehaviorSubject(),
    'Gloves': new BehaviorSubject(),
    'Holster': new BehaviorSubject(),
    'Kneepads': new BehaviorSubject(),
}

const getAllGears = function () {
    return {
        Primary: behaviorSubjects.Primary.getValue(),
        Secondary: behaviorSubjects.Secondary.getValue(),
        SideArm: behaviorSubjects.SideArm.getValue(),
        Mask: behaviorSubjects.Mask.getValue(),
        Backpack: behaviorSubjects.Backpack.getValue(),
        Chest: behaviorSubjects.Chest.getValue(),
        Gloves: behaviorSubjects.Gloves.getValue(),
        Holster: behaviorSubjects.Holster.getValue(),
        Kneepads: behaviorSubjects.Kneepads.getValue(),
    }
}

const allGear$ = new Subject();

const GearProvider = {
    updateGear: (slotName, slot) => {
        behaviorSubjects[slotName].next(slot);
        behaviorSubjects.Primary.getValue();
        allGear$.next(getAllGears());
    },
    getAllGear: () => allGear$.asObservable(),
    /**
     * @param {string} gear baseD = Weapon damage 
     */
    subscribeGear: (gear) => behaviorSubjects[gear].asObservable()
};

export {
    GearProvider
};