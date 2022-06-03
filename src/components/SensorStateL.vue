<template>
  <div class="row full-width wrap q-col-gutter-md" style="font-size: 1rem">
    <div class="col-6">
      <div class="row full-width">
        <div>纬度：</div>
        <div>{{ position[0] }}</div>
      </div>
      <div class="row full-width">
        <div>经度：</div>
        <div>{{ position[1] }}</div>
      </div>
      <div class="row full-width">
        <div>温度：</div>
        <div>{{ temperature }} ℃</div>
      </div>
      <div class="row full-width">
        <div>目标距离：</div>
        <div>{{ target_distance }} m</div>
      </div>
      <div class="row full-width">
        <div>飞行距离：</div>
        <div>{{ flight_distance }} m</div>
      </div>
    </div>
    <div class="col-6">
      <div class="row full-width">
        <div>GPS高度：</div>
        <div>{{ position[2] }} m</div>
      </div>
      <div class="row full-width">
        <div>气压高度：</div>
        <div>{{ barometric_altitude }} m</div>
      </div>
      <div class="row full-width">
        <div>目标航点：</div>
        <div>{{ target_waypoint }}</div>
      </div>
      <div class="row full-width">
        <div>偏差：</div>
        <div>{{ offset }} m</div>
      </div>
      <div class="row full-width">
        <div>飞行时间：</div>
        <div>{{ flight_time }} s</div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "SensorStateL",
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
      position: [30.5407, 114.359, 15.3],
      temperature: 33.0,
      target_distance: 36.0,
      flight_distance: 1100.0,
      barometric_altitude: 30.1, // 气压高度
      target_waypoint: 1,
      offset: -13.0,
      flight_time: 118,
      client: null,
    }
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
        // client.subscribe("usv/motion_state");
      });

      client.on("message", function (topic, message) {
        // message is Buffer
        let o = JSON.parse(message);
        that.position = o.position;
        that.temperature = o.temperature;
        that.target_distance = o.target_distance;
        that.flight_distance = o.flight_distance;
        that.barometric_altitude = o.barometric_altitude; // 气压高度
        that.target_waypoint = o.target_waypoint;
        that.offset = o.offset;
        that.flight_time = o.flight_time;
        // console.log(o);
      });
    },
  },
}
</script>
