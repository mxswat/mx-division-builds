<template>
	<div class="toolbar">
		<span class="app-title">The Division 2 Builds Tool</span>
		<!-- <input
			class="build-name"
			type="text"
			placeholder="Your build Name"
			name="Build Name"
		/> -->
		<MenuButton class="menu-btt" v-model="showMobileMenu" :sync="true" label="Menu"/>
		<div class="toolbar-inner" :class="{ showOnMobile: showMobileMenu }">
			<button @click="saveAndShare()">Save & Share</button>
			<button @click="screenshot()" id="screenshotBTT">
				Save Screenshot
			</button>
			<button @click="clear()">Clear</button>
			<button @click="newBuild()">New Build</button>
			<button style="color: #f7d07c" @click="issues()">
				Issues or bug?
			</button>
			<button @click="version()">Patch Notes</button>
			<button @click="credits()">Credits</button>
		</div>
		<!-- 
		Bugged TODO: Fix me
		<button @click="history.back()">Undo</button>
		<button @click="history.forward()">Redo</button> 
		-->
	</div>
</template>

<script>
	import {
		openSaveShareModal,
		openIssueModal,
		openScreenshotModal,
		openVersionModal,
		openCreditsModal,
	} from "../utils/modalService";
	import MenuButton from "./MenuButton.vue";

	export default {
		name: "ToolBar",
		components: { MenuButton },
		data() {
			return {
				history,
				showMobileMenu: false,
			};
		},
		created() {
			this.history = window.history;
		},
		methods: {
			saveAndShare() {
				openSaveShareModal();
			},
			clear() {
				// TODO: Yeah this should be changed
				this.$router.push({
					name: "home",
				});
				location.reload();
			},
			newBuild() {
				const routeData = this.$router.resolve({ name: "home" });
				window.open(routeData.href, "_blank");
			},
			issues() {
				openIssueModal();
			},
			screenshot() {
				openScreenshotModal();
			},
			credits() {
				openCreditsModal();
			},
			version() {
				openVersionModal();
			},
		},
	};
</script>

<style lang="scss" scoped>
	.toolbar {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 8px;
		padding: 8px;

		.app-title {
			margin-left: 8px;
			margin-right: 8px;
			font-size: x-large;
		}

		// don't show the menu button normally
		.menu-btt {
			display: none;
		}
		.toolbar-inner {
			display: flex;
			flex-direction: row;
			gap: 8px;

			button {
				color: white;
				border: 1px solid white;
				background: transparent;
				min-height: 32px;
			}
		}

		// mobile switch to menu W/ button
		@media only screen and (max-width: 650px) {
			.menu-btt {
				display: flex;
				flex-direction: column;
				width: 100%;
			}
			.toolbar-inner {
				display: none;
				&.showOnMobile {
					display: flex;
					flex-direction: column;
					width: 100%;
				}
			}
		}		
	}

	/*
	.build-name {
		$height: 31px;
		height: $height;
		line-height: $height;
		padding: 0px;
		margin-left: 8px;
		// background: rgba(0, 0, 0, 0.3);
		background: transparent;
		border: 0px;
		border-bottom: 1px solid white;
		font-size: 16px;
		color: white;
		font-weight: 400;
		min-width: 275px;
	}
	*/
</style>
