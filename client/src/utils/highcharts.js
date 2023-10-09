export const generalOptions = {
  title: {
    style: {
      color: "#333333",

      fontSize: "calc(1.3rem + .6vw)",
      fontWeight: 700,
    },
  },
  subtitle: {
    style: {
      color: "#333333",
      fontSize: "1.25rem",
      fontWeight: 500,
    },
  },
  chart: {
    backgroundColor: "#ffffff",
  },
  xAxis: {
    itemStyle: {
      color: "#333333",
    },
    labels: {
      style: {
        color: "#333333",
      },
    },
    gridLineColor: "#e6e6e6",
    tickWidth: 0,
  },
  yAxis: {
    labels: {
      style: {
        color: "#333333",
      },
    },
    title: {
      style: {
        color: "#333333",
      },
    },
    gridLineColor: "#e6e6e6",
    tickWidth: 0,
  },
  legend: {
    enabled: true,
    itemStyle: {
      fontSize: "1rem",
      color: "#333333",
    },
    padding: 16,
  },
  accessibility: {
    enabled: false,
  },
  colors: [
    "#4A6491", // A muted blue to blend with your background
    "#7BA0C0", // A lighter blue for a softer transition
    "#D3E1F1", // A very light blue, closer to your lighter background color
    "#F4C542", // A soft gold color for a warm contrast
    "#E89264", // A soft red-orange for further contrast
    "#A8D5BA", // A soft green to keep the palette fresh and light
    "#6D83B4", // A muted blue to tie in with your primary blue
    "#B0A8B9", // A neutral grey with a hint of purple
    "#C0C0C0", // A neutral grey to provide a neutral base
    "#E0E0E0", // A lighter grey to ensure enough lightness in your palette
  ],
};

export function isMonochromatic(color) {
  const reRGBHex = /^(?:[0-9a-fA-F]{6})$/;

  const splitToChunks = (chunkSize) => (chunks, current, i, arr) =>
    i % chunkSize === 0 ? [...chunks, current + arr[i + 1]] : chunks;

  // eslint-disable-next-line no-empty-pattern
  const isEqual = (elem, {}, [firstElement]) => elem === firstElement;

  const isMonochromatic = ([, ...rgb] = "#") =>
    reRGBHex.test(rgb.join("")) &&
    rgb.reduce(splitToChunks(2), []).every(isEqual)
      ? false
      : color;

  return isMonochromatic(color);
}
