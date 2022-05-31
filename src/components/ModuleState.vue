<template>
  <div class="col-6 row">
    <div class="col-4 column justify-center items-center">
      <q-icon name="r_rectangle" :color="stateColor" style="font-size: 2rem" />
    </div>

    <div class="col-8 column justify-center">{{ name }}</div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ModuleState",
  props: {
    name: {
      type: String,
      required: true,
    },
    // module runtime state
    // 0 - normal; 1 - error; 2 - unavailuable
    state: {
      type: Int8Array,
      required: true,
    },
  },
  computed: {
    stateColor() {
      if (this.state == 0) return "green";
      else if (this.state == 1) return "red";
      return "grey";
    },
  },
});
</script>
