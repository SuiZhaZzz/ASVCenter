<template>
  <q-page class="flex flex-center bg-grey-10 text-white">
    <div id="bmap" :style="{ width: width + 'px', height: height + 'px' }"></div>
  </q-page>
</template>

<script>
import { defineComponent, createApp } from "vue";
import emitter from '/utils/emitter'

export default defineComponent({
  name: "IndexPage",
  data() {
    return {
      width: window.innerWidth,
      height: window.innerHeight - 100,
      pick_points: [],
      picking: false,
      // picking: true,
      map: null,
      emitter: emitter

    }
  },
  mounted() {
    this.createMap();
    setTimeout(() => {
      emitter.emit('BMapLoad');
    }, 1000);

    this.eventReady();
  },
  methods: {
    click_callback: function (e) {
      var lng = e.latlng.lng, lat = e.latlng.lat;
      if (this.picking == false) return;

      this.pick_points.push(new BMapGL.Point(lng, lat));
      this.map.clearOverlays();
      var polyline = new BMapGL.Polyline(this.pick_points, { strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5 });
      this.map.addOverlay(polyline);
    },
    createMap: function () {
      this.map = new BMapGL.Map("bmap");
      var point = new BMapGL.Point(116.404, 39.915);
      this.map.centerAndZoom(point, 15);
      this.map.addEventListener('click', this.click_callback);
      this.map.addEventListener('rightclick', event => { this.map.clearOverlays(); this.pick_points = []; });
      this.map.enableScrollWheelZoom();
    },
    end_plan: function () {
      this.pickint = false;
      this.pick_points = [];
      this.map.clearOverlays();
    },
    begin_plan: function () {
      this.end_plan();
      this.picking = true;
    },
    cor_convert() {
      var data = []
      for (var i = 0; i < this.pick_points.length; i++) {
        var tmp = this.pick_points[i]
        var bd09togcj02 = coordtransform.bd09togcj02(tmp.lng, tmp.lat);
        var gcj02towgs84 = coordtransform.gcj02towgs84(bd09togcj02[0], bd09togcj02[1]);
        data.push(gcj02towgs84);
      }
      return data;
    },
    eventReady: function () {
      emitter.on('beginPlan', event => { this.begin_plan(); })
      emitter.on('endPlan', event => { this.end_plan(); })
      emitter.on('BMapSendPlan', event => { emitter.emit('Plan', this.cor_convert()); })
    }

  },
  unmounted() {
    emitter.emit('BMapLeave');
  }

});
</script>