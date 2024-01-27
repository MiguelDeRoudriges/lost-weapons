import esbuild from "esbuild";

esbuild
  .build({
    entryPoints: ["server.js"],
    bundle: true,
    outfile: "dist/build.mjs",
    format: "esm",
    platform: "node",
    minify: true,
    banner: {
      js: `
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
      import { dirname } from 'path';
      import { fileURLToPath } from 'url';
      const __dirname = dirname(fileURLToPath(import.meta.url));
    `,
    },
  })
  .catch(() => process.exit(1));
