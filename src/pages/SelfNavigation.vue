<template>
  <q-page class="flex flex-center bg-grey-10 text-white">
    <!-- <h1>自主导航</h1> -->
    <div id="cesiumContainer" :style="{ width: width + 'px', height: height + 'px' }">
    </div>

    <q-page-sticky position="top" :offset="[0, 160]" style="z-index:10">
      <q-btn rounded outline label="跟随船只" @click="setFollowShip" />
      <q-btn rounded outline label="驾驶舱视角" @click="setFPViewer" />
      <q-btn rounded outline label="显示轨迹" @click="shiftPathShow" />
      <q-btn rounded outline label="清除历史轨迹" @click="clearPath" />
    </q-page-sticky>

  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
  data() {
    return {
      width: window.innerWidth,
      height: window.innerHeight - 100,

      client: null,

      viewer: null,
      ship: null,
      last_lon: 105,
      last_lat: 28,
      now_lon: 105.5637908,
      now_lat: 28.9093442,
      h: 180,
      ori_z: 0,

      // viewer
      follow_ship: true,
      fp_view: false,

      // track path
      shape: null,
      path: [],
      show_path: true,
    }
  },
  mounted() {
    this.connectMqtt();

    Cesium.Ion.defaultAccesstoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYmUzMTZjZi03ZDVmLTQxYTItYTI0NC05ODZmMTk5OWFmNTkiLCJpZCI6MzU0MDgsImlhdCI6MTYwMTk2OTc4MH0.m2Euaq9VOqnsid8zEa6OsmdCfZ309BzbfZ4ocAJvHZ0';
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain()
    });

    const demoship_url = "/demoship.gltf";
    var viewer = this.viewer;

    // create demoship
    this.ship = this.createEntityConst(105.5637908, 28.9093442, 180, demoship_url);
    // change ship position and track
    viewer.trackedEntity = this.ship;

    // create path shape
    this.shape = viewer.entities.add({
      polyline: {
        // material: Cesium.Color.RED,
        material: new Cesium.PolylineOutlineMaterialProperty({
          color: Cesium.Color.YELLOW,
        }),
        // clampToGround: true,
        width: 3,
        // arcType: Cesium.ArcType.NONE,
        clampToGround: true,
        // material: new Cesium.PolylineArrowMaterialProperty(
        //   Cesium.Color.PURPLE
        // ),
      }
    });
  },
  methods:
  {
    // connect mqtt server and updat lon, lat
    connectMqtt() {
      let that = this;
      let client = this.client;

      const options = {
        // Clean session
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 4000,
      };

      try {
        client = mqtt.connect(mqtt_server_url, options);
      } catch (error) {
        console.log("mqtt.connect error", error);
      }

      client.on("connect", function () {
        console.log("Connected");
        // client.subscribe("presence");
        // client.subscribe(that.topic);
        client.subscribe("usv/sensor_state");
      });

      client.on("message", function (topic, message) {
        // message is Buffer
        let o = JSON.parse(message);
        that.last_lon = that.now_lon;
        that.last_lat = that.now_lat;
        that.now_lon = o.position[1];
        that.now_lat = o.position[0];
        that.path.push(that.now_lon, that.now_lat);
        that.shape.polyline.positions = Cesium.Cartesian3.fromDegreesArray(that.path);
        that.shipSpin();

        // console.log(that.now_lon + " " + that.now_lat);
      });
    },

    createEntityConst: function (lon, lat, h, url) {
      var viewer = this.viewer;
      var pos = Cesium.Cartesian3.fromDegrees(lon, lat, h);
      // var hpRoll = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(90), 0, 0);
      // var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpRoll);
      var ent = viewer.entities.add({
        name: url,
        position: pos,
        model: {
          uri: url,
          minimumPixelSize: 1,
          maximumScale: 2,
          // scale: 0.15
        },
      });
      return ent;
    },

    changeEntityPos: function (ent, lon, lat, h, ori_z) {
      var pos = Cesium.Cartesian3.fromDegrees(lon, lat, h);
      var heading = Cesium.Math.toRadians(ori_z);
      ent.position = pos;
      var hpr = new Cesium.HeadingPitchRoll(heading, 0, 0);
      ent.orientation = Cesium.Transforms.headingPitchRollQuaternion(pos, hpr);
    },

    /**
     * 计算a点和b点的角度（偏行角: 顺时针）
     * @param position_a a点
     * @param position_b b点
     * @returns 角度
     */
    calAngle: function (position_a, position_b) {
      //以a点为原点建立局部坐标系（东方向为x轴,北方向为y轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
      var localToWorld_Matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position_a);
      //求世界坐标到局部坐标的变换矩阵
      var worldToLocal_Matrix = Cesium.Matrix4.inverse(localToWorld_Matrix, new Cesium.Matrix4());
      //a点在局部坐标的位置，其实就是局部坐标原点
      var localPosition_A = Cesium.Matrix4.multiplyByPoint(worldToLocal_Matrix, position_a, new Cesium.Cartesian3());
      //B点在以A点为原点的局部的坐标位置
      var localPosition_B = Cesium.Matrix4.multiplyByPoint(worldToLocal_Matrix, position_b, new Cesium.Cartesian3());
      //弧度
      var angle = Math.atan2((localPosition_B.y - localPosition_A.y), (localPosition_B.x - localPosition_A.x))
      //角度
      var theta = - angle * (180 / Math.PI) + 90;
      if (theta > 180) {
        theta -= 360;
      }
      return theta;
    },

    shipSpin: function () {
      var last_lon = this.last_lon;
      var last_lat = this.last_lat;
      var now_lon = this.now_lon;
      var now_lat = this.now_lat;
      var h = this.h;

      var last_position = Cesium.Cartesian3.fromDegrees(last_lon, last_lat);
      var now_position = Cesium.Cartesian3.fromDegrees(now_lon, now_lat);

      var heading = 0;
      if (last_lon == now_lon && last_lat == now_lat) heading = 0;
      else heading = this.calAngle(last_position, now_position);

      this.ori_z = heading;

      this.changeEntityPos(this.ship, now_lon, now_lat, h, heading);
      this.firstPersonView(this.fp_view);
    },

    camera_above_ship_function: function () {
      var ship_view = this.fp_view;
      var ship_entity = this.ship;
      var viewer = this.viewer;
      var last_lon = this.last_lon;
      var last_lat = this.last_lat;
      var now_lon = this.now_lon;
      var now_lat = this.now_lat;
      var h = this.h;
      var ori_z = this.ori_z;

      if (ship_view == false || ship_entity === undefined) return;
      viewer.trackedEntity = null;
      var camera = viewer.camera;
      try {
        // debugger;
        if (last_lon != now_lon && last_lat != now_lat) {
          var ship_position_ = new Cesium.Cartographic.fromCartesian(ship_entity.position._value);
          var height = ship_position_.height + 10;
          camera.flyTo(
            {
              destination: new Cesium.Cartesian3.fromDegrees(now_lon, now_lat, height),
              orientation: new Cesium.HeadingPitchRoll(camera.heading, 0, 0),
              duration: 0.2
            }
          );
        }
      } catch (error) {
        console.log(error);
      };
    },

    firstPersonView: function (checked) {
      var viewer = this.viewer;
      var ship_entity = this.ship;

      viewer.scene.screenSpaceCameraController.enableTranslate = !checked;
      viewer.scene.screenSpaceCameraController.enableRotate = !checked;
      viewer.scene.screenSpaceCameraController.enableZoom = !checked;
      if (checked) {
        viewer.scene.screenSpaceCameraController.translateEventTypes = [];
        viewer.scene.screenSpaceCameraController.rotateEventTypes = [];
        viewer.scene.screenSpaceCameraController.lookEventTypes = [Cesium.CameraEventType.LEFT_DRAG];
      }
      else {
        viewer.scene.screenSpaceCameraController.translateEventTypes = Cesium.CameraEventType.LEFT_DRAG;
        viewer.scene.screenSpaceCameraController.rotateEventTypes = Cesium.CameraEventType.LEFT_DRAG;
        viewer.scene.screenSpaceCameraController.lookEventTypes = [];

      }

      if (checked) {
        viewer.camera.setView({
          orientation: new Cesium.HeadingPitchRoll(viewer.camera.heading, 0, 0)
        });
        this.camera_above_ship_function();
        // ship_entity.show = false;
      }
      else {
        ship_entity.show = true;
      }
    },

    setFPViewer: function () {
      this.fp_view = true;
      this.follow_ship = false;
      if (this.ship) this.ship.show = false;
      this.viewer.trackedEntity = null;
    },

    setFollowShip: function () {
      this.fp_view = false;
      this.follow_ship = true;
      if (this.ship) this.ship.show = true;

      this.viewer.trackedEntity = this.ship;

    },

    clearPath: function () {
      this.path = [];
      this.shape.polyline.positions = this.path;
    },

    shiftPathShow: function () {
      this.show_path = !this.show_path;
      this.shape.polyline.show = this.show_path;
    }
  }
});
</script>
