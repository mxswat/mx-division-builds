/* eslint-disable no-undef */
<template>
  <div id="screenshot-modal">
    <img id="screenshot" src="" alt="" />

    <div class="controls" v-if="screenshotLoaded">
      <button @click="downloadImage()">Download</button>
      <button @click="saveToClipBoard()">Copy to clipboard</button>
    </div>
    <p>
      PRO Tip: if you copy to clipboard you can paste directly in Discord or
      Reddit
    </p>
    <p>
      Notes: Copy to clipboard does not work on firefox
    </p>
    <div class="loading" v-if="!screenshotLoaded">
      <span class="loader"></span>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";

export default {
  data() {
    return {
      canvas: null,
      screenshotLoaded: false,
    };
  },
  created() {
    this.screenshotLoaded = false;
    const target = document.querySelector("#inventory-gui");
    html2canvas(target, {
      backgroundColor: "#232830",
    }).then((canvas) => {
      this.canvas = canvas;
      document.getElementById("screenshot").src = canvas.toDataURL();
      this.screenshotLoaded = true;
    });
  },
  methods: {
    saveToClipBoard() {
      try {
        // eslint-disable-next-line no-undef
        if (ClipboardItem) {
          this.canvas.toBlob(function (blob) {
            // eslint-disable-next-line no-undef
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write(item);
          });
        }
      } catch (error) {
        // Damn firefox
        alert(
          'Looks like your browser does not support "the copy to clipboard" right click the image and press copy to copy it.'
        );
      }
    },
    downloadImage() {
      const image = this.canvas.toDataURL("image/jpg");
      const link = document.createElement("a");
      link.download = "my-build.jpg";
      link.href = image;
      document.body.append(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>


<style lang="scss" scoped>
div#screenshot-modal {
  display: flex;
  overflow: auto;
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
}

img#screenshot {
  object-fit: contain;
  max-height: 90%;
  width: 100%;
}

button {
  margin-left: 8px;
  color: white;
  border: 1px solid white;
  background: transparent;
  font-size: 21px;
}

.controls {
  margin-top: 20px;
}
</style>