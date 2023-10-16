<template>
	<div id="version-modal">
		<span class="section-title" style="position: relative">
			Patch notes and news
		</span>
		<div class="overflow-handler">
			<p>- - - - - - - - - - - - - - - - - - - -</p>
			<p>October 16, 2023</p>
			<h3>Skill Slots added to the builder</h3>
			<h4 style="margin-bottom: -10px;">
				You got Skills!
			</h4>
			<ul style="padding-left: 1.5rem; list-style-position: outside;">
				<li>
					The Mx Builder has just been updated to include the Skill slots!
				</li>
				<li>
					You can now select your two skill by clicking on the slots next to the
					watch, just like you would with any other weapon or gear piece.
				</li>
				<li>
					Skills show their descriptions and base stats in the skill selector,
					and their related mods can be selected like weapon mods.
				</li>
				<li>
					No stat calculations are made for the skills at the moment, this is a
					long term goal we want to reach but need more time to make it work
					properly.
				</li>
			</ul>
			<p>- - - - - - - - - - - - - - - - - - - -</p>
			<p>October 10, 2023</p>
			<h3>Title Update 19 - Y5S2: Puppeteer</h3>
			<h4 style="margin-bottom: -10px;">
				Weapons:
			</h4>
			<ul style="padding-left: 1.5rem; list-style-position: outside;">
				<li>
					Iron Lungs exotic LMG added
				</li>
				<li>
					Ouroboros exotic SMG added
				</li>
				<li>
					Born Great named G36 (perfect stabilize) added
				</li>
				<li>
					Grown Great named Thompson (perfect stabilize) added
				</li>
			</ul>
			<h4 style="margin-bottom: -10px;">
				Gear:
			</h4>
			<ul style="padding-left: 1.5rem; list-style-position: outside;">
				<li>
					Lengmo brandset added
				</li>
				<li>
					Carpenter named Lengmo chest (perfectly mad bomber) added
				</li>
				<li>
					Backbone named Lengmo backpack (perfectly unstoppable force) added
				</li>
				<li>
					Ortiz: Exuro gearset added
				</li>
				<li>
					Collector exotic chest added
				</li>
				<li>
					Tip of the Spear gearset updated
				</li>
			</ul>
			<h4 style="margin-bottom: -10px;">
				Weapon Talents:
			</h4>
			<ul style="padding-left: 1.5rem; list-style-position: outside;">
				<li>
					Stabilize weapon talent added
				</li>
			</ul>
			<p>- - - - - - - - - - - - - - - - - - - -</p>
			<p>May 11, 2023</p>
			<h3>More UI Updates</h3>
			<h4 style="margin-bottom: -10px;">Making room for Skills!</h4>
			<ul style="padding-left: 1.5rem; list-style-position: outside;">
				<li>
					Moved Watch Levels to a tile on the inventory GUI.
				</li>
			</ul>
			<p>- - - - - - - - - - - - - - - - - - - -</p>
			<p>March 19, 2023</p>
			<h3>UI Updates</h3>
			<h4 style="margin-bottom: -10px;">
				Need to remove a weapon, attribute or mod?
			</h4>
			<ul style="padding-left: 1.5rem; list-style-position: outside;">
				<li>
					No problem! You can now remove slotted items from Weapons and Gear.
					The individual attributes and mods can also now be removed by
					selecting the "Blank" option.
				</li>
			</ul>
			<h4 style="margin-bottom: -10px;">Coming soon...</h4>
			<ul style="padding-left: 1.5rem; list-style-position: outside;">
				<li>
					Moved Patch Notes and News information here to make room for Skills
					and other UI changes.
				</li>
			</ul>
			<p>- - - - - - - - - - - - - - - - - - - -</p>
			<p>
				reddit -
				<a
					href="https://www.reddit.com/r/thedivision/comments/11dgg5g/the_division_2_title_update_17_patch_notes/"
					target="_blank"
					>The Division 2 - Title Update 17 - Patch Notes</a
				>
			</p>
			<p>- - - - - - - - - - - - - - - - - - - -</p>
			<p>
				<a
					href="https://discord.com/channels/702180050791039016/702180285017620483"
					target="_blank"
					>Go here to see past updates!</a
				>
			</p>
			<p>- - - - - - - - - - - - - - - - - - - -</p>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {};
		},
		created() {},
		methods: {},
	};
</script>

<style lang="scss" scoped>
	div#version-modal {
		margin: 20px;
		overflow: auto;
		height: 100%;
		width: 100%;
	}
</style>
