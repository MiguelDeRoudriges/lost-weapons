<template lang="pug">
.container
  .py-3.px-3(v-cloak)
    .mx-auto.max-w-md
      search-form(@submit-search="getAPIrequest", :initial-text="searchText")
    .p-1
    small
      span(v-if="count > 0") Знайдено {{ formatNumber(count) }} {{ declension(count, ["одиниця", "одиниці", "одиниць"]) }}
      span(v-else) Моделей зброї не знайдено
    .p-0
    h1.mb-0 Моделі зброї
  .p-lg-3.rounded-3.mb-2
    .row.row-cols-1.row-cols-md-2.g-3
      .col(v-for="weapon in formatCards(weapons)")
        cards(:options="weapon", :showPlaceholders="isLoading")
  .p-3
</template>

<script>
import { useHead } from "@vueuse/head";

import Cards from "@/components/Cards.vue";
import SearchForm from "@/components/SearchForm.vue";

import { getData } from "@/services/api/http.js";
import { getHumanDate } from "@/utils/date.js";

import { addToLocalStorage } from "@/utils/localeStorage.js";

const weaponsURL = "http://localhost:3000/weapons?";
const SEARCH_LIMIT = 12;

const searchKeys = "weaponNumber,weaponSeries";

function processNotFound(writeResponse, router) {
  router.push({ name: "NotFound" });
  return error({ writeResponse, code: 404 });
}

function error({ writeResponse, code }) {
  writeResponse({
    status: code,
    headers: {},
  });
  return { status: code };
}

export default {
  components: {
    Cards,
    SearchForm,
  },
  async prefetch({ to, writeResponse, router }) {
    try {
      const { query } = to;

      let searchURL = weaponsURL;

      const offset = query.offset || 0;

      const getSearchKey = (text) => {
        const isNumber = /^\d+$/.test(text);
        return isNumber ? "weaponNumber" : "weaponNumber,weaponSeries";
      };

      const params = {
        searchQuery: query.q || "",
        searchKeys: getSearchKey(query.q),
        limit: SEARCH_LIMIT,
        offset,
      };

      const {
        data: { data, count },
      } = await getData(searchURL, params);

      return { weapons: data, count, searchText: query.q || "", status: 200 };
    } catch (e) {
      return processNotFound(writeResponse, router);
    }
  },
  data() {
    return {
      isLoading: false,
      timeoutID: -1,
      placeholder: "Введіть серію та (або) номер зброї",
    };
  },
  created() {
    const text = this.$route.query.q || "";

    const { path } = this.$route;

    const title = `Пошук ${text} за серію та (або) номер зброї на Infohorizon: Деталізована Інформація, історія використання і місцезнаходження втрачених або викрадених ${text}`;
    const description = `Знайдіть повну інформацію про модель ${text} в Україні на Infohorizon. Інформація про виробника, тип, вид, серію, номер, калібр, кількість стволів та рік виробництва. Отримайте доступ до бази даних зброї - Infohorizon.`;

    useHead({
      title,
      description,
      path,
    });
  },
  methods: {
    async getAPIrequest(input) {
      this.query = this.getUrlQueryType(input);

      if (input) {
        window.location.assign("/search?" + new URLSearchParams({ q: input }));
      }

      addToLocalStorage("weaponsSuggests", {
        text: this.query.text,
        type:
          this.query.type === "number" ? "За номером" : "За серією і номером",
      });
    },
    getUrlQueryType(text) {
      const isNumber = /^\d+$/.test(text);
      return isNumber ? { type: "number", text } : { type: "series", text };
    },
    formatNumber(number) {
      return number.toLocaleString("uk-UA");
    },
    declension(number, declinations) {
      const cases = [2, 0, 1, 1, 1, 2];
      const n = Math.abs(number);
      return declinations[
        n % 100 > 4 && n % 100 < 20 ? 2 : cases[n % 10 < 5 ? n % 10 : 5]
      ];
    },
    formatCards(cards) {
      if (!cards) return [];

      const mapCards = (card) => {
        const {
          brandModel,
          weaponKind,
          weaponType,
          weaponModel,
          weaponNumber,
          weaponSeries,
          weaponCaliber,
          reasonSearch,
          producer,
          theftDate,
          organUnit,
        } = card;

        return {
          title: { text: weaponKind + " " + brandModel },
          subtitle: {
            title: "Номер зброї",
            text: weaponSeries
              ? `${weaponNumber}${weaponSeries}`
              : `${weaponNumber}`,
          },
          paragraphs: [
            {
              subtitle: "Калібр",
              text: { value: weaponCaliber },
            },
            {
              subtitle: "Тип зброї",
              text: { value: weaponType },
            },
            {
              subtitle: "Модель",
              text: { value: weaponModel },
            },
            {
              subtitle: "Вид зброї",
              text: { value: weaponKind },
            },
            {
              subtitle: "Причина розшуку",
              text: { value: reasonSearch },
            },
            {
              subtitle: "Виробник",
              text: { value: producer },
            },
            {
              subtitle: "Дата викраденння чи втрати",
              text: { value: getHumanDate(theftDate) },
            },
            {
              subtitle: "Підрозділ, що здійснює розшук",
              text: { value: organUnit },
            },
          ].filter((paragraph) => paragraph?.text?.value),
        };
      };

      return cards.map(mapCards);
    },
  },
};
</script>

<style lang="sass">
.max-w-md
  max-width: 720px

h1
  font-size: calc(0.9rem + 1vw)
</style>
