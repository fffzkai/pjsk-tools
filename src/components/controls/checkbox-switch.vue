<script setup lang="ts">
import { computed } from "vue";

interface Props {
    modelValue: boolean;
    disabled?: boolean;
    loading?: boolean;
    beforeChange?: (newValue: boolean) => boolean | Promise<boolean>;
    activeIcon?: string;
    inactiveIcon?: string;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    loading: false
});

const emit = defineEmits(["update:modelValue", "change"]);

const handleToggle = async () => {
    if (props.disabled || props.loading) return;

    const newValue = !props.modelValue;

    if (props.beforeChange) {
        const shouldProceed = await props.beforeChange(newValue);
        if (shouldProceed === false) return;
    }

    emit("update:modelValue", newValue);
    emit("change", newValue);
};
</script>

<template>
    <button
        type="button"
        role="switch"
        :aria-checked="modelValue"
        :disabled="disabled || loading"
        @click="handleToggle"
        class="relative inline-flex items-center cursor-pointer transition-all duration-200 rounded-full border-2 focus:outline-none select-none group size-full"
        :class="[
            modelValue
                ? 'bg-miku border-miku shadow-[0_0_10px_rgba(57,197,187,0.3)]'
                : 'bg-zinc-200 dark:bg-zinc-800 border-transparent',
            disabled || loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
        ]"
    >
        <div
            class="absolute left-0.5 h-[85%] aspect-square bg-white rounded-full shadow-sm transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center text-[10px]"
            :class="[
                modelValue ? 'translate-x-6' : 'translate-x-0',
                loading ? 'animate-pulse' : ''
            ]"
        >
            <Transition name="miku-pop" mode="out-in">
                <i
                    v-if="modelValue && activeIcon"
                    :key="activeIcon"
                    :class="[activeIcon, 'text-miku font-bold']"
                ></i>
                <i
                    v-else-if="!modelValue && inactiveIcon"
                    :key="inactiveIcon"
                    :class="[inactiveIcon, 'text-zinc-400']"
                ></i>
            </Transition>
        </div>
    </button>
</template>

<style scoped>
/* 内部图标微动效 */
.miku-pop-enter-active,
.miku-pop-leave-active {
    transition: all 0.15s ease;
}
.miku-pop-enter-from,
.miku-pop-leave-to {
    opacity: 0;
    transform: scale(0.5);
}

/* 移除移动端点击高亮 */
button {
    -webkit-tap-highlight-color: transparent;
}
</style>
