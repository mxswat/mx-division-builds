import { BehaviorSubject, combineLatest, timer } from "rxjs";
import { debounce } from "rxjs/operators";
import StatsService from "./statsService";
import enemyHealthByPlayerScaling from "./enemyHealth";

class DPSChartCoreService {
	_subjects = {
		Primary: new BehaviorSubject(),
		Secondary: new BehaviorSubject(),
		SideArm: new BehaviorSubject(),
	};

	subscribeToCoreWeaponData() {
		return combineLatest([
			this._subjects.Primary,
			this._subjects.Secondary,
			this._subjects.SideArm,
		]).pipe(debounce(() => timer(300)));
	}

	addCoreWeaponData(slot, weaponStats) {
		if (weaponStats.weaponName == null) {
			return;
		}

		const weaponTTKData = [];
		for (let i = 0; i < enemyHealthByPlayerScaling.length; i++) {
			// const playerScaling = enemyHealthByPlayerScaling[i];
			const playerScalingData = enemyHealthByPlayerScaling[i];
			const headers = ["   ", "Normal", "Veteran", "Elite", "Named"];
			const enemyTypes = ["Normal", "Veteran", "Elite", "Named"];
			const rowData = [];
			for (const difficulty in playerScalingData) {
				// Row Name is first in current Row
				const currentRow = [difficulty];
				const currentScaling = playerScalingData[difficulty];
				for (let j = 0; j < enemyTypes.length; j++) {
					// Get the ratio for the current enemytype
					const ratio = currentScaling.Ratio[j];
					// const enemyType = enemyTypes[j];
					const enemyHP = currentScaling.RedHP * ratio;
					const results = this.recursiveTimeToKillBulletToKill(
						weaponStats,
						enemyHP
					);
					currentRow.push(
						`${results.timePassed.toFixed(
							1
						)}s / ${results.shotsFired.toFixed(0)} `
					);
				}
				rowData.push(currentRow);
			}
			weaponTTKData.push({ rowData, headers });
		}
		this._subjects[slot].next({
			weaponName: weaponStats.weaponName,
			tables: weaponTTKData,
		});
	}

	// Reduce enemyHP untill it's 0
	recursiveTimeToKillBulletToKill(
		weaponStats,
		enemyHP,
		shotsFired = 0,
		timePassed = 0,
		reloads = 0
	) {
		if (enemyHP <= weaponStats.dmgToOutOfCoverArmoredPerMag) {
			if (enemyHP == weaponStats.dmgToOutOfCoverArmoredPerMag) {
				// return calculations with out counting bullets to kill and just return mag size
			} else {
				shotsFired += Math.ceil(
					enemyHP / weaponStats.dmgToOutOfCoverArmored
				);
				// -1 because the first shot should always show 0s on the TTK
				timePassed +=
					(shotsFired / (weaponStats.rpm / 60) -
						1 / (weaponStats.rpm / 60)) *
					1000;
				timePassed = timePassed / 1000;
			}
			return {
				shotsFired,
				timePassed,
				reloads,
			};
		} else {
			const remaningHP =
				enemyHP - weaponStats.dmgToOutOfCoverArmoredPerMag;
			shotsFired += weaponStats.totalMagSize;
			timePassed +=
				weaponStats.timeToEmptyMagazine + weaponStats.reloadSpeed;
			return this.recursiveTimeToKillBulletToKill(
				weaponStats,
				remaningHP,
				shotsFired,
				timePassed,
				reloads + 1
			);
		}
	}

	applyCHCandHSDtoTheTables(chc, hsd) {
		["Primary", "Secondary", "SideArm"].forEach((slot) => {
			const weaponStat = StatsService.getWeaponStatsPerSlot(
				slot,
				chc,
				hsd
			);
			if (weaponStat.weaponName) {
				this.addCoreWeaponData(slot, weaponStat);
			}
		});
	}
}

export default new DPSChartCoreService();
