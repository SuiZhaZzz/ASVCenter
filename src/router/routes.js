const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    // component: () => import("layouts/TestLayout.vue"),
    children: [
      { path: "", component: () => import("pages/HomePage.vue") },
      // { path: "", component: () => import("pages/TestSite.vue") },
      {
        path: "/HomePage",
        name: "HomePage",
        component: () => import("pages/HomePage.vue"),
        // component: () => import("pages/TestSite.vue"),
      },
      {
        path: "/SelfNavigation",
        name: "SelfNavigation",
        component: () => import("pages/SelfNavigation.vue"),
        // component: () => import("pages/TestSite.vue"),
      },
      {
        path: "/ScenePerception",
        name: "ScenePerception",
        component: () => import("pages/ScenePerception.vue"),
      },
      {
        path: "/Monitor",
        name: "Monitor",
        component: () => import("pages/Monitor.vue"),
      },
      {
        path: "/WaypointPlan",
        name: "WaypointPlan",
        component: () => import("pages/WaypointPlan.vue"),
      },
      {
        path: "/OlTest",
        name: "OlTest",
        component: () => import("pages/OlTest.vue"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("pages/Login.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
