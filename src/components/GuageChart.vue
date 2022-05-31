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
  data() {
    return {
      model: true,
      guage_chart: null,
      value: 30,
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    "$q.dark.isActive": function () {
      this.init();
    },
  },
  computed: {
    options() {
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
    init() {
      let guageChart = document.getElementById("guageChart");
      echarts.dispose(guageChart);
      let theme = this.model ? "dark" : "light";
      this.guage_chart = echarts.init(guageChart, theme);
      this.guage_chart.setOption(this.options);
    },
    onResize() {
      if (this.guage_chart) {
        this.guage_chart.resize();
      }
    },
    setValue: _.debounce(function (new_value) {
      this.value = new_value;
    }, 500),
  },
};
</script>

<style scoped></style>
