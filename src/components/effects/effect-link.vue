<script setup lang="ts">
defineProps({
    href: {
        type: String,
        required: true
    }
});
</script>

<template>
    <a :href="href" role="button">
        <slot></slot>
    </a>
</template>

<style scoped></style>
