<template >
  <q-btn rounded outline label="Emergency Stop" :color="colors[0]" :disable="disables[0]" size="sm"
    @click="emergencyStop"></q-btn>
  <q-btn rounded outline label="Standby" :color="colors[1]" :disable="disables[1]" size="sm" @click="standby"></q-btn>
  <q-btn rounded outline label="Station Keep" :color="colors[2]" :disable="disables[2]" size="sm" @click="stationKeep">
  </q-btn>
  <q-btn rounded outline label="Cancel Mission" :color="colors[3]" :disable="disables[3]" size="sm"></q-btn>
  <q-btn rounded outline label="Recover Mission" :color="colors[4]" :disable="disables[4]" size="sm"></q-btn>
  <q-btn rounded outline label="Course Reversal" :color="colors[5]" :disable="disables[5]" size="sm"
    @click="courseReversal"></q-btn>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "BotFuncGroup",
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
      colors: ["white", "white", "white", "white", "white", "white"],
      disables: [false, false, false, true, true, false],
      client: null,
      usv_mode: 0
    }
  },
  mounted() {
    this.connectMqtt();
  },
  methods: {
    emergencyStop() {
      let cmd = {
        "type": 1,
        "cmd": "emergency_stop",
      }
      this.client.publish("usv/cmd/center2ship", JSON.stringify(cmd));
    },
    standby() {
      let cmd = {
        "type": 1,
        "cmd": "standby",
      }
      this.client.publish("usv/cmd/center2ship", JSON.stringify(cmd));
    },
    stationKeep() {
      let cmd = {
        "type": 1,
        "cmd": "station_keep",
      }
      this.client.publish("usv/cmd/center2ship", JSON.stringify(cmd));
    },
    courseReversal() {
      let cmd = {
        "type": 1,
        "cmd": "course_reversal",
      }
      this.client.publish("usv/cmd/center2ship", JSON.stringify(cmd));
    },
    setColors() {
      this.colors[0] = (this.usv_mode == 0 ? "grey" : "red");
      this.colors[1] = (this.usv_mode == 0 ? "white" : "grey");
      this.colors[2] = (this.usv_mode == 4 ? "grey" : "white");
      this.colors[5] = (this.usv_mode == 0 ? "grey" : "red");
    },
    setDisables() {
      this.disables[0] = (this.usv_mode == 0 ? true : false);
      this.disables[1] = (this.usv_mode == 0 ? false : true);
      this.disables[2] = (this.usv_mode == 4 ? true : false);
      this.disables[5] = (this.usv_mode == 0 ? true : false);
    },
    connectMqtt() {
      let that = this;

      const options = {
        // Clean session
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 4000,
      };

      try {
        // client = mqtt.connect("ws://127.0.0.1:1884/mqtt", options);
        that.client = mqtt.connect(that.mqtt_server, options);
      } catch (error) {
        console.log("mqtt.connect error", error);
      }

      let client = that.client;

      client.on("connect", function () {
        console.log("Connected");
        // client.subscribe("presence");
        client.subscribe(that.topic);
        // client.subscribe("usv/motion_state");
      });

      client.on("message", function (topic, message) {
        // message is Buffer
        let o = JSON.parse(message);
        that.usv_mode = o.mode;
        that.setColors();
        that.setDisables();
      });
    },
  }

});
</script>
