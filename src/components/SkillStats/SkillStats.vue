<template>
	<div class="skill-stats-container">
		<BasicTile classes="skill1 no-anim">
			<SingleSkillStats name="Skill 1"></SingleSkillStats>
		</BasicTile>
		<BasicTile classes="skill2 no-anim">
			<SingleSkillStats name="Skill 2"></SingleSkillStats>
		</BasicTile>
	</div>
</template>

<script>
	import SingleSkillStats from "./SingleSkillStats";
	import BasicTile from "../BasicTile";

	export default {
		name: "SkillStats",
		components: {
			SingleSkillStats,
			BasicTile,
		},
		created() {},
	};
</script>

<style lang="scss" scoped>
	.skill-stats-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		grid-template-rows: repeat(1, [row] auto);
		gap: 8px;
	}

	.skill1,
	.skill2 {
		background: rgba(0, 0, 0, 0.25);
	}
</style>
