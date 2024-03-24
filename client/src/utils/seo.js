export function getMeta({ title, description, path }) {
  return [
    {
      property: "fb:app_id",
      content: "1633346113660246",
    },
    {
      property: "og:title",
      content: title,
    },
    {
      name: "twitter:title",
      content: title,
    },
    {
      name: "description",
      content: description,
    },
    {
      property: "og:description",
      content: description,
    },
    {
      name: "twitter:description",
      content: description,
    },
    {
      property: "og:image",
      content: "https://infohorizon.yvhn.io/infohorizon.svg",
    },
    {
      property: "og:image:secure_url",
      content: "https://infohorizon.yvhn.io/infohorizon.svg",
    },
    {
      name: "twitter:image",
      content: "https://infohorizon.yvhn.io/infohorizon.svg",
    },
    {
      name: "twitter:card",
      content: "summary",
    },
    {
      property: "og:image:alt",
      content: title,
    },
    {
      name: "twitter:image:alt",
      content: title,
    },
    {
      property: "og:url",
      content: `https://infohorizon.yvhn.io${path}`,
    },
  ];
}
