<template lang="pug">
.container.py-3.px-3(v-cloak)
  .mx-auto.max-w-md
    search-form(@submit-search="getAPIrequest", :initial-text="text")
    .small.text-balck-50.p-3(v-if="$route.path === '/'")
      | Наприклад:
      = " "
      a(
        href="/search?q=36ЛЯ"
      )
        | 36ЛЯ 
      span або
      a.ms-1(href="/search?q=531178") 531178
  .p-3
  .row.g-4
    .col(v-for="widget in weaponsDateByWeekWidget")
      digits-widget(:options="widget")
  .p-2
  .row.g-3
    .col-12.col-md-6
      map-chart(
        :map-data="transformData(weaponsRegions, regionToChartValue)",
        title="Розподіл зброї по Регіонах",
        subtitle="Статистика зброї за регіонами України",
        :disable-data-labels="false",
      )
    .col-12.col-md-6
      chart(
        :idKey="'chartPie'",
        title="Розподіл зброї за Моделями",
        subtitle="Аналіз топ 10 загубленних моделей зброї",
        chart-type="pie",
        :chart-height="450",
        :series="mapIndustriesSeries(weaponsModels)"
      )
    .col-12.col-md-12
      chart(
        :idKey="'columnChart'",
        title="Розподіл зброї за Роками",
        subtitle="Аналіз загубленних моделей зброї за роками",
        point-interval-unit="year"
        :series="mapYearsSeries(weaponsYears)"
      )
  .p-5.p-md-5
    .text-center 
      h1 Як купити API
      p.lead Корпоративні сервіси Infohorizon
      connection-button
  feature-list.g-3(:features="benefits")
</template>

<script>
import { useHead } from "@vueuse/head";

import SearchForm from "@/components/SearchForm.vue";
import MapChart from "@/components/MapChart.vue";
import Chart from "@/components/Chart.vue";
import FeatureList from "@/components/FeatureList.vue";
import DigitsWidget from "@/components/DigitsWidget.vue";
import ConnectionButton from "@/components/ConnectionButton.vue";

import { getData } from "@/services/api/http.js";

import { getMeta } from "@/utils/seo.js";

import { executePromisesWithLimit } from "@/utils/helpers.js";
import { regionToChartValue } from "@/utils/highcharts.js";

const { VITE_BASE_DOMAIN: BASE_DOMAIN } = import.meta.env;

const weaponsURL = `${BASE_DOMAIN}/api/weapons`;
const weaponsRegionsURL = `${weaponsURL}/regionStatistics`;
const weaponsModelsURL = `${weaponsURL}/modelsStatistics`;
const weaponsYearsURL = `${weaponsURL}/yearsStatistics`;

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
    SearchForm,
    MapChart,
    Chart,
    FeatureList,
    DigitsWidget,
    ConnectionButton,
  },
  async prefetch({ to, router, writeResponse }) {
    try {
      const startTime = performance.now();

      const tasks = [
        () => getData(weaponsURL),
        () => getData(weaponsRegionsURL),
        () => getData(weaponsModelsURL),
        () => getData(weaponsYearsURL),
      ];

      const results = await executePromisesWithLimit(4, tasks);

      const [weapons, weaponsRegions, weaponsModels, weaponsYears] =
        results.map(({ value }) => value.data);

      const padWithZeros = (number, length) =>
        String(number).padStart(length, "0");

      const extractAndFormat = (date, extractor, length) =>
        padWithZeros(extractor(date), length);

      const formatDate = (date) => {
        const year = extractAndFormat(date, (d) => d.getFullYear(), 4);
        const month = extractAndFormat(date, (d) => d.getMonth() + 1, 2);
        const day = extractAndFormat(date, (d) => d.getDate(), 2);

        return `${year}-${month}-${day}`;
      };

      const todayDate = formatDate(new Date());
      const lastWeekDate = formatDate(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      const invasionDate = formatDate(new Date(2022, 1, 24));

      const fetchWeaponStats = async (url, dateFrom, dateTo) => {
        const response = await getData(
          `${url}/newStatistics?dateFrom=${dateFrom}&dateTo=${dateTo}`
        );
        return response.data.data;
      };

      const sumArray = (array) =>
        array.reduce((partialSum, a) => partialSum + a, 0);

      const weaponsDateByWeekPromise = fetchWeaponStats(
        weaponsURL,
        lastWeekDate,
        todayDate
      );
      const weaponsSinceInvasionPromise = fetchWeaponStats(
        weaponsURL,
        invasionDate,
        todayDate
      );

      const [weaponsDateByWeek, weaponsSinceInvasion] = await Promise.all([
        weaponsDateByWeekPromise,
        weaponsSinceInvasionPromise,
      ]);

      const weaponByDate = sumArray(weaponsDateByWeek);
      const weaponSinceInvasion = sumArray(weaponsSinceInvasion);

      const { text = "" } = to.query;

      const endTime = performance.now();
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      console.log(`Fetching time: ${executionTime} milliseconds`);

      return {
        weaponsRegions,
        weaponsModels,
        weaponByDate,
        weaponSinceInvasion,
        weaponsYears,
        count: weapons.count,
        regionToChartValue,
        text,
        status: 200,
      };
    } catch (error) {
      return processNotFound(writeResponse, router);
    }
  },
  created() {
    const title = `Infohorizon: Пошук та Аналіз Зброї в Україні`;
    const description = `Infohorizon надає доступ до деталізованої інформації про зброю, яка перебуває в розшуку в Україні через викрадення або втрату. Оглядайте статистику по регіонах та моделям, та дізнавайтеся, як купити доступ до нашого API.`;

    const meta = getMeta({ title, description, path: this.$route.path });

    useHead({
      title,
      meta,
    });
  },
  computed: {
    weaponsDateByWeekWidget() {
      return [
        {
          title: "Загальна кількість загубленної зброї",
          value: this.count.toLocaleString(),
        },
        {
          title:
            "Кількість загубленної зброї з момоменту повномасштабного вторгнення",
          value: this.weaponSinceInvasion.toLocaleString(),
        },
        {
          title: "Кількість загубленної зброї за останній тиждень",
          value: this.weaponByDate.toLocaleString(),
        },
      ];
    },
  },
  data() {
    return {
      benefits: [
        {
          title: "Пошук Зброї",
          description:
            "Наш API надає докладну інформацію про зброю, яка знаходиться в розшуку через викрадення або втрату. Отримайте доступ до бази даних зброї, щоб допомогти правоохоронним органам у їх розшуках.",
          icon: "search",
        },
        {
          title: "Деталізована Інформація",
          description:
            "Отримайте докладну інформацію про кожну одиницю зброї, включаючи марку, модель, виробника, тип та вид зброї, серію, номер, калібр, кількість стволів, рік виробництва та інше.",
          icon: "info-circle",
        },
        {
          title: "Історія та Статус",
          description:
            "Дізнайтеся про останні оновлення статусу зброї, дату викрадення або втрати, а також підрозділ, який здійснює розшук. Наш API забезпечує вам всю необхідну інформацію для слідкування за розшуком зброї.",
          icon: "clock-history",
        },
      ],
    };
  },
  methods: {
    async getAPIrequest(input) {
      this.query = this.getUrlQueryType(input);

      if (input)
        window.location.assign("/search?" + new URLSearchParams({ q: input }));
    },
    mapYearsSeries(data) {
      const last20Data = data.slice(-11);
      const [startDate] = last20Data;
      const yearsCount = last20Data.map(({ count }) => count);

      return [
        {
          name: "Одиниць",
          type: "column",
          pointStart: Date.UTC(startDate.year),
          pointInterval: 1,
          data: yearsCount,
        },
      ];
    },
    mapIndustriesSeries(data) {
      const topFiveMapped = data
        .slice(0, 9)
        .map((item) => ({ name: item.organUnit, y: item.count }));

      const restSum = data.slice(9).reduce((sum, item) => sum + item.count, 0);

      return [
        {
          name: "Одиниць",
          innerSize: "60%",
          data: [...topFiveMapped, { name: "інше", y: restSum }],
        },
      ];
    },
    transformData(data, regionToChartValue) {
      const initializeRegionCounts = (regionsConfig) => {
        return new Map(Object.values(regionsConfig).map((code) => [code, 0]));
      };

      const generateRegexPattern = (regionsConfig) => {
        const regionsBase = Object.keys(regionsConfig).join("|");
        return new RegExp(`(${regionsBase})`, "iu");
      };

      const updateRegionCounts = (
        regionCounts,
        item,
        regexPattern,
        regionsConfig
      ) => {
        const match = item.organUnit?.match(regexPattern);
        if (match && match[0]) {
          const regionName =
            match[0].toUpperCase() + (match[0].endsWith("Ь") ? "К" : "");
          const regionCode = regionsConfig[regionName];
          if (regionCode) {
            return new Map(regionCounts).set(
              regionCode,
              (regionCounts.get(regionCode) || 0) + item.count
            );
          }
        }
        return regionCounts;
      };

      const regionCounts = initializeRegionCounts(regionToChartValue);
      const regexPattern = generateRegexPattern(regionToChartValue);

      const finalRegionCounts = data.reduce(
        (counts, item) =>
          updateRegionCounts(counts, item, regexPattern, regionToChartValue),
        regionCounts
      );

      return Array.from(finalRegionCounts.entries());
    },
    getUrlQueryType(text) {
      const isNumber = /^\d+$/.test(text);
      return isNumber ? { type: "number", text } : { type: "series", text };
    },
  },
};
</script>

<style lang="sass" scoped>
h1
  font-weight: 700
  font-size: calc(2rem + 1.5vw)
p.lead
  font-weight: 500
  margin-bottom: 1rem
  margin-top: 0
  font-size: 1.25rem
.max-w-md
  max-width: 720px
</style>
