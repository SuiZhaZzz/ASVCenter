<template>
  <q-page>
    <div>
      <video id="video"></video>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import { defineComponent } from "vue";



export default defineComponent({
  name: "TestSite",
  mounted() {
    this.createVideo();
  },
  methods:
  {
    createVideo() {
      var video = document.getElementById('video');
      var videoSrc = 'http://1.116.246.209:8888/test/index.m3u8';
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
