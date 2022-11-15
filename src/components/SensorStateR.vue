<template>
  <div class="row full-width wrap q-col-gutter-md" style="font-size: 1rem">
    <div class="col-6">
      <div class="row full-width">
        <div>回家距离：</div>
        <div>{{ home_distance }} m</div>
      </div>
      <div class="row full-width">
        <div>数传电台：</div>
        <div>{{ radio_rate }} Hz</div>
      </div>
      <div class="row full-width">
        <div>空速刷新：</div>
        <div>{{ airspeed_rate }} Hz</div>
      </div>
      <div class="row full-width">
        <div>卫星：</div>
        <div>{{ satellite }}</div>
      </div>
    </div>
    <div class="col-6">
      <div class="row full-width">
        <div>姿态仪误差：</div>
        <div>{{ imu_offset }}</div>
      </div>
      <div class="row full-width">
        <div>GPS数据：</div>
        <div>{{ gps_rate }} Hz</div>
      </div>
      <div class="row full-width">
        <div>GPS速度：</div>
        <div>{{ gps_speed }} km/h</div>
      </div>
      <div class="row full-width">
        <div>GPS有效：</div>
        <div>{{ gps_valid }}</div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "SensorStateR",
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
      home_distance: 16.0,
      radio_rate: 8,
      airspeed_rate: 0,
      gps_rate: 10,
      gps_speed: 1.4,
      gps_valid: 0,	// 0无效 1有效
      satellite: 5,
      imu_offset: 0,
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

        that.home_distance = o.home_distance;
        that.radio_rate = o.radio_rate;
        that.airspeed_rate = o.airspeed_rate;
        that.gps_rate = o.gps_rate;
        that.gps_speed = o.gps_speed;
        that.gps_valid = o.gps_valid;	// 0无效 1有效
        that.satellite = o.satellite;
        that.imu_offset = o.imu_offset;
        // console.log(o);
      });
    },
  },
}
</script>
