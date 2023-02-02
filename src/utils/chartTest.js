// eslint-disable-next-line no-constant-condition
if (true) {
	// Weapon stat: Big Horn
	const RPM = 800;
	const ReloadSpeed = 2100; // in ms
	const magSize = 30;
	const baseDamage = 46071;
	// Calculated
	const roundsPerSecond = RPM / 60; // 13
	const everyXsecondsReload = RPM / magSize; // 26
	const reloadXtimesPerMinute = 60 / everyXsecondsReload; // 2.3
	const DPS = (baseDamage / 60) * RPM;
	const damageTillReload = DPS * everyXsecondsReload; // Total Damage I deal In one reload

	const damage = [];
	const time = [];
	let timeTick = 0;
	for (let i = 1; i < 11; i++) {
		if (i % 2 === 0) {
			damage.push(damageTillReload * i);
			timeTick += everyXsecondsReload;
		} else {
			damage.push(damageTillReload * (i - 1));
			timeTick += i !== 1 ? ReloadSpeed / 10000 : 0;
		}
		time.push(timeTick);
	}

	debugger;
}
