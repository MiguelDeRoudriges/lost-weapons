export default [
  {
    path: "/",
    component: () => import("./pages/index.vue"),
  },
  {
    path: "/search",
    component: () => import("./pages/search.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("./pages/404.vue"),
    name: "NotFound",
    meta: {
      layout: "empty",
    },
  },
];
