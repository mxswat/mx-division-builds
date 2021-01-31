import Plotly from 'plotly.js-dist'
import {
    Subject,
    BehaviorSubject,
    combineLatest,
    timer
} from 'rxjs';
import {
    debounce
} from "rxjs/operators";

class DPSChartCoreService {

    _subjects = {
        Primary: new BehaviorSubject(),
        Secondary: new BehaviorSubject(),
        SideArm: new BehaviorSubject(),
    }

    saveCurrentStatsForComparison() { }

    addWeaponTrace(traceName, damagePerMagazine, rpm, magsize, reloadSpeed, slot) {
        let timeToEmptyMagazine = (magsize / (rpm / 60)) * 1000;
        const dataPointsCount = Math.round(60000 / (timeToEmptyMagazine + reloadSpeed));
        const dataPoints = new Array(dataPointsCount + 1);
        let isReloadingTime = false
        let damageDelta = 0
        let timeDelta = 0
        const timeAxis = new Array(dataPointsCount + 1);
        const damageAxis = new Array(dataPointsCount + 1);
        timeAxis[0] = 0;
        damageAxis[0] = 0;
        for (let i = 1; i < dataPoints.length; i++) {
            let damage = !isReloadingTime ? Number(damagePerMagazine) + damageDelta : damageDelta;
            let time = isReloadingTime ? timeDelta + reloadSpeed : timeDelta + timeToEmptyMagazine;
            timeAxis[i] = time / 1000;
            damageAxis[i] = this.roundValue(damage);
            timeDelta = time;
            damageDelta = damage;
            isReloadingTime = !isReloadingTime;
        }

        this._subjects[slot].next({
            name: traceName,
            x: timeAxis,
            y: damageAxis
        })

        const TESTER = document.getElementById('chart-test');

        Plotly.addTraces(TESTER, [
            {
                name: traceName,
                x: timeAxis,
                y: damageAxis
            }
        ]
        );
    }

    // I know I know it's duplicated code
    // I will make it common soon(TM)
    roundValue(number) {
        return Number(Number(number).toFixed(2));
    }

    subscribeToCombinedWeaponUpdates() {
        return combineLatest([
            this._subjects.Primary,
            this._subjects.Secondary,
            this._subjects.SideArm
        ]).pipe(debounce(() => timer(300)));
    }
}

const DPSChartCoreServiceInst = new DPSChartCoreService();

export default DPSChartCoreServiceInst;