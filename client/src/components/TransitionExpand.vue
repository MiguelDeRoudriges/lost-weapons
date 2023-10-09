<template lang="pug">
transition(
  name="expand",
  @after-enter="afterEnter",
  @enter="enter",
  @leave="leave"
)
  slot
</template>

<script>
export default {
  methods: {
    afterEnter(el) {
      el.style.height = `auto`;
    },
    enter(el) {
      const height = el.scrollHeight;
      el.style.height = 0;
      setTimeout(() => {
        el.style.height = `${height}px`;
      });
    },
    leave(el) {
      el.style.height = `${el.scrollHeight}px`;
      setTimeout(() => {
        el.style.height = 0;
      });
    },
  },
};
</script>

<style lang="sass">
/*! purgecss start ignore */
.expand-enter-active, .expand-leave-active
  transition: all 0.3s ease
  overflow: hidden

.expand-enter-to, .expand-leave
  opacity: 1

.expand-enter, .expand-leave-to
  height: 0 !important
  opacity: 0
/*! purgecss end ignore */
</style>
