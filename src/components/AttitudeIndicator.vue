<template>
  <div>
    <Attitude class="indicator-bg" :size="270" :roll="roll" :pitch="pitch" :heading="heading">
    </Attitude>
  </div>
</template>

<script>
import { Attitude } from "vue-flight-indicators";

export default {
  name: "AttitudeIndicator",
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
      heading: 0,
      roll: 0,
      pitch: 0,
      client: null,
    };
  },
  mounted() {
    this.connectMqtt();
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
      });

      client.on("message", function (topic, message) {
        // message is Buffer
        let o = JSON.parse(message);
        // console.log(num);
        that.heading = Number(o.yaw);
        that.roll = Number(o.roll);
        that.pitch = Number(o.pitch);
      });
    },
  },
  components: {
    Attitude,
  },
};
</script>
