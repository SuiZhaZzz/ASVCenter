<template>
  <q-btn-group>
    <q-btn class="bg-bl-2" outline label="手动遥控" :color="colors[0]" />
    <q-btn class="bg-bl-2" outline label="航线巡航" :color="colors[1]" />
    <q-btn class="bg-bl-2" outline label="自主避障" :color="colors[2]" />
    <q-btn class="bg-bl-2" outline label="系统故障" :color="colors[3]" />
  </q-btn-group>
</template>

<script>
export default {
  name: "SaillingMode",
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
      cur_mode: 1,
      colors: ["white", "white", "white", "white"],
      client: null,
    }
  },
  mounted() {
    this.connectMqtt();
  },
  methods: {
    shiftMode(id) {
      for (let i = 0; i < this.colors.length; ++i) this.colors[i] = "white";
      if (id == 1) this.colors[0] = "green";
      if (id == 2) this.colors[1] = "green";
      if (id == 3) this.colors[2] = "green";
      if (id == 99) this.colors[3] = "green";
    },
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
        // console.log(o.mode);
        that.shiftMode(o.mode);
      });
    },
  },
}
</script>
