<script setup lang="ts">
import EffectLink from "@/components/effects/effect-link.vue";
</script>

<template>
    <nav
        class="fixed top-0 w-full z-100 bg-white/95 backdrop-blur-lg border-b border-slate-200 h-18"
    >
        <div class="container mx-auto px-6 h-full flex items-center justify-between">
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
                    <sup class="text-miku">
                        tools
                    </sup>
                </EffectLink>
            </div>

            <!-- Right -->
            <div class="flex items-center gap-1" />
        </div>
    </nav>
</template>

<style scoped></style>
