import {
    Subject,
    BehaviorSubject,
    combineLatest,
    timer
} from 'rxjs';
import {
    debounce
} from "rxjs/operators";

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
}


class CoreService {

    sendSlotInit(name, data) {
        slotsToDecode[name].next(data)
    }

    getSlotInit$(name) {
        return slotsToDecode[name];
    }

    sendSlotData(name, data) {
        return slotsToEncode[name].next(data);
    }

    subscribeSlotData(name) {
        return slotsToEncode[name].asObservable()
            .pipe(debounce(() => timer(300)));
    }

    subscribeAllSlotsData$() {
        return combineLatest(
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
        ).pipe(debounce(() => timer(300)));
    }
}

const coreService = new CoreService();

// Example of usage of CoreService
// coreService.sendSlotData('Mask', 'Test Cyka Blyat Rush B with P90');
// coreService.subscribeAllSlotsData$().subscribe(([
//     Mask,
//     Backpack,
//     Chest,
//     Gloves,
//     Holster,
//     Kneepads,
//     Primary,
//     Secondary,
//     SideArm,
//     Specialization,
// ]) => {

// })

export default coreService;