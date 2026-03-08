import { type Route, routeNotFound, routes } from "./route.ts";
import { type Component, type ShallowRef, shallowRef } from "vue";
import PageRedirect from "@/pages/page-redirect.vue";
import { removeTrail } from "./string.ts";

class AJump {
    url: string = window.location.pathname + window.location.search;
    path: string = window.location.pathname;
    component: ShallowRef<Component>;
    title: string = "";

    constructor() {
        let url = this.url;
        let path = this.path;
        let r = this.getRoute(path);
        while (r.type == "redirect") {
            url = r.url;
            path = url.split("?")[0] || "/";
            // noinspection HttpUrlsUsage
            if (url.startsWith("http://") || url.startsWith("https://")) {
                window.location.replace(url);
            }

            r = this.getRoute(path);
        }
        this.title = this.getTitle(r);
        this.component = shallowRef(r.component);
        if (this.url != url) {
            this.url = url;
            window.history.replaceState("", "", this.url);
        }

        const that = this;
        document.body.addEventListener("click", function (event) {
            const target = <HTMLElement>event.target;
            const a = target.closest("a");
            if (a && a.target != "_blank") {
                event.preventDefault();
                that.to(a);
            }
        });

        window.addEventListener("popstate", function () {
            that.url = window.location.pathname + window.location.search;
            that.path = window.location.pathname;
            that.update();
        });
    }

    to(element: HTMLAnchorElement) {
        const url = element.getAttribute("href");
        if (!url) {
            return;
        }
        this.toUrl(url);
    }

    toUrl(url: string, redirect: boolean = false) {
        // noinspection HttpUrlsUsage
        if (url.startsWith("http://") || url.startsWith("https://")) {
            window.open(url);
        } else {
            if (url.startsWith("?")) {
                url = window.location.pathname + url;
            }
            if (url.startsWith(".")) {
                url = window.location.pathname + url.substring(1);
            }
            if (redirect) {
                window.history.replaceState("", "", url);
            } else {
                window.history.pushState("", "", url);
            }
            this.url = url;
            this.path = url.split("?")[0] || "/";
            this.update();
        }
    }

    update() {
        this.updateComponent(this.url);
    }

    protected getRoute(url: string): Route {
        for (const route of routes) {
            if (route.path instanceof RegExp) {
                if (route.path.test(url)) {
                    return route;
                }
            } else {
                if (url == route.path || removeTrail(url, "/") == route.path) {
                    return route;
                }
            }
        }
        return routeNotFound as Route;
    }

    protected getTitle(route: {
        type: "page";
        path: string | RegExp;
        component: Component;
        title: string | (() => string);
    }): string {
        return typeof route.title === "function" ? route.title() : route.title;
    }

    protected updateComponent(url: string): void {
        let r = this.getRoute(this.path);
        while (r.type == "redirect") {
            url = r.url;
            const path = url.split("?")[0] || "/";
            // noinspection HttpUrlsUsage
            if (url.startsWith("http://") || url.startsWith("https://")) {
                this.title = makeTitle("正在重定向")();
                this.component.value = PageRedirect;
                window.location.replace(url);
                return;
            }
            r = this.getRoute(path);
        }
        this.title = this.getTitle(r);
        document.title = this.title;
        this.component.value = r.component;
        if (this.url != url) {
            this.url = url;
            window.history.replaceState("", "", this.url);
        }
    }
}

const aJump = new AJump();
export default aJump;

export function makeTitle(k: string): () => string {
    return () => k + " | PJSK Tools"; // TODO: site name
}
