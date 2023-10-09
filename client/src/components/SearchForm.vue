<template lang="pug">
form(@submit.prevent="submit(text)")
  #search.input-group.input-group-lg
    input.form-control(
      :placeholder="'Введіть серію та (або) номер зброї'" 
      type="search" 
      aria-label="Пошук в ЄДРСР"
      list="datalistOptions"
      v-model.trim="text",
      ref="searchField",
      @focus="getSuggests()"
    )
    datalist#datalistOptions
      option(v-for="suggest in suggests", :value="suggest.text") 
        | {{ suggest.type }}
    button.btn.px-md-3(
      style="background-color: #fff; border: 1px solid #dee2e6"
      title="Пошук",
      type="submit",
    )
      i.bi.bi-search
</template>

<script>
import { getLocalStorage } from "@/utils/localeStorage.js";

export default {
  data() {
    return {
      text: this.initialText,
      suggests: [],
    };
  },
  props: {
    initialText: String,
  },
  watch: {
    initialText(text) {
      this.text = text;
    },
  },
  methods: {
    submit(text) {
      if (!text) {
        this.$refs.searchField.focus();
        return;
      }
      this.$emit("submit-search", text, 1);
    },
    getSuggests() {
      this.suggests = getLocalStorage("weaponsSuggests");
    },
  },
};
</script>

<style lang="sass" scoped>
#search
  input
    border-radius: 50rem 0 0 50rem
  button
    &:last-of-type
      border-radius: 0 50rem 50rem 0
</style>
