<template>
  <q-page class="flex flex-center bg-grey-10 text-white">
    <div>
      <video id="video"></video>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
  data() {
    return {
      url: "http://1.116.246.209:8888/test/index.m3u8"
    }
  },
  mounted() {
    this.createVideo(this.url);
  },
  methods:
  {
    createVideo(url) {
      var video = document.getElementById('video');
      var videoSrc = url;
      if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        video.muted = true;
        video.play();
        console.log("play");
      }

      else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('Hls is not supported')
        video.src = videoSrc;
      }
    }
  }
});
</script>
