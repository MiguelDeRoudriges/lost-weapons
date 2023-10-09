import viteSSR, { ClientOnly } from "vite-ssr";
import { createHead } from "@vueuse/head";

import App from "./App.vue";
import routes from "./routes.js";
import "./assets/bootstrap.sass";

export default viteSSR(
  App,
  { routes },
  ({
    app,
    router,
    isClient,
    initialState,
    writeResponse,
    request,
    redirect,
  }) => {
    const head = createHead();
    app.use(head);

    router.beforeResolve(processPrefetchHook);

    app.component(ClientOnly.name, ClientOnly);

    return { head };

    async function processPrefetchHook(to, from, next) {
      try {
        const path = isClient ? to.fullPath : request.originalUrl;
        const hasTrailingSlash = path !== "/" && path?.endsWith("/");
        if (hasTrailingSlash) {
          redirect(path.slice(0, path.length - 1), 301);
        }

        const component = to.matched[0]?.components.default;
        const instance = to.matched[0]?.instances.default;

        if (isClient && initialState && initialState.pageNotFound) {
          throw new Error("404");
        }

        if (!component || !component.prefetch) return next();

        if (!from.href && isClient) {
          component.data = () => ({ ...initialState.pageData });
          return next();
        }

        const result = await component.prefetch({
          app,
          router,
          head,
          initialState,
          to,
          request,
          writeResponse,
          redirect,
        });
        const data = !instance && component.data?.();

        if (instance) {
          Object.assign(instance, result);
        }
        component.data = () => ({ ...data, ...result });

        if (!isClient) initialState.pageData = { ...data, ...result };

        if (component.data().status === 404 && component.components) {
          throw new Error("404");
        }

        next();
      } catch (err) {
        if (err.message === "404") {
          const NotFoundPage = await import("./pages/404.vue");
          to.matched[0].components.default = NotFoundPage.default;
          to.meta.layout = "empty";
        }
        next();
      }
    }
  }
);
