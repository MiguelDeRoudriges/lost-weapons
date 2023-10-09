<template lang="pug">
app-layout
  router-view(:key="$route.fullPath")
</template>

<script>
import AppLayout from "@/layouts/app.vue";

export default {
  components: { AppLayout },
};
</script>
