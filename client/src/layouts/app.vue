<template lang="pug">
component(:is="layout")
  slot
</template>

<script>
import { defineAsyncComponent } from "vue";

const DEFAULT_LAYOUT = "light";
export default {
  computed: {
    layout() {
      const layoutName = this.$route.meta.layout || DEFAULT_LAYOUT;
      return defineAsyncComponent(() => import(`./custom/${layoutName}.vue`));
    },
  },
};
</script>
