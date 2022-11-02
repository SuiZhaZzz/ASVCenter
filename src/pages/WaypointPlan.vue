<template>
  <q-page class="flex flex-center bg-grey-10 text-white">
    <!-- 地图容器 -->
    <div id="map" style="z-index:0"></div>
  </q-page>
</template>

 
<script>
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { defineComponent, createApp } from "vue";
import emitter from '/utils/emitter'

  export default defineComponent({
    name: 'IndexPage',
    data() {
      return {
        map: null,

      }
    },
    mounted() {
      // 地图初始化
      this.initMap()
    },
    methods: {
      // 使用id为map的div容器初始化地图，同时指定地图的中心点和缩放级别
      initMap() {
        let map = L.map("map", {
          center: [24.485666, 118.095498], // 中心位置
          zoom: 12, // 缩放等级
          attributionControl: true, // 版权控件
          zoomControl: true //缩放控件
        });
        this.map = map; // data上需要挂载
        L.tileLayer(
          //"http://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}"
        //"http://rt0.map.gtimg.com/realtimerender?z={z}&x={x}&y={-y}&type=vector&style=0"
        "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}"
        ).addTo(this.map) // 加载底图
      }
    }
  });
</script>
<style scoped>
  #map {
    width: 2000px;
    height: 800px;
    margin: 50px auto;
  }
</style>