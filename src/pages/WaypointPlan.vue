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
      if (this.picking == false) return;
      var lng = e.latlng.lng, lat = e.latlng.lat;
      this.pick_points.push(new BMapGL.Point(lng, lat));
      this.redraw();
    },
    rightclick_callback: function (e) {
      if (this.picking == false) return;
      this.pick_points.pop();
      this.redraw();
    },
    createMap: function () {
      this.map = new BMapGL.Map("bmap");
      var point = new BMapGL.Point(116.404, 39.915);
      this.map.centerAndZoom(point, 15);
      this.map.enableScrollWheelZoom();
    },
    redraw: function () {
      this.map.clearOverlays();
      if (this.pick_points.length > 1) {
        var polyline = new BMapGL.Polyline(this.pick_points, { strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5 });
        this.map.addOverlay(polyline);
      }
      for (var i = 0; i < this.pick_points.length; i++) {
        var point = this.pick_points[i];
        var marker = new BMapGL.Marker(point);
        this.map.addOverlay(marker);
      }
    },
    end_plan: function () {
      this.picking = false;
      this.clear_plan();
    },
    begin_plan: function () {
      this.end_plan();
      this.picking = true;
    },
    clear_plan: function () {
      this.pick_points = [];
      this.redraw();
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
      this.map.addEventListener('click', this.click_callback);
      this.map.addEventListener('rightclick', this.rightclick_callback);
      this.emitter.on('beginPlan', event => { this.begin_plan(); })
      this.emitter.on('endPlan', event => { this.end_plan(); })
      this.emitter.on('clearPlan', event => { this.clear_plan(); })
      this.emitter.on('BMapSendPlan', event => { this.emitter.emit('Plan', this.cor_convert()); })
    }

  },
  unmounted() {
    this.emitter.emit('BMapLeave');
  }

});
</script>