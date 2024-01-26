<template>
	<div class="weapon-stats-container">
		<BasicTile classes="primary no-anim">
			<SingleWeaponStats name="Primary"></SingleWeaponStats>
		</BasicTile>
		<BasicTile classes="secondary no-anim">
			<SingleWeaponStats name="Secondary"></SingleWeaponStats>
		</BasicTile>
		<BasicTile classes="sidearm no-anim">
			<SingleWeaponStats name="SideArm"></SingleWeaponStats>
		</BasicTile>
	</div>
</template>

<script>
	import SingleWeaponStats from "./SingleWeaponStats.vue";
	import BasicTile from "../BasicTile.vue";

	export default {
		name: "WeaponStats",
		components: {
			SingleWeaponStats,
			BasicTile,
		},
		created() {},
	};
</script>

<style lang="scss" scoped>
	.weapon-stats-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		grid-template-rows: repeat(1, [row] auto);
		gap: 8px;
	}

	.primary,
	.secondary,
	.sidearm {
		background: rgba(0, 0, 0, 0.25);
	}
</style>
