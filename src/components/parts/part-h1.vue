<script setup lang="ts"></script>

<template>
    <div class="text-center mb-8">
        <template v-if="$slots.tag">
            <div
                class="inline-flex items-center gap-2 px-4 py-2 border border-miku/30 bg-miku/5 rounded-full mb-4"
            >
                <span class="text-miku text-xs font-bold tracking-widest uppercase">
                    <slot name="tag" />
                </span>
            </div>
        </template>
        <template v-if="$slots.title">
            <h1 class="text-3xl sm:text-4xl font-black text-primary-text">
                <slot name="title" />
            </h1>
        </template>
        <template v-if="$slots.subtitle">
            <p class="text-slate-500 mt-2 max-w-2xl mx-auto">
                <slot name="subtitle" />
            </p>
        </template>
    </div>
</template>

<style scoped></style>
