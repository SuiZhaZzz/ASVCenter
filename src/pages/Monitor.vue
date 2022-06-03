<template>
  <q-page class="flex flex-center bg-grey-10 text-white">
    <div class="row full-width wrap">
      <!-- <div class="col-6 column items-center"> -->

      <video id="v1" style="width: 50%"></video>
      <video id="v2" style="width: 50%"></video>
      <!-- </div> -->
      <!-- <div class="col-6 column items-center"> -->
      <video id="v3" style="width: 50%"></video>
      <video id="v4" style="width: 50%"></video>
      <!-- </div> -->
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
  data() {
    return {
      url1: "http://1.116.246.209:8888/test/index.m3u8",
      url2: "http://1.116.246.209:8888/test/index.m3u8",
      url3: "http://1.116.246.209:8888/test/index.m3u8",
      url4: "http://1.116.246.209:8888/test/index.m3u8",
    }
  },
  mounted() {
    this.createVideo(this.url1, "v1");
    this.createVideo(this.url2, "v2");
    this.createVideo(this.url3, "v3");
    this.createVideo(this.url4, "v4");
  },
  methods:
  {
    createVideo(url, id) {
      var video = document.getElementById(id);
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
