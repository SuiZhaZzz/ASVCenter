<template>
  <q-page class="flex flex-center bg-grey-10 text-white">
    <!-- <h1>航点规划</h1> -->
    <iframe src="https://map.tianditu.gov.cn/" frameborder="0" scrolling="no" id="imap"></iframe>
  </q-page>

</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
  mounted() {
    function changemapIframe() {
      const imap = document.getElementById('imap');
      const deviceWidth = document.body.clientWidth;
      const deviceHeight = document.body.clientHeight;
      // imap.style.width = (Number(deviceWidth) - 120) + 'px'; //数字是页面布局宽度差值
      // imap.style.height = (Number(deviceHeight) - 64) + 'px'; //数字是页面布局高度差
      imap.style.width = (Number(deviceWidth)) + 'px'; //数字是页面布局宽度差值
      imap.style.height = (Number(deviceHeight)) + 'px'; //数字是页面布局高度差
    }

    changemapIframe()

    window.onresize = function () {
      changemapIframe()
    }
  }
});
</script>
