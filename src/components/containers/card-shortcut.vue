<script setup lang="ts">
import CardBase from "@/components/containers/card-base.vue";
</script>

<template>
    <CardBase>
        <template v-if="$slots.icon">
            <div class="transition-transform duration-300 group-hover:scale-110">
                <slot name="icon" />
            </div>
        </template>
        <template v-if="$slots.label || $slots.subLabel">
            <div>
                <template v-if="$slots.label">
                    <h3
                        class="text-lg font-bold text-primary-text group-hover:text-miku transition-colors"
                    >
                        <slot name="label" />
                    </h3>
                </template>
                <template v-if="$slots.subLabel">
                    <p class="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                        <slot name="subLabel" />
                    </p>
                </template>
            </div>
        </template>
    </CardBase>
</template>

<style scoped></style>
