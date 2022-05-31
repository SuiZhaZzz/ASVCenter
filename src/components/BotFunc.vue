<template>
  <q-btn
    rounded
    outline
    :label="name"
    :color="stateColor"
    :disable="isDisable"
    size="sm"
  ></q-btn>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "BotFunc",
  props: {
    name: {
      type: String,
      required: true,
    },
    // module runtime state
    // 0 - normal; 1 - unavailuable
    state: {
      type: Int8Array,
      required: true,
    },
  },
  computed: {
    stateColor() {
      return this.state == 0 ? "white" : "grey";
    },
    isDisable() {
      return this.state == 1;
    },
  },
});
</script>
