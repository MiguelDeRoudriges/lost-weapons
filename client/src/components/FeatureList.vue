<template lang="pug">
.row
  .col-12.col-md-4.mb-4(v-for="(feature, index) in features" :class="{'col-md-6': getClass(index, features.length, 3)}" :key="index")
    .card.border-0.h-100
      .card-body
        .mb-2
          .icon-stack.card-color(v-if="feature.icon")
            i.bi.bi-hexagon-fill.icon-background
            i(:class="['bi', `bi-${feature.icon}`, 'icon-foreground', 'text-warning']")
        .p-1
        h2.text-body.mb-3 {{ feature.title }}
        p(v-if="feature.description") {{ feature.description }}
        p(v-for="section in feature.sections")
          | {{ section }}
</template>

<script>
export default {
  props: {
    features: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getClass(idx, length, cols) {
      return idx >= length - (length % cols) - cols * ((length % cols) % 2);
    },
  },
};
</script>

<style lang="sass" scoped>
.card-color
  color: OldLace

h2
  font-size: 1.5rem
  font-weight: bold  // Make the title bold

.card
  border: 1px solid #ddd  // Add a light border
  border-radius: 8px  // Round the corners

.icon-stack
  position: relative
  width: 4rem  // Increase the size
  height: 4rem  // Increase the size
  margin-bottom: 1rem  // Add some space below the icon

.icon-background,
.icon-foreground
  position: absolute
  top: 50%
  left: 50%

.icon-background
  transform: translate(-50%, -50%)  // Center the icon
  width: 4rem  // Increase the size
  height: 4rem  // Increase the size
  font-size: 4rem  // Increase the size

.icon-foreground
  transform: translate(-50%, -50%) scale(0.5)  // Center the icon and scale down
  width: 4rem  // Increase the size
  height: 2rem  // Increase the size
  font-size: 4rem  // Increase the size
  color: #FFD700  // This is the color code for a gold/yellow color similar to text-warning
</style>