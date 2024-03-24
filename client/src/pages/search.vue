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
    h2.mb-0 Моделі зброї
  .p-lg-3.rounded-3.mb-2
    .row.row-cols-1.row-cols-md-2.g-3
      .col(v-for="weapon in formatCards(weapons)")
        cards(:options="weapon")
  .p-3
</template>

<script>
import { useHead } from "@vueuse/head";

import Cards from "@/components/Cards.vue";
import SearchForm from "@/components/SearchForm.vue";

import { getData } from "@/services/api/http.js";
import { getHumanDate } from "@/utils/date.js";

import { addToLocalStorage } from "@/utils/localeStorage.js";

import { getMeta } from "@/utils/seo.js";

const { VITE_BASE_DOMAIN: BASE_DOMAIN } = import.meta.env;

const weaponsURL = `${BASE_DOMAIN}/api/weapons?`;
const SEARCH_LIMIT = 12;

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

const getSearchKey = (text) => {
  const reNumber = /^\d+$/;

  const isNumber = reNumber.test(text);
  return isNumber ? "weaponNumber" : "weaponNumber,weaponSeries";
};

export default {
  components: {
    Cards,
    SearchForm,
  },
  async prefetch({ to, writeResponse, router }) {
    try {
      const { query } = to;

      const { q: searchText = "" } = query;

      let searchURL = weaponsURL;

      const offset = query.offset || 0;

      const params = {
        searchQuery: searchText,
        searchKeys: getSearchKey(searchText),
        limit: SEARCH_LIMIT,
        offset,
        sortKeys: "theftDate",
        sortDirection: "DESC",
      };

      const {
        data: { data, count },
      } = await getData(searchURL, params);

      return { weapons: data, count, searchText, status: 200 };
    } catch (e) {
      return processNotFound(writeResponse, router);
    }
  },
  data() {
    return {
      timeoutID: -1,
      placeholder: "Введіть серію та (або) номер зброї",
    };
  },
  created() {
    if (!this.weapons.length) return;

    const text = this.$route.query.q || "";

    const { path } = this.$route;

    const title = `Пошук ${text} за серію та (або) номер зброї на Infohorizon: Деталізована Інформація, історія використання і місцезнаходження втрачених або викрадених моделей зброї`;
    const description = `Знайдіть повну інформацію про модель ${text} в Україні на Infohorizon. Інформація про виробника, тип, вид, серію, номер, калібр, кількість стволів та рік виробництва. Отримайте доступ до бази даних зброї - Infohorizon.`;

    const meta = getMeta({ title, description, path });

    useHead({
      title,
      meta,
      path,
    });
  },
  mounted() {
    if (!this.weapons.length) return;

    const text = this.$route.query.q || "";

    this.query = this.getUrlQueryType(text);

    addToLocalStorage("weaponsSuggests", {
      text: this.query.text,
      type: this.query.type === "number" ? "За номером" : "За серією і номером",
    });
  },
  methods: {
    async getAPIrequest(input) {
      this.query = this.getUrlQueryType(input);

      if (input)
        window.location.assign("/search?" + new URLSearchParams({ q: input }));
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

      const getWeaponKeys = (weaponNumber, weaponSeries) => ({
        title: weaponSeries ? "Серія та номер зброї" : "Номер зброї",
        text: weaponSeries ? `${weaponSeries}${weaponNumber}` : weaponNumber,
      });

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
          subtitle: getWeaponKeys(weaponNumber, weaponSeries),
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

h2
  font-size: calc(0.9rem + 1vw)
</style>
