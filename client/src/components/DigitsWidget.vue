<template lang="pug">
#widget.rounded.bg-body.p-3.h-100.d-flex.flex-column
  .small.muted.mb-auto {{ options.title }}
  span.font-monospace.fade.show#number {{ options.value }}
</template>

<script>
export default {
  props: {
    options: { type: Object, default: () => {} },
  },
};
</script>

<style lang="sass" scoped>
.rotate
  transform: rotate(90deg)
  transition: transform 500ms linear

.rotate-0
  transform: rotate(0deg)

.rotate-180
  transform: rotate(180deg)

#percents
  cursor: pointer

#widget
  min-width: 10rem

#number
  font-size: 2rem
  min-height: 3rem
</style>
