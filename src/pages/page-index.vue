<script setup lang="ts">
import CardShortcut from "@/components/containers/card-shortcut.vue";
import EffectLink from "@/components/effects/effect-link.vue";
import ContainerPageIndex from "@/components/containers/container-page-index.vue";
import PartH2 from "@/components/parts/part-h2.vue";
</script>

<template>
    <ContainerPageIndex>
        <!-- Logo -->
        <div class="flex flex-col items-center gap-4">
            <h1 class="hidden">Moesekai tools</h1>
            <div class="flex flex-col items-center justify-center gap-2">
                <div class="flex flex-row">
                    <div
                        class="h-16 w-64 sm:h-20 sm:w-80 lg:h-24 lg:w-96 bg-linear-to-r from-miku to-miku-dark transition-all hover:brightness-110"
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
                        role="img"
                        aria-label="Moesekai"
                    ></div>
                    <div class="text-2xl text-miku">tools</div>
                    <!-- TODO: 本站单独的 icon -->
                </div>
            </div>
            <EffectLink
                class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm sm:text-base font-bold transition-all hover:bg-blue-100 hover:scale-105 duration-300 shadow-sm"
                href="https://pjsk.moe/"
                ><span class="flex h-2 w-2 rounded-full bg-blue-400"></span
                ><span
                    >去往主站
                    <span class="underline decoration-1 underline-offset-2 decoration-blue-300"
                        >pjsk.moe</span
                    ></span
                ></EffectLink
            >
        </div>

        <div class="w-full max-w-5xl">
            <PartH2>全部工具</PartH2>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <EffectLink href="/tools/1an-collection">
                    <CardShortcut>
                        <template #label>1 周年集章</template>
                        <template #subLabel>1st Anniversary Collection</template>
                    </CardShortcut>
                </EffectLink>
            </div>
        </div>
    </ContainerPageIndex>
</template>

<style scoped></style>
