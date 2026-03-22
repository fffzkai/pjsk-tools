import type { Component } from "vue";
import PageIndex from "@/pages/page-index.vue";
import PageNotFound from "@/pages/page-not-found.vue";
import Page1an from "@/pages/page-1an.vue";
import { makeTitle } from "@/utils/a-jump.ts";
import PageLearning from "@/pages/page-learning.vue";

export type Route =
    | {
          type: "page";
          path: string | RegExp;
          component: Component;
          title: string | (() => string);
      }
    | {
          type: "redirect";
          path: string | RegExp;
          url: string;
      };

export const routeNotFound = {
    type: "page",
    path: "/404",
    requireLogin: false,
    component: PageNotFound,
    title: makeTitle("title.404")
};

export const routes: Route[] = [
    routeNotFound as Route,
    {
        type: "page",
        path: "/",
        component: PageIndex,
        title: "Moesekai Tools"
    },
    {
        type: "page",
        path: "/learning",
        component: PageLearning,
        title: "使用教程"
    },
    {
        type: "page",
        path: "/tools/1an-collection",
        component: Page1an,
        title: "1 周年集章活动"
    }
];
