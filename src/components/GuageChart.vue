<template>
  <div>
    <q-card>
      <div ref="guagechart" id="guageChart" style="height: 270px"></div>
      <q-resize-observer @resize="onResize" />
    </q-card>
  </div>
</template>

<script>
export default {
  name: "GuageChart",
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
      value: 30,
      guage_chart: null,
      client: null,
    };
  },
  mounted() {
    this.initChart();
    this.connectMqtt();
  },
  watch: {
    value(old_value, new_value) {
      this.guage_chart.setOption(this.echartOptions);
    },
  },
  computed: {
    echartOptions() {
      return {
        tooltip: {
          formatter: "{a} : {c} km/h",
        },
        series: [
          {
            name: "Velocity",
            type: "gauge",
            radius: "100%",
            center: ["50%", "55%"],
            progress: {
              show: true,
            },
            detail: {
              valueAnimation: true,
              fontSize: 25,
              formatter: "{value}km/h",
            },
            data: [
              {
                value: this.value,
              },
            ],
          },
        ],
      };
    },
  },
  methods: {
    initChart() {
      let guageChart = document.getElementById("guageChart");
      echarts.dispose(guageChart);
      let theme = "dark";
      this.guage_chart = echarts.init(guageChart, theme);
      this.guage_chart.setOption(this.echartOptions);
    },
    onResize() {
      if (this.guage_chart) {
        this.guage_chart.resize();
      }
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
      });

      client.on("message", function (topic, message) {
        // message is Buffer
        let o = JSON.parse(message);
        let num = Number(o.speed);
        // console.log(num);
        that.value = num;
      });
    },
  },
};
</script>

<style scoped>
</style>
