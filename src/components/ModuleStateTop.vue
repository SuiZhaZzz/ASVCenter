<template>
  <div class="row full-width wrap">
    <div class="col-6 ">
      <ModuleState v-for="m in getEven" :key="m.name" v-bind="m">
      </ModuleState>
    </div>
    <div class="col-6 ">
      <ModuleState v-for="m in getOdd" :key="m.name" v-bind="m">
      </ModuleState>
    </div>
  </div>

</template>

<script>
import { defineComponent } from "vue";
import ModuleState from "./ModuleState.vue";

export default defineComponent({
  name: "ModuleStateTop",
  props: {
    mqtt_server: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      client: null,
      modules: [
        {
          name: "GPS",
          state: 0,
        },
        {
          name: "IMU",
          state: 0,
        },
        {
          name: "Lidar",
          state: 0,
        },
        {
          name: "Camera",
          state: 0,
        },
        {
          name: "Mi-w Radar",
          state: 0,
        },
        {
          name: "Stereosonic",
          state: 2,
        },
      ]
    };
  },
  mounted() {
    this.connectMqtt();
  },
  computed: {
    getOdd() {
      return [this.modules[1], this.modules[3], this.modules[5]];
    },
    getEven() {
      return [this.modules[0], this.modules[2], this.modules[4]];
    },
  },
  methods: {
    connectMqtt() {
      let that = this;
      let client = that.client;

      const options = {
        // Clean session
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 4000,
      };

      try {
        // client = mqtt.connect("ws://127.0.0.1:1884/mqtt", options);
        client = mqtt.connect(that.mqtt_server, options);
      } catch (error) {
        console.log("mqtt.connect error", error);
      }

      client.on("connect", function () {
        console.log("Connected");
        // client.subscribe("presence");
        client.subscribe(that.topic);
        // client.subscribe("usv/motion_state");
      });

      client.on("message", function (topic, message) {
        // message is Buffer
        let o = JSON.parse(message);
        that.modules[0].state = o.gps;
        that.modules[1].state = o.imu;
        that.modules[2].state = o.lidar;
        that.modules[3].state = o.camera;
        that.modules[4].state = o.mi_w_radar;
        that.modules[5].state = o.stereosonic;
      });
    },
  },
  components: { ModuleState }
});
</script>
