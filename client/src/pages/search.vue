<template lang="pug">
.container
  form(@submit.prevent)
    .position-relative
      .position-absolute.top-50.start-0.translate-middle.ps-5
        transition(name="bounce")
          i.bi.bi-search
      input.form-control.form-control-lg.ps-5(
        v-model.trim="searchText",  
        :placeholder="placeholder", 
        type='search', 
        aria-label='Search'
      )
    .p-3(v-if="searchText.length > 2 && weapons && count === 0")
      .fs-2 Нічого не знайдено
      p Спробуйте ще раз
  .p-2
  .row.row-cols-1.row-cols-md-2.g-3
    .col(v-for="weapon in formatCards(weapons)")
      cards(:options="weapon", :showPlaceholders="isLoading")
  .p-3
</template>

<script>
import Cards from "@/components/Cards.vue";

import { getData } from "@/services/api/http.js";
import { getHumanDate } from "@/utils/date.js";

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
  },
  async prefetch({ to, writeResponse, router }) {
    try {
      const { query } = to;

      let searchURL = weaponsURL;

      const offset = query.offset || 0;

      const params = {
        searchQuery: query.q || "",
        searchKeys,
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
  watch: {
    async searchText(newText) {
      clearTimeout(this.timeoutID);

      if (newText.length < 3) {
        this.addUrlParams(this.$router);

        this.weapons = await this.getCards(this.formatApiParams(newText)).data;
        this.count = await this.getCards(this.formatApiParams(newText)).count;

        return;
      }

      this.timeoutID = setTimeout(async () => {
        this.isLoading = true;

        this.addUrlParams(this.$router, { q: newText });

        setTimeout(async () => {
          this.weapons = await this.getCards(this.formatApiParams(newText))
            .data;
          this.count = await this.getCards(this.formatApiParams(newText)).count;
          this.isLoading = false;
        }, 500);
      }, 2000);
    },
  },
  methods: {
    addUrlParams(router, text = {}) {
      return router.push({
        path: this.$route.path,
        query: text,
      });
    },
    formatApiParams(newText) {
      const params =
        newText.length < 3
          ? { offset: this.offset, limit: this.limit }
          : {
              searchKeys,
              searchQuery: newText,
              limit: SEARCH_LIMIT,
            };

      return {
        params,
        endPoint: weaponsURL,
      };
    },
    async getCards({ params, endPoint }) {
      const {
        data: { data, count },
      } = await getData(endPoint, params, this.$route.path);

      if (!data) return [];

      return { data, count };
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
