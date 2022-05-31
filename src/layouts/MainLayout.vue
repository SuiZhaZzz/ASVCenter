<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-bl-1 text-white">
      <div
        class="row wrap justify-between items-center content-center"
        style="height: 50px"
      >
        <!-- icon and title -->
        <div class="col-3 row wrap justify-between items-center">
          <div class="col-3">
            <q-avatar>
              <img src="/whu-icon.png" />
            </q-avatar>
          </div>
          <div class="col-8 text-subtitle1 text-weight-bolder">
            ASV监控与配置中心
          </div>
        </div>
        <!-- top tabs -->
        <div class="col-7">
          <q-tabs shrink>
            <q-route-tab
              class="top-tab-bg"
              name="tabSelfNav"
              label="自主导航"
              :to="{ path: '/SelfNavigation' }"
              exact
              replace
            />
            <q-route-tab
              class="top-tab-bg"
              name="tabScenePer"
              label="场景感知"
              :to="{ path: '/ScenePerception' }"
              exact
              replace
            />
            <q-route-tab
              class="top-tab-bg"
              name="tabMonitor"
              label="视频监控"
              :to="{ path: '/Monitor' }"
              exact
              replace
            />
            <q-route-tab
              class="top-tab-bg"
              name="tabWaypointPlan"
              label="航点规划"
              :to="{ path: '/WaypointPlan' }"
              exact
              replace
            />
          </q-tabs>
        </div>
        <!-- home tab -->
        <div class="col-2 column items-center">
          <q-tabs shrink>
            <q-route-tab
              class="top-tab-bg"
              name="tabHome"
              label="首页"
              exact
              replace
              @click="goHome"
            />
          </q-tabs>
        </div>
      </div>
    </q-header>

    <div @mousemove="coordinate">
      <q-page-container>
        <router-view />
        <!-- top sticky -->
        <q-page-sticky expand position="top">
          <div class="full-width row wrap">
            <div class="col-3">
              <div
                v-show="tLPanel"
                class="card"
                style="overflow: hidden; min-height: 300px; max-height: 300px"
              >
                <q-bar class="bg-bl-3 justify-center" style="height: 30px">
                  <div style="font-size: 0.9rem; font-weight: 500">
                    ASV实时姿态
                  </div>
                </q-bar>
                <q-img
                  src="/orientation.png"
                  style="height: 270px"
                  fit="contain"
                />
              </div>
            </div>

            <div
              class="col-3 card row items-center"
              style="overflow: hidden; min-height: 150px; max-height: 150px"
            >
              <q-img
                src="/top-1.png"
                style="height: 150px"
                fit="contain"
              ></q-img>
            </div>

            <div
              class="col-3 card row items-center"
              style="overflow: hidden; min-height: 150px; max-height: 150px"
            >
              <q-img
                src="/top-2.png"
                style="height: 150px"
                fit="contain"
              ></q-img>
            </div>

            <div class="col-3">
              <div
                v-show="tRPanel"
                class="card"
                style="overflow: hidden; min-height: 300px; max-height: 300px"
              >
                <q-bar class="bg-bl-3 justify-center" style="height: 30px">
                  <div style="font-size: 0.9rem; font-weight: 500">
                    ASV航行速度
                  </div>
                </q-bar>
                <!-- <q-img
                  src="/velocity.png"
                  style="height: 270px"
                  fit="contain"
                ></q-img> -->
                <div>
                  <GuageChart></GuageChart>
                </div>
              </div>
            </div>
          </div>
        </q-page-sticky>

        <!-- bottom sticky -->
        <q-page-sticky expand position="bottom">
          <div class="full-width row wrap items-end">
            <div class="col-3">
              <div
                v-show="bLPanel"
                class="card"
                style="overflow: hidden; min-height: 300px; max-height: 300px"
              >
                <q-bar class="bg-bl-3 justify-center" style="height: 30px">
                  <div style="font-size: 0.9rem; font-weight: 500">
                    报警信息
                  </div>
                </q-bar>

                <div style="overflow: auto; height: 230px">
                  <q-list>
                    <q-item dense>
                      <q-item-section avatar>
                        <q-icon
                          name="warning"
                          color="red"
                          style="font-size: 2rem"
                        />
                      </q-item-section>

                      <q-item-section class="text-red text-weight-bold">
                        ！电台信号丢失
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>

                <q-bar class="bg-bl-3 justify-center" style="height: 40px">
                  <q-btn-group>
                    <q-btn class="bg-bl-2" outline label="手动遥控" />
                    <q-btn class="bg-bl-2" outline label="航线巡航" />
                    <q-btn class="bg-bl-2" outline label="自主避障" />
                    <q-btn class="bg-bl-2" outline label="系统故障" />
                  </q-btn-group>
                </q-bar>
              </div>
            </div>

            <div
              class="col-6 card row items-center justify-evenly"
              style="overflow: hidden; height: 40px"
            >
              <BotFunc
                v-for="func in botFuncs"
                :key="func.name"
                v-bind="func"
              />
            </div>

            <div class="col-3">
              <div
                v-show="bRPanel"
                class="card"
                style="overflow: hidden; min-height: 300px; max-height: 300px"
              >
                <q-bar class="bg-bl-3 justify-center" style="height: 30px">
                  <div style="font-size: 0.9rem; font-weight: 500">
                    模块运行状态
                  </div>
                </q-bar>
                <div
                  class="column justify-between"
                  style="overflow: hidden; height: 270px"
                >
                  <div class="col-5 row items-center">
                    <ModuleState
                      v-for="m in modules1"
                      :key="m.name"
                      v-bind="m"
                    />
                  </div>

                  <q-separator color="white" />

                  <div class="col-1.5 row items-center">
                    <ModuleState
                      v-for="m in modules2"
                      :key="m.name"
                      v-bind="m"
                    />
                  </div>

                  <q-separator color="white" />

                  <div class="col-5 row items-center">
                    <ModuleState
                      v-for="m in modules3"
                      :key="m.name"
                      v-bind="m"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-page-sticky>

        <!-- four button around -->
        <q-page-sticky position="top-left">
          <q-btn
            @click="tLPanel = !tLPanel"
            text-color="white"
            flat
            round
            dense
            icon="menu"
          />
        </q-page-sticky>
        <q-page-sticky position="top-right">
          <q-btn
            @click="tRPanel = !tRPanel"
            text-color="white"
            flat
            round
            dense
            icon="menu"
          />
        </q-page-sticky>
        <q-page-sticky position="bottom-left">
          <q-btn
            @click="bLPanel = !bLPanel"
            text-color="white"
            flat
            round
            dense
            icon="menu"
          />
        </q-page-sticky>
        <q-page-sticky position="bottom-right">
          <q-btn
            @click="bRPanel = !bRPanel"
            text-color="white"
            flat
            round
            dense
            icon="menu"
          />
        </q-page-sticky>
      </q-page-container>
    </div>

    <q-footer bordered class="bg-grey-10 text-bl-2">
      <div
        class="row wrap justify-between items-center text-bot"
        style="height: 25px"
      >
        <q-separator vertical size="0.5rem" color="blue" />

        <div class="col-1">268145.7813m</div>
        <div class="col-3 row justify-end">
          {{ currentDateTime }}
        </div>

        <q-separator vertical size="0.5rem" color="blue" />

        <div class="col-4">(鼠标)纬度:{{ x }} 经度:{{ y }}</div>

        <q-separator vertical size="0.5rem" color="blue" />
        <!-- TODO -->
        <div class="col-3">命令 &lt;取消&gt; 发送成功</div>
      </div>
    </q-footer>
  </q-layout>
</template>

<style>
/* top tab background */
.top-tab-bg {
  background-image: url(button-bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.q-tab__label {
  font-weight: bold;
}

/* card theme */
.card {
  opacity: 0.8;
  background: #000d33;
  color: #ffffff;
  border-width: thin;
  border-style: solid;
  border-color: #ffffff;
}

/* single background and text class*/
/* top bar */
.bg-bl-1 {
  background: #000d33;
}
/* bottom bar */
.bg-bl-2 {
  background: #00b3df;
}
.text-bl-2 {
  color: #00b3df;
}
/* card bar */
.bg-bl-3 {
  background: #172f42;
}
</style>

<script>
import { defineComponent, ref } from "vue";
import ModuleState from "components/ModuleState.vue";
import BotFunc from "components/BotFunc.vue";
import GuageChart from "src/components/GuageChart.vue";

let guage_chart = document.getElementById("guageChart");

var modulesList1 = [
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
];

var modulesList2 = [
  {
    name: "4G",
    state: 0,
  },
  {
    name: "Radio",
    state: 1,
  },
];

var modulesList3 = [
  {
    name: "Genuis",
    state: 0,
  },
  {
    name: "Scenario",
    state: 0,
  },
  {
    name: "Planning",
    state: 0,
  },
  {
    name: "Controller",
    state: 0,
  },
  {
    name: "Decision",
    state: 0,
  },
  {
    name: "Risk Eval",
    state: 0,
  },
];

// 0 - normal; 1 - unavailuble
var botFuncsList = [
  {
    name: "Emergency Stop",
    state: 0,
  },
  {
    name: "Standby",
    state: 1,
  },
  {
    name: "Station Keep",
    state: 1,
  },
  {
    name: "Cancel Mission",
    state: 0,
  },
  {
    name: "Recover Mission",
    state: 0,
  },
  {
    name: "Course Reversal",
    state: 0,
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    ModuleState,
    BotFunc,
    BotFunc,
    GuageChart,
  },

  data() {
    return {
      tLPanel: true,
      tRPanel: true,
      bLPanel: true,
      bRPanel: true,
      currentDateTime: null,
      x: 1,
      y: 0,
      modules1: modulesList1,
      modules2: modulesList2,
      modules3: modulesList3,
      botFuncs: botFuncsList,
    };
  },
  mounted() {
    setInterval(() => {
      var dd = new Date();
      var format =
        dd.getHours() +
        ":" +
        dd.getMinutes() +
        ":" +
        dd.getSeconds() +
        " " +
        dd.getFullYear() +
        "Y-" +
        dd.getMonth() +
        "M-" +
        dd.getDate() +
        "D";
      this.currentDateTime = format;
    }, 1000);
  },
  methods: {
    goHome() {
      this.$router.replace({
        path: "/SelfNavigation",
      });
    },

    coordinate(e) {
      this.x = e.clientX.toFixed(6);
      this.y = e.clientY.toFixed(6);
    },
  },
});
</script>
