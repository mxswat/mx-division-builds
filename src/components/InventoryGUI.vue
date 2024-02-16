<template>
	<div class="inventory-gui" id="inventory-gui">
		<BasicTile classes="specialization">
			<SpecializationSlot></SpecializationSlot>
		</BasicTile>
		<BasicTile classes="primary" bgImage="./icons/main-weapon.png">
			<WeaponSlot name="Primary"></WeaponSlot>
		</BasicTile>
		<BasicTile classes="secondary" bgImage="./icons/main-weapon.png">
			<WeaponSlot name="Secondary"></WeaponSlot>
		</BasicTile>
		<BasicTile classes="pistol" bgImage="./icons/sidearm.png">
			<WeaponSlot name="SideArm" slotFilter="S"></WeaponSlot>
		</BasicTile>
		<BasicTile classes="mask" bgImage="./icons/mask.png">
			<GearSlot name="Mask"></GearSlot>
		</BasicTile>
		<BasicTile classes="backpack" bgImage="./icons/backpack.png">
			<GearSlot name="Backpack"></GearSlot>
		</BasicTile>
		<BasicTile classes="chest" bgImage="./icons/chest.png">
			<GearSlot name="Chest"></GearSlot>
		</BasicTile>
		<BasicTile classes="gloves" bgImage="./icons/gloves.png">
			<GearSlot name="Gloves"></GearSlot>
		</BasicTile>
		<BasicTile classes="holster" bgImage="./icons/holster.png">
			<GearSlot name="Holster"></GearSlot>
		</BasicTile>
		<BasicTile classes="kneepads" bgImage="./icons/kneepads.png">
			<GearSlot name="Kneepads"></GearSlot>
		</BasicTile>
		<BasicTile classes="skills">
			<SkillSlot name="Skill1"></SkillSlot>
		</BasicTile>
		<BasicTile classes="skills">
			<SkillSlot name="Skill2"></SkillSlot>
		</BasicTile>
		<BasicTile classes="watch" bgImage="./icons/shd_med.png">
			<WatchSlot name="Watch"></WatchSlot>
		</BasicTile>
	</div>
</template>

<script>
	import BasicTile from "./BasicTile.vue";
	import GearSlot from "./GearSlot.vue";
	import SkillSlot from "./SkillSlot.vue";
	import WeaponSlot from "./WeaponSlot.vue";
	import WatchSlot from "./WatchSlot.vue";
	import { updatedInput$ } from "../utils/urlEncoder";
	import SpecializationSlot from "./SpecializationSlot.vue";

	export default {
		name: "InventoryGUI",
		props: {
			encodedBuild: null,
		},
		components: {
			BasicTile,
			GearSlot,
			SkillSlot,
			WeaponSlot,
			WatchSlot,
			SpecializationSlot,
		},
		data() {
			return {};
		},
		created() {
			if (this.encodedBuild) {
				updatedInput$.next(this.encodedBuild);
			}
			window.addEventListener("popstate", (event) => {
				updatedInput$.next(this.$route.params.encodedBuild);
			});
		},
		methods: {},
	};
</script>

<style lang="scss" scoped>
	// https://carterbancroft.com/sass-and-webpack/ thanks <3
	@use "sass:math";
	@import "../style/_include-media.scss";

	.inventory-gui {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 8px 8px;
		grid-auto-rows: min-content;
		height: min-content;
	}
</style>
