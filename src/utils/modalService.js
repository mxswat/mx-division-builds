import GearSelectionModal from "../components/Modals/GearSelectionModal";
import SkillsSelectionModal from "../components/Modals/SkillsSelectionModal";
import WeaponSelectionModal from "../components/Modals/WeaponSelectionModal";
import WatchLevelsModal from "../components/Modals/WatchLevelsModal";
import { cleanLocalSHDLevels } from "../utils/SHDutils";
import ScreenshotModal from "../components/Modals/ScreenshotModal";
import VersionModal from "../components/Modals/VersionModal";

import { gearHeaders, weaponsHeaders } from "./agGridDefaults";

function noScroll(params) {
  document.body.classList.add("no-scroll");
}

function yesScroll(params) {
  document.body.classList.remove("no-scroll");
}

const defaultEvents = {
  "before-open": noScroll,
  "before-close": yesScroll,
};

const openGearModal = function(gearList, slot, onModalClose) {
  window.vueInstance.$modal.show(
    GearSelectionModal,
    {
      gearData: gearList,
      onModalClose: onModalClose,
      gearSlot: slot,
    },
    {
      adaptive: true,
      width: "75%",
      height: "90%",
    },
    defaultEvents
  );
};

const openSkillsModal = function(skillsList, slot, onModalClose) {
  window.vueInstance.$modal.show(
    SkillsSelectionModal,
    {
      skillsData: skillsList,
      onModalClose: onModalClose,
      skillSlot: slot,
    },
    {
      adaptive: true,
      width: "75%",
      height: "90%",
    },
    defaultEvents
  );
};

const openWeaponsModal = function(weaponLists, onModalClose) {
  window.vueInstance.$modal.show(
    WeaponSelectionModal,
    {
      gearData: weaponLists,
      onModalClose: onModalClose,
      tableHeaders: weaponsHeaders,
    },
    {
      adaptive: true,
      width: "75%",
      height: "90%",
    },
    defaultEvents
  );
};

const openWatchLevelsModal = function(onModalClose) {
  window.vueInstance.$modal.show(
    WatchLevelsModal,
    {
      onModalClose: onModalClose,
    },
    {
      adaptive: true,
      width: "80%",
      height: "468px",
      maxWidth: 600,
      maxHeight: 468,
    },
    defaultEvents
  );
};

const openVersionModal = function openVersionModal() {
  window.vueInstance.$modal.show(
    VersionModal,
    null,
    {
      adaptive: true,
      width: "75%",
      height: "80%",
    },
    defaultEvents
  );
};

const openSaveShareModal = function() {
  const bookmarkIt =
    "You can add this build to your bookmarks by pressing " +
    (navigator.userAgent.toLowerCase().indexOf("mac") != -1
      ? "Command/Cmd"
      : "CTRL") +
    " + D on your keyboard.";
  window.vueInstance.$modal.show("dialog", {
    title: "Save & share",
    text: `Hi, to save your build just bookmark it </br>
        ${bookmarkIt} </br>
        To share the build just send the URL of the page or click the copy button
        `,
    buttons: [
      {
        title: "Copy",
        handler: () => {
          const el = document.createElement("textarea");
          el.value = document.location.href;
          el.setAttribute("readonly", "");
          el.style.position = "absolute";
          el.style.left = "-9999px";
          document.body.appendChild(el);
          el.select();
          document.execCommand("copy");
          document.body.removeChild(el);
          document.getElementsByClassName("vue-dialog-button")[0].innerText =
            "Copied!";
        },
      },
      {
        title: "Close",
      },
    ],
  });
};

const openIssueModal = function() {
  window.vueInstance.$modal.show("dialog", {
    title: "Have you tried turning it off and on again? - Most of IT guys",
    text: `Are you having issues on the site? </br>
            Press the clean button and wait for the refresh, if you still have problems please report this issue at 
            <a target="_blank" style="color:" href="http://discord.gg/ShYner2">my discord server</a> 
            or <a target="_blank" style="color:" href="https://github.com/mxswat/mx-division-builds/issues">GitHub</a>`,
    buttons: [
      {
        title: "Clean local DB",
        handler: () => {
          cleanLocalSHDLevels();
          // window.localStorage.clear();
          location.reload();
        },
      },
      {
        title: "Close",
      },
    ],
  });
};

const openScreenshotModal = function() {
  window.vueInstance.$modal.show(
    ScreenshotModal,
    {},
    {
      adaptive: true,
      width: "75%",
      height: "90%",
    }
  );
};

const openSafariIOSModal = function() {
  window.vueInstance.$modal.show("dialog", {
    title: "iOS and Safari",
    text: `Hi, I see you are using iOS and / or Safari, if you have issues with the tool please use Chrome. </br>
            I don't have an iPhone so I can't debug and solve Safari related issuses.
            I hope you understand <br> 
            If you still have problems there might be some problem related to you OS version or something else please report this issue at 
            <a target="_blank" style="color:" href="http://discord.gg/ShYner2">my discord server</a> `,
    buttons: [
      {
        title: "I don't have issues",
        handler: () => {
          localStorage.setItem("iOS-Safari-OK", "ok");
          location.reload();
        },
      },
      {
        title: "I understand and I will use chrome",
      },
    ],
    defaultEvents,
  });
};

const openCreditsModal = function openCreditsModal() {
  window.vueInstance.$modal.show("dialog", {
    title: "Credits",
    text: `
            <p> mxswat </p>
            <p> GyroTwister </p>
            <p> Kiochy </p>
            <p> FROST </p>
            <p> RedKnightAMW </p>
            <p> TheSoldier </p>
            <p> BANNED. </p>
            <p> "The Division 2 - Gear Attribute Sheet" Team </p>
            <p> saagri (NPCs HP values) </p>
            <p> Vikeman45 (NPCs HP values) </p>
            <p> <a href="http://rubenalamina.mx/the-division-weekly-vendor-reset/">Ruben Alamina - THE DIVISION 2: WEEKLY VENDOR RESET</a> </p>
        `,
    buttons: [
      {
        title: "Close",
      },
    ],
    defaultEvents,
  });
};

export {
  openGearModal,
  openSkillsModal,
  openWeaponsModal,
  openWatchLevelsModal,
  openSaveShareModal,
  openIssueModal,
  openScreenshotModal,
  openSafariIOSModal,
  openCreditsModal,
  openVersionModal,
};
