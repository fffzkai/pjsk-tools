<script setup lang="ts">
import ContainerPageBase from "@/components/containers/container-page-base.vue";
</script>

<template>
    <ContainerPageBase>
        <div class="container mx-auto px-4 sm:px-6 py-8">
            <slot />
        </div>
    </ContainerPageBase>
</template>

<style scoped></style>
