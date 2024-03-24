<template lang="pug">
.container(style="height: 100vh")
  .row.justify-content-center.align-items-center.h-100
    .col.p-4.text-center
      .text-center.p-4
        a(href="/")
          img(
            src="/infohorizon.svg",
            width="166",
            height="32"
          )
      h1.fw-bolder 404
      p.lead Сторінка не знайдена
      a(href="/") Домашня сторінка
    .col-12.p-2
</template>

<script>
export default {
  prefetch({ writeResponse, initialState }) {
    writeResponse({
      status: 404,
      headers: {},
    });

    initialState.pageNotFound = true;

    return { status: 404 };
  },
};
</script>

<style lang="sass" scoped>
.container
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  height: 100vh
</style>
