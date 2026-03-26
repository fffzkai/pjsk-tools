<script setup lang="ts">
import EffectLink from "@/components/effects/effect-link.vue";
import { isDark, toggleDark } from "@/utils/theme.ts";
import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline";
import aJump from "@/utils/a-jump.ts";
</script>

<template>
    <nav
        class="fixed top-0 w-full z-100 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 h-18 transition-colors duration-300"
    >
        <div class="container mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
            <!-- Left -->
            <div class="flex items-center gap-4">
                <EffectLink
                    href="/"
                    class="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <div
                        class="h-10 w-[6.1rem] bg-miku transition-colors"
                        style="
                            mask-image: url(https://assets.exmeaning.com/SnowyBot/logo.svg);
                            mask-size: contain;
                            mask-position: center;
                            mask-repeat: no-repeat;
                            -webkit-mask-image: url(https://assets.exmeaning.com/SnowyBot/logo.svg);
                            -webkit-mask-size: contain;
                            -webkit-mask-position: center;
                            -webkit-mask-repeat: no-repeat;
                        "
                    ></div>
                    <span
                        class="px-2 py-1 rounded bg-miku/10 text-miku text-[10px] font-bold tracking-widest uppercase border border-miku/20 shadow-sm leading-none opacity-80 group-hover:opacity-100 transition-opacity"
                    >
                        tools
                    </span>
                </EffectLink>
            </div>

            <!-- Right -->
            <div class="flex items-center gap-3">
                <button
                    @click="aJump.toUrl('/learning')"
                    class="p-1 rounded-full bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 border border-transparent dark:border-slate-700/50"
                    aria-label="Learn"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        class="size-7"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                    </svg>
                </button>

                <button
                    @click="aJump.toUrl('https://github.com/Bluemangoo/pjsk-tools')"
                    class="rounded-full bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 border border-transparent dark:border-slate-700/50"
                    aria-label="Learn"
                >
                    <i class="icon-github-light dark:icon-github-dark size-7" />
                </button>
                <!-- Theme Toggle Button -->
                <button
                    @click="toggleDark"
                    class="p-2 rounded-full bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 border border-transparent dark:border-slate-700/50"
                    aria-label="Toggle Dark Mode"
                >
                    <SunIcon v-if="!isDark" class="h-5 w-5" />
                    <MoonIcon v-else class="h-5 w-5" />
                </button>
            </div>
        </div>
    </nav>
</template>

<style scoped></style>
