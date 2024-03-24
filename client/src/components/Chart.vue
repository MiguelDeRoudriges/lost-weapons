<template lang="pug">
section
  .bg-body.rounded.p-1(
    :style="{ height: 'calc(' + calculateHeight(series) + 'px + 0.5rem)' }"
  )
    div(ref="keywordChart", :id="idKey")
</template>

<script>
import Highcharts from "highcharts";

import {
  isMonochromatic,
  generalOptions,
  translatedOptions,
} from "@/utils/highcharts.js";

export default {
  props: {
    series: {
      type: Array,
      default: () => [],
    },
    chartHeight: {
      type: Number,
      default: 350,
    },
    chartType: {
      type: String,
      default: "pie",
    },
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
    idKey: {
      type: String,
      default: "",
    },
    pointIntervalUnit: {
      type: String,
      default: "month",
      validator(value) {
        return ["day", "month", "year", "quarter"].includes(value);
      },
    },
    pointFormatter: {
      type: Function,
      default() {
        return `
            <div class="odm-tooltip">
              <div class="seria">
                <span class="value" style="color:${isMonochromatic(
                  this.color
                )};">${this.y.toLocaleString("uk-UA")} </span>
                <span class="seria-name" style="color:${isMonochromatic(
                  this.color
                )};"> ${this.series.name} </span>
                <span class="name">${this.name}</span>
                <span class="percentage">${
                  Math.round((this.percentage + Number.EPSILON) * 100) / 100
                }%</span>
              </div>
              <div class="total">Усього ${(+this.total).toLocaleString(
                "uk-UA"
              )} ${this.series.name}</div>
            </div>
                    `;
      },
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    computedLogotype() {
      return {
        url: "/infohorizon.svg",
        width: 240,
        height: 30,
      };
    },
    chartOptions() {
      return {
        title: {
          text: this.title,
        },
        subtitle: {
          text: this.subtitle,
        },
        xAxis: {
          type: "datetime",
        },
        logotype: this.computedLogotype,
        credits: {
          enabled: false,
        },
        navigator: {
          series: {
            dataLabels: { enabled: false, format: "" },
          },
          handles: {
            lineWidth: 0,
            width: 8,
            height: 30,
            backgroundColor: "rgb(197, 197, 197)",
          },
        },
        plotOptions: {
          series: {
            stacking: this.stacking,
            marker: {
              enabled: false,
              symbol: "circle",
            },
            borderRadius: 5,
            pointIntervalUnit: this.pointIntervalUnit,
            pointInterval: 1,
            name: "Keyword",
            dataLabels: {
              style: {
                fontSize: 14,
                fontWeight: 600,
              },
            },
            innerSize: "60%",
          },
          column: {
            borderRadius: 2,
            tooltip: {
              shared: true,
              useHTML: true,
              headerFormat:
                "<span style='font-size: 14px;color:#666'>{point.key}</span> <br>",
            },
          },
          pie: {
            borderRadius: 4,
            dataLabels: {
              enabled: true,
              formatter() {
                return (
                  "<b>" +
                  this.point.name +
                  "</b> " +
                  this.percentage.toFixed(2) +
                  "%"
                );
              },
            },
            tooltip: {
              useHTML: true,
              headerFormat: "",
              pointFormatter: this.pointFormatter,
            },
          },
        },
        chart: {
          zoomType: "x",
          type: this.chartType,
          displayErrors: true,
          spacingBottom: 55,
          spacingTop: 20,
          height: this.calculateHeight(this.series),
          events: {
            redraw: this.resizeChart,
          },
        },
        tooltip: {
          backgroundColor: "#fffffff0",
          borderWidth: 1,
          borderColor: "#cccccc66",
          borderRadius: 12,
          padding: 16,
          useHTML: true,
          shadow: false,
          style: {
            color: "#111",
            fontSize: "18px",
          },
          dateTimeLabelFormats: {
            millisecond: "%H:%M:%S.%L",
            second: "%H:%M:%S",
            minute: "%H:%M",
            hour: "%H:%M",
            day: "%A, %b %e, %Y",
            week: "%A, %b %e, %Y",
            month: "%B %Y",
            year: "%Y",
          },
        },
        yAxis: {
          title: {
            text: "",
          },
        },
        series: this.series,
      };
    },
  },
  mounted() {
    Highcharts.setOptions({ ...generalOptions, lang: translatedOptions });

    this.chart = Highcharts.chart(this.idKey, {
      ...this.chartOptions,
    });

    this.drawLogo(this.chart);
  },
  methods: {
    calculateHeight(series) {
      if (this.chartType !== "bar") return this.chartHeight;

      const categoriesAmount = series.reduce(
        (max, current) =>
          current.data.length > max ? current.data.length : max,
        0
      );
      return series.length * 30 * categoriesAmount + 250;
    },
    download(type) {
      // eslint-disable-next-line no-void
      if (type === void 0) {
        type = "png";
      }

      const { chart } = this;

      switch (type) {
        case "png":
          chart.exportChartLocal({
            type: "image/png",
            filename: `Report ${this.title}`,
          });
          break;
        default:
          return null;
      }
    },
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
      const y = chart.chartHeight - chart.options.chart.spacingBottom; // Adjust this value to add padding
      this.logotypeImage = chart.renderer.image(url, x, y, width, height).add();
      this.logotypeImage.element.classList.add("logo-img-" + this.idKey);
    },
  },
};
</script>

<style lang="sass">
/* purgecss start ignore */
.odm-tooltip
  .datetime
    font-size: .875em
  .seria
    .value
      font-weight: 600
      font-size: 1.75em
      display: block
      padding: 0rem 0rem
    .seria-name
      padding: 0rem 0rem 0.25rem
      display: block
  .total
    font-size: .875em
    padding-top: 0.5rem

/* purgecss end ignore */
</style>
