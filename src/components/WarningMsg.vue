<template>
  <div class="column full-width wrap q-gutter-y-xs text-red text-weight-bold">
    <div v-for="msg in getMsgs" :key="msg.id" class="row full-width items-center q-gutter-x-md">
      <q-icon name="warning" color="red" style="font-size: 1.8rem" />
      <div> {{ msg }} </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "WarningMsg",
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
      msgs: ["Test message!"],
      client: null,
    }
  },
  mounted() {
    this.connectMqtt();
  },
  computed:
  {
    getMsgs() {
      // clone the origin array
      let r = [...this.msgs];
      return r.reverse();
    }
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
        that.msgs.push(o.message);
      });
    },
  }

}
</script>
