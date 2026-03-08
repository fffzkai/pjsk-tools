<script setup lang="ts">
interface Props {
    level?: "1" | "2" | "3" | "4" | "5" | "6";
}

const props = withDefaults(defineProps<Props>(), {
    level: "2"
});
const headingTag = `h${props.level}`;
</script>

<template>
    <div class="flex items-center gap-2 mb-6">
        <div class="h-6 w-1 rounded-full bg-miku"></div>
        <component :is="headingTag" class="text-xl font-bold text-primary-text opacity-80">
            <slot />
        </component>
    </div>
</template>

<style scoped></style>
