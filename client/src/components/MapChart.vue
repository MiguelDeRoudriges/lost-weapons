<template lang="pug">
section
  .bg-body.rounded.p-1.highmaps
    div(ref="keywordChart", :id="idKey")
</template>

<script>
import theMap from "@/assets/map-options.json";

import Highcharts from "highcharts";
import Maps from "highcharts/modules/map";
import Accessibility from "highcharts/modules/accessibility";

import { generalOptions } from "@/utils/highcharts.js";

export default {
  props: {
    title: {
      type: String,
      default: "title",
    },
    subtitle: {
      type: String,
      default: "",
    },
    mapData: {
      type: Array,
      required: true,
    },
    disableDataLabels: {
      type: Boolean,
      default: false,
    },
    showTooltipTitle: {
      type: Boolean,
      default: true,
    },
    valueSuffix: {
      type: String,
      default: "",
    },
    tooltipFormatter: {
      type: Function,
      default: function () {
        const regionName = this.point.properties["woe-label"].split(",")[0];
        const value = this.point.value.toLocaleString("uk-ua");
        const color = this.point.color;
        const suffix = this.series.tooltipOptions.valueSuffix;

        return `<div class="odm-tooltip">
                <div class="seria">
                  <div class="name"><span style="color: ${color}"> ■</span> ${regionName}</div>
                  <div class="value">${value}</div>
                  <div>${suffix}</div>
                </div>
              </div>`;
      },
    },
  },
  data() {
    return {
      chart: null,
      idKey: "mapContainer",
    };
  },
  computed: {
    computedLogotype() {
      return {
        url: "/public/infogorizon.svg",
        width: 240,
        height: 30,
      };
    },
    chartOptions() {
      return {
        chart: {
          map: theMap,
          spacingBottom: 50,
          spacingTop: 20,
          height: 450,
          events: {
            redraw: this.resizeChart,
          },
        },
        title: {
          text: this.title,
        },
        subtitle: {
          text: this.subtitle,
        },
        logotype: this.computedLogotype,
        responsive: {
          rules: [
            {
              condition: {
                minWidth: 576,
              },
              chartOptions: {
                chart: {
                  height: 450,
                },
              },
            },
          ],
        },
        mapNavigation: {
          enabled: false,
        },
        navigation: {
          buttonOptions: {
            enabled: false,
          },
        },
        colorAxis: {
          labels: {
            formatter: function () {
              return this.value;
            },
          },
          stops: [
            [0, "#5A77A6"], // A muted blue to blend with your background
            [0.25, "#A1B6D1"], // A lighter blue for a softer transition
            [0.5, "#DCE3ED"], // A very light blue, closer to your lighter background color
            [0.75, "#F4C542"], // A soft gold color for a warm contrast
            [1, "#E89264"], // A soft red-orange for further contrast
          ],
        },
        tooltip: {
          backgroundColor: "#fffffff0",
          borderWidth: 1,
          borderColor: "#cccccc66",
          borderRadius: 12,
          padding: 16,
          shadow: false,
          style: { color: "#111", fontSize: "14px" },
          useHTML: true,
          formatter: this.tooltipFormatter,
          valueSuffix: this.valueSuffix,
        },
        credits: { enabled: false },
        series: [
          {
            name: this.title,
            states: {
              hover: {
                brightness: 0.1,
              },
            },
            dataLabels: {
              enabled: !this.disableDataLabels,
              format: "{point.value}",
            },
            data: this.mapData,
          },
        ],
      };
    },
  },
  mounted() {
    Maps(Highcharts);
    Accessibility(Highcharts);

    Highcharts.setOptions(generalOptions);

    this.chart = Highcharts.mapChart(this.idKey, this.chartOptions);

    this.drawLogo(this.chart);
  },
  methods: {
    resizeChart() {
      const { chart } = this;
      const { width } = this.computedLogotype;
      this.logotypeImage =
        chart && chart.container.querySelector(".logo-img-" + this.idKey);
      if (this.logotypeImage) {
        try {
          this.logotypeImage.setAttribute(
            "x",
            chart.chartWidth / 2 - width / 2
          );
          this.logotypeImage.setAttribute(
            "y",
            chart.chartHeight - chart.options.chart.spacingBottom
          );
        } catch (error) {
          return null;
        }
      }
    },
    drawLogo(chart) {
      const { url } = chart.options.logotype;
      const { width } = chart.options.logotype;
      const { height } = chart.options.logotype;
      const x = chart.chartWidth / 2 - width / 2;
      const y = chart.chartHeight - chart.options.chart.spacingBottom;
      this.logotypeImage = chart.renderer.image(url, x, y, width, height).add();
      this.logotypeImage.element.classList.add("logo-img-" + this.idKey);
    },
  },
};
</script>

<style lang="sass">
.highmaps
  overflow: hidden

.odm-tooltip
  .seria
    .value
      font-weight: 600
      font-size: calc(1.3rem + .6vw)
      display: block
      padding-top: 0.25rem
    .name
      span
        text-shadow: 0px 0px 2px #999999

@media (min-width: 768px)
  .highmaps
    overflow: hidden
</style>
