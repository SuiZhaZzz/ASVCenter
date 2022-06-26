<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-bl-1 text-white">
      <div class="row wrap justify-between items-center content-center" style="height: 50px">
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
            <q-route-tab class="top-tab-bg" name="tabSelfNav" label="自主导航" :to="{ path: '/SelfNavigation' }" exact
              replace />
            <q-route-tab class="top-tab-bg" name="tabScenePer" label="场景感知" :to="{ path: '/ScenePerception' }" exact
              replace />
            <q-route-tab class="top-tab-bg" name="tabMonitor" label="视频监控" :to="{ path: '/Monitor' }" exact replace />
            <q-route-tab class="top-tab-bg" name="tabWaypointPlan" label="航点规划" :to="{ path: '/WaypointPlan' }" exact
              replace />
          </q-tabs>
        </div>
        <!-- home tab -->
        <div class="col-2 column items-center">
          <q-tabs shrink>
            <q-route-tab class="top-tab-bg" name="tabHome" label="首页" exact replace @click="goHome" />
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
              <div v-show="tLPanel" class="card" style="overflow: hidden; min-height: 300px; max-height: 300px">
                <q-bar class="bg-bl-3 justify-center" style="height: 30px">
                  <div style="font-size: 0.9rem; font-weight: 500">
                    ASV实时姿态
                  </div>
                </q-bar>
                <div style="height: 270px" class="row justify-center">
                  <AttitudeIndicator :mqtt_server="mqtt_server" :topic="motion_topic"></AttitudeIndicator>
                </div>
              </div>
            </div>

            <div class="col-3 card row items-center" style="overflow: hidden; min-height: 150px; max-height: 150px">
              <!-- <q-img src="/top-1.png" style="height: 150px" fit="contain"></q-img> -->
              <SensorStateL :mqtt_server="mqtt_server" :topic="sensor_topic"></SensorStateL>
            </div>

            <div class="col-3 card row items-center" style="overflow: hidden; min-height: 150px; max-height: 150px">
              <!-- <q-img src="/top-2.png" style="height: 150px" fit="contain"></q-img> -->
              <SensorStateR :mqtt_server="mqtt_server" :topic="sensor_topic"></SensorStateR>
            </div>

            <div class="col-3">
              <div v-show="tRPanel" class="card" style="overflow: hidden; min-height: 300px; max-height: 300px">
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
                  <GuageChart :mqtt_server="mqtt_server" :topic="motion_topic"></GuageChart>
                </div>
              </div>
            </div>
          </div>
        </q-page-sticky>

        <!-- bottom sticky -->
        <q-page-sticky expand position="bottom">
          <div class="full-width row wrap items-end">
            <div class="col-3">
              <div v-show="bLPanel" class="card" style="overflow: hidden; min-height: 300px; max-height: 300px">
                <q-bar class="bg-bl-3 justify-center" style="height: 30px">
                  <div style="font-size: 0.9rem; font-weight: 500">
                    报警信息
                  </div>
                </q-bar>

                <div style="overflow: auto; height: 230px">
                  <WarningMsg :mqtt_server="mqtt_server" :topic="warning_topic"></WarningMsg>
                </div>

                <q-bar class="bg-bl-3 justify-center" style="height: 40px">
                  <SaillingMode :mqtt_server="mqtt_server" :topic="sailing_topic"></SaillingMode>
                </q-bar>
              </div>
            </div>

            <div class="col-6 card row items-center justify-evenly"
              style="overflow: hidden; height: 40px; z-index: 100;">
              <!-- <BotFunc v-for="func in botFuncs" :key="func.name" v-bind="func" /> -->
              <BotFuncGroup :mqtt_server="mqtt_server" :topic="sailing_topic"></BotFuncGroup>
            </div>

            <div class="col-3">
              <div v-show="bRPanel" class="card" style="overflow: hidden; min-height: 300px; max-height: 300px">
                <q-bar class="bg-bl-3 justify-center" style="height: 30px">
                  <div style="font-size: 0.9rem; font-weight: 500">
                    模块运行状态
                  </div>
                </q-bar>
                <div class="column justify-between" style="overflow: hidden; height: 270px">

                  <div class="col-5 row items-center">
                    <ModuleStateTop :mqtt_server="mqtt_server" :topic="module_topic"></ModuleStateTop>
                  </div>

                  <q-separator color="white" />

                  <div class="col-1.5 row items-center">
                    <ModuleStateMid :mqtt_server="mqtt_server" :topic="module_topic"></ModuleStateMid>
                  </div>

                  <q-separator color="white" />

                  <div class="col-5 row items-center">
                    <ModuleStateBot :mqtt_server="mqtt_server" :topic="module_topic"></ModuleStateBot>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-page-sticky>

        <!-- four button around -->
        <q-page-sticky position="top-left">
          <q-btn @click="tLPanel = !tLPanel" text-color="white" flat round dense icon="menu" />
        </q-page-sticky>
        <q-page-sticky position="top-right">
          <q-btn @click="tRPanel = !tRPanel" text-color="white" flat round dense icon="menu" />
        </q-page-sticky>
        <q-page-sticky position="bottom-left">
          <q-btn @click="bLPanel = !bLPanel" text-color="white" flat round dense icon="menu" />
        </q-page-sticky>
        <q-page-sticky position="bottom-right">
          <q-btn @click="bRPanel = !bRPanel" text-color="white" flat round dense icon="menu" />
        </q-page-sticky>
      </q-page-container>
    </div>

    <q-footer bordered class="bg-grey-10 text-bl-2">
      <div class="row wrap justify-between items-center text-bot" style="height: 25px">
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
import GuageChart from "components/GuageChart.vue";
import AttitudeIndicator from "components/AttitudeIndicator.vue";
import SensorStateL from "components/SensorStateL.vue";
import SensorStateR from "src/components/SensorStateR.vue";
import WarningMsg from "src/components/WarningMsg.vue";
import SaillingMode from "src/components/SaillingMode.vue";
import ModuleStateTop from "src/components/ModuleStateTop.vue";
import ModuleStateMid from "src/components/ModuleStateMid.vue";
import ModuleStateBot from "src/components/ModuleStateBot.vue";
import BotFuncGroup from "src/components/BotFuncGroup.vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "MainLayout",

  components: {
    // ModuleState,
    // BotFunc,
    GuageChart,
    AttitudeIndicator,
    SensorStateL,
    SensorStateR,
    WarningMsg,
    SaillingMode,
    ModuleStateTop,
    ModuleStateMid,
    ModuleStateBot,
    BotFuncGroup
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

      mqtt_server: mqtt_server_url,
      // mqtt_server: "ws://1.116.246.209:1884/mqtt",
      test_topic: "presence",
      motion_topic: "usv/motion_state",
      sensor_topic: "usv/sensor_state",
      warning_topic: "usv/warning",
      sailing_topic: "usv/sailing_mode",
      module_topic: "usv/module_state"
    };
  },
  mounted() {

    const qua = useQuasar()
    if (qua.cookies.has('is_login') == false) {
      console.log('has not login.')
      this.$router.replace({ path: '/login' })
    }
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
        path: "/HomePage",
      });
    },
    logout() {
      qua.cookies.remove('is_login')
      qua.cookies.remove('username')
      this.$router.replace({ path: '/login' })
    },

    coordinate(e) {
      this.x = e.clientX.toFixed(6);
      this.y = e.clientY.toFixed(6);
    },
  },
});
</script>
