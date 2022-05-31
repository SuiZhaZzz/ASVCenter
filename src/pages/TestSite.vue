<template>
  <q-page>
    <iframe
      :src="source"
      frameborder="0"
      allowfullscreen
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
    ></iframe>
  </q-page>
</template>

<style></style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TestSite",
  data() {
    return {
      source: "http://www.bing.com/",
    };
  },
});
</script>
