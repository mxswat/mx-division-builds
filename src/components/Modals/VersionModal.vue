<template>
	<div id="version-modal">
	<span class="section-title" style="position: relative">
    Patch notes and news
  </span>
  <div class="overflow-handler">
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
          <h4 style="margin-bottom: -10px;">Need to remove a weapon, attribute or mod?</h4>
          <ul style="padding-left: 1.5rem; list-style-position: outside;">
            <li>
              No problem! You can now remove slotted items from Weapons and Gear. The individual attributes and mods can also now be removed by selecting the "Blank" option.
            </li>
          </ul>
          <h4 style="margin-bottom: -10px;">Coming soon...</h4>
          <ul style="padding-left: 1.5rem; list-style-position: outside;">
            <li>
              Moved Patch Notes and News information here to make room for Skills and other UI changes.
            </li>
          </ul>
          <p>- - - - - - - - - - - - - - - - - - - -</p>
          <p>March 01, 2023</p>
          <h3>Title Update 17 - Season 11: Reign of Fire</h3>
          <h4 style="margin-bottom: -10px;">Gear</h4>
          <p>
            <ul style="padding-left: 1.5rem; list-style-position: outside;">
              <li>
                <b>Habsburg Guard</b> Brandset added
              </li>
              <li>
                Named Habsburg Guard Chest <b>Cherished</b> added (Perfect	Trauma)
              </li>
              <li>
                Named Habsburg Guard Backpack <b>The Courier</b> added (Perfect Creeping Death)
              </li>
              <li>
                <b>Hotshot</b> Gearset added
              </li>
              <li>
                Exotic Backpack <b>NinjaBike Messenger Bag</b> added <b>3 cores AND	talent working</b>!<br />
                Please report any bugs found with Ninjabike in the
                <a
                href="https://discord.com/channels/702180050791039016/705147074676785262"
                target="_blank"
                >#bug-report</a
                >
                channel or on the
                <a
                href="https://github.com/mxswat/mx-division-builds/issues"
                target="_blank"
                >github issues page</a
                >
              </li>
            </ul>
					</p>
					<h4 style="margin-bottom: -10px;">Weapons</h4>
					<p>
            <ul>
              <li>
                Exotic G28 Marksman Rifle <b>Sacrum Imperium</b> added
							</li>
							<li>
                Named G28	Marksman Rifle <b>Relic</b> added (Perfectly Determined)
							</li>
							<li>
                Named	Magnum Pistol <b>Prophet</b> added (Perfectly Determined)
							</li>
						</ul>
					</p>
					<h4 style="margin-bottom: -10px;">Weapon Talents</h4>
					<p>
            <ul>
              <li>
                Weapon Talent <b>Determined</b> added (Rifle, Marksman	Rifle and pistol only)
							</li>
						</ul>
					</p>
					<h4 style="margin-bottom: -10px;">Updates</h4>
					<p>
            <ul>
              <li>
                <b>Doctor Home</b> talent changed to it's new talent
							</li>
						</ul>
					</p>
					<h4 style="margin-bottom: -10px;">Fixes</h4>
					<p>
            <ul>
              <li>
                Named Magnum <b>Orbit</b> had the wrong damage value, now fixed.
							</li>
						</ul>
					</p>
					<h4 style="margin-bottom: -10px;">Known Issues</h4>
					<p>
            <ul>
              <li>
                The Skill Tier attribute doesn't update correctly
							</li>
						</ul>
					</p>
					<p>reddit - <a href="https://www.reddit.com/r/thedivision/comments/11dgg5g/the_division_2_title_update_17_patch_notes/" target="_blank">The Division 2 - Title Update 17 - Patch Notes</a></p>
					<p>- - - - - - - - - - - - - - - - - - - -</p>
					<p>
            <a href="https://discord.com/channels/702180050791039016/702180285017620483" target="_blank">Go here to see past updates!</a>
					</p>
					<p>- - - - - - - - - - - - - - - - - - - -</p>
        </div>
  </div>
</template>

<script>
	export default {
		data() {
			return {
			};
		},
		created() {
		},
		methods: {
		},
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