<template lang="pug">
.card.h-100.border-0.shadow-sm.mx-3.mx-sm-0
  template(v-if="showPlaceholders")
    .img-container.p-4.p-sm-2.d-flex.placeholder-glow(v-if="options.image") 
      div.my-auto.mx-auto.placeholder(
        :style="{ width: '300px', height: '300px'}"
      )
    .card-body.d-flex.flex-column
      p.card-text.placeholder-glow(v-if="options.note")
        span.placeholder(
          v-for="word in options.note.split(' ')",
          :style="{ width: getPlaceholderLength(word) }"
        )
      .fs-6.fw-medium.card-title.placeholder-glow(v-if="options.title")
        template(v-for="word in splitBySpaceAndHyphen(options.title.text)",)
          span.placeholder(
            :class="{ 'bg-primary': options.title.link }",
            :style="{ width: getPlaceholderLength(word) }"
          )
      p.card-text.placeholder-glow(v-if="options.subtitle")
        span.placeholder(
          v-for="word in options.subtitle.text.split(' ')",
          :style="{ width: getPlaceholderLength(word) }"
        )
      .mt-auto.placeholder-glow(v-if="options.paragraphs")
        div.card-text.placeholder-glow(v-for="paragraph in options.paragraphs")
          .small.text-black-50
            span.placeholder(
              v-if="paragraph && paragraph.subtitle"
              :style="{ width: getPlaceholderLength('Остання') }"
            )
          template(v-if="paragraph && paragraph.text && paragraph.text.value")
            p
              template( v-for="word in paragraph.text.value.split(' ')")
                span.placeholder(
                  :class="{ 'bg-primary': paragraph.text.link }",
                  :style="{ width: getPlaceholderLength(word) }"
                )
  template(v-else)
    .card-body.d-flex.flex-column
      h2.fs-6.fw-medium.card-title(v-if="options.title")
        span(v-if="!options.title.link") {{ options.title.text }}
        a.text-decoration-none(v-else :href="options.title.link") {{ options.title.text }}
      p(v-if="options.subtitle") 
        span.small.text-black-50.me-2(v-if="options.subtitle.title") {{ options.subtitle.title }}:
        span {{ options.subtitle.text }}
      .mt-auto
        template(v-for="paragraph in options.paragraphs")
          div(v-if="paragraph.text && paragraph.text.value" )
            span.small.text-black-50.me-2(v-if="paragraph.subtitle") {{ paragraph.subtitle }}:
            template(v-if="typeof paragraph.text === 'object'") 
              span(v-if="!paragraph.text.link") {{ paragraph.text.value }}
              a.text-decoration-none(v-else, :href="paragraph.text.link") {{ paragraph.text.value }}
</template>

<script>
export default {
  props: {
    options: { type: Object, default: () => {} },
    showPlaceholders: { type: Boolean },
  },
  methods: {
    getPlaceholderLength(text) {
      if (!text) return;
      const nonAlphanumeric = /[^a-zA-ZА-ЩЬЮЯҐЄІЇа-щьюяґєії0-9]/;
      const DubiletConstant = 0.55;
      return text.replace(nonAlphanumeric, "").length * DubiletConstant + "em";
    },
    splitBySpaceAndHyphen(str) {
      return str.split(" ").flatMap((part) => part.split("-"));
    },
  },
};
</script>

<style lang="sass" scoped>
a:visited
  color: #908
.card
  .card-body
    h2.card-title
      font-size: calc(1rem + 0.3vw)
    p
      margin-bottom: 0.5rem
.placeholder
  border-radius: 0.125rem
  opacity: 0.4
  &:not(:last-of-type)
    margin-right: 0.375rem
</style>
  