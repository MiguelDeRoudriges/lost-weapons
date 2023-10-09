const path = require("path");
const express = require("express");
const compression = require("compression");

const dist = `../dist`;

// This contains a list of static routes (assets)
const { ssr } = require(`${dist}/server/package.json`);

// The manifest is required for preloading assets
const manifest = require(`${dist}/client/ssr-manifest.json`);

// This is the server renderer we just built
const { default: renderPage } = require(`${dist}/server`);

const server = express();
server.use(compression({ filter: () => true }));

// Serve every static asset route
// eslint-disable-next-line no-restricted-syntax
for (const asset of ssr.assets || []) {
  server.use(
    `/${asset}`,
    express.static(path.join(__dirname, `${dist}/client/${asset}`))
  );
}

// Custom API to get data for each page
// See src/main.js to see how this is called
// api.forEach(({ route, handler, method = 'get' }) =>
//   server[method](route, handler)
// )

server.get("*", async (request, response) => {
  const url = `${request.protocol}://${request.get("host")}${
    request.originalUrl
  }`;

  const { html, status, statusText, headers } = await renderPage(url, {
    manifest,
    preload: true,
    request,
    response,
  });

  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.writeHead(status || 200, statusText || headers, headers);
  response.end(html);
});

const port = 8080;
console.log(`Server started: http://localhost:${port}`);
server.listen(port);
