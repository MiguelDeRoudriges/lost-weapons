<template lang="pug">
button(ref="button", :disabled="disabled", :type="type")
  .spinner.d-none
    .spinner-border.spinner-border-sm
  span
    slot
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "submit",
    },
  },
};
</script>

<style lang="sass" scoped>
button
  position: relative
  span
    transition: padding 250ms ease-in-out
  .spinner
    transition: opacity 250ms ease-in-out
    opacity: 0
  &:disabled
    .spinner
      position: absolute
      display: inline-block!important
      opacity: 1
    span
      padding-left: 1.5rem
</style>
