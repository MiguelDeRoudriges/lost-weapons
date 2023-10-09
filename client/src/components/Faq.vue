<template lang="pug">
#faq.accordion.accordion-flush(:id="accordionId")
  .accordion-item(v-for="(item, index) in faqs" :key="item.question")
    h2.accordion-header(itemprop="name", :id="'heading' + index")
      button.accordion-button.collapsed(
        type='button' 
        :aria-expanded="activeIndex === index",
        :aria-controls="'collapse' + index",
        :aria-label="'Answer ' + (index + 1)",
        @click="toggleItem(index)",
        :class="[backgroundColor ? `bg-${backgroundColor}` : '', { collapsed: activeIndex !== index }]"
      ) {{ item.question }}
    transition-expand
      .accordion-collapse.collapse.show(
        v-show="activeIndex === index",
        :id="'collapse' + index",
        :class="backgroundColor ? `bg-${backgroundColor}` : ''",
        :aria-labelledby="'heading' + index"
      )
        .accordion-body
          div(itemprop="text")
            div( 
              v-for="answer in item.answers", 
              :class="{ 'mb-0': index === faqs.length - 1 }", 
              v-html="answer"
            )
</template>

<script>

import TransitionExpand from "./TransitionExpand.vue";

export default {
  components: {
    TransitionExpand,
  },
  props: {
    accordionId: {
      type: String,
      required: true,
    },
    faqs: {
      type: Array,
      required: true,
    },
    backgroundColor: {
      type: String,
      default: "",
    },
  },
  async mounted() {
    await import("bootstrap/js/dist/collapse");
  },
  data() {
    return {
      activeIndex: -1,
    };
  },
  methods: {
    toggleItem(index) {
      if (index === this.activeIndex) {
        this.activeIndex = -1;
        return;
      }
      this.activeIndex = index;
    },
  },
};
</script>

<style lang="sass" scoped>
#faq
  p:last-child
    margin-bottom: 0px
</style>
