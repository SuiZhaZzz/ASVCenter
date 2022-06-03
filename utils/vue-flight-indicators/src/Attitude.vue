<template>
  <!-- 全蓝 -->
  <Wrapper v-bind:size="size">
    <div class="roll indicator-box" v-bind:style="indicateRoll" style="width: 60%; left: 20%">
      <!-- <img src="./assets/img/horizon_back.svg" class="indicator-box" alt=""> -->
      <div class="pitch indicator-box" v-bind:style="indicatePitch">
        <!-- pitch转换 -->
        <img src="./assets/img/horizon_ball.svg" class="indicator-box" alt="" />
      </div>
      <img src="./assets/img/horizon_circle.svg" class="indicator-box" alt="" />
    </div>

    <div class="mechanics indicator-box">
      <img src="./assets/img/fi_circle.svg" class="indicator-box" alt="" />
    </div>
    <div class="heading indicator-box" v-bind:style="indicateHeading">
      <!-- heading -->
      <img src="./assets/img/heading_yaw.svg" class="indicator-box" alt="" />
    </div>
    <div class="mechanics indicator-box">
      <img src="./assets/img/horizon_mechanics.svg" class="indicator-box" alt="" />
    </div>
  </Wrapper>
</template>

<script>
import Wrapper from "./Wrapper.vue";

const PITCH_BOUND = 30;

export default {
  name: "Attitude",
  components: {
    Wrapper,
  },
  props: {
    size: {
      type: Number,
      default: 250,
    },
    roll: {
      type: Number,
      default: 0,
    },
    pitch: {
      type: Number,
      default: 0,
    },
    heading: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    indicateRoll: function () {
      return { transform: "rotate(" + this.roll + "deg)" };
    },
    indicatePitch: function () {
      let pitch = this.pitch;
      if (pitch > PITCH_BOUND) pitch = PITCH_BOUND;
      else if (pitch < -PITCH_BOUND) pitch = -PITCH_BOUND;
      return { top: pitch * 0.68 * 0.6 + "%" };
    },
    indicateHeading: function () {
      return { transform: "rotate(" + this.heading + "deg)" };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
