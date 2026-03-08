<script setup lang="ts">
import ContainerPageBase from "@/components/containers/container-page-base.vue";
</script>

<template>
    <ContainerPageBase>
        <div
            class="container mx-auto px-6 py-20 flex flex-col items-center gap-12 text-center"
        >
            <slot />
        </div>
    </ContainerPageBase>
</template>

<style scoped></style>
