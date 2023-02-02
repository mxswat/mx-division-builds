<template>
	<div class="toolbar">
		<span class="app-title">The Division 2 Builds tool</span>
		<!-- <input
      class="build-name"
      type="text"
      placeholder="Your build Name"
      name="Build Name"
    /> -->
		<div class="spacer"></div>
		<a @click="showMobileMenu = !showMobileMenu" class="menu-btt arrow-down"
			>Menu</a
		>
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
			<button @click="credits()">Credits</button>
		</div>
		<!-- 
      Bugged TODO: Fix me
    <button @click="history.back()">Undo</button>
    <button @click="history.forward()">Redo</button> 
    --></div>
</template>

<script>
	import {
		openSaveShareModal,
		openIssueModal,
		openScreenshotModal,
		openCreditsModal,
	} from "../utils/modalService";

	export default {
		name: "Toolbar",
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
		},
	};
</script>

<style lang="scss" scoped>
	.toolbar {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.spacer {
		flex: 1 1;
	}

	.toolbar-inner button {
		margin-right: 8px;
		color: white;
		border: 1px solid white;
		background: transparent;
		min-height: 32px;
	}

	.app-title {
		margin-left: 8px;
		margin-right: 8px;
		height: 31px;
		line-height: 31px;
	}

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
		font-family: "Titillium Web", sans-serif;
		font-weight: 400;
		min-width: 275px;
	}

	.menu-btt {
		display: none;
		height: 31px;
		line-height: 31px;
		color: white;
		padding-right: 24px;
		background-color: transparent;
		border: 0px;
		background-position: right;
		border-bottom: 1px solid white;
		margin-top: 8px;
		margin-bottom: 4px;
		margin-right: 8px;
		margin-left: 8px;
		width: 100%;
	}

	@media only screen and (max-width: 964px) {
		button {
			margin-top: 8px;
		}
	}

	// mobile switch to menu W/ button
	@media only screen and (max-width: 550px) {
		.menu-btt {
			display: flex;
		}
		.toolbar-inner {
			display: none;
			&.showOnMobile {
				display: flex;
				flex-direction: column;
				width: 100%;
				button {
					margin-right: 0;
					width: 100%;
				}
			}
		}
	}
</style>
