<script setup lang="ts">
import { ref, useSlots, computed, type VNode, Comment, watch } from "vue";

const props = defineProps<{
    modelValue: number | undefined;
    disabled?: boolean;
}>();

const emit = defineEmits(["update:modelValue", "change"]);
const slots = useSlots();

const getValidChildren = () => {
    const children = slots.default?.() || [];
    const flattened: VNode[] = [];
    children.forEach((c) => {
        if (c.type.toString() === "Symbol(v-fgt)") {
            if (Array.isArray(c.children)) flattened.push(...(c.children as VNode[]));
        } else if (c.type !== Comment) {
            flattened.push(c);
        }
    });
    return flattened;
};

const total = computed(() => getValidChildren().length);

const viewIndex = ref(props.modelValue || 0);
console.log(props.modelValue, viewIndex.value);
const direction = ref(1);

watch(
    () => props.modelValue,
    (newVal) => {
        if (typeof newVal === "number" && newVal !== viewIndex.value) {
            const safeVal = Math.max(0, Math.min(total.value - 1, newVal));
            direction.value = safeVal > viewIndex.value ? 1 : -1;
            viewIndex.value = safeVal;
        }
    }
);

const updateView = (newIndex: number) => {
    if (props.disabled || total.value === 0) return;

    let target = newIndex;
    if (newIndex < 0) target = total.value - 1;
    if (newIndex >= total.value) target = 0;

    direction.value = target > viewIndex.value ? 1 : -1;
    if (viewIndex.value === total.value - 1 && target === 0) direction.value = 1;
    if (viewIndex.value === 0 && target === total.value - 1) direction.value = -1;

    viewIndex.value = target;
    if (props.modelValue != undefined) {
        emit("update:modelValue", viewIndex.value);
        emit("change", viewIndex.value);
    }
};

const toggleSelect = () => {
    if (props.disabled) return;

    const isSelected = props.modelValue === viewIndex.value;
    const nextValue = isSelected ? undefined : viewIndex.value;

    emit("update:modelValue", nextValue);
    emit("change", nextValue);
};

const touchStartX = ref(0);
const onTouchStart = (e: TouchEvent) => {
    touchStartX.value = e.touches[0]!.clientX;
};
const onTouchEnd = (e: TouchEvent) => {
    const deltaX = e.changedTouches[0]!.clientX - touchStartX.value;
    if (Math.abs(deltaX) > 40) {
        deltaX > 0 ? updateView(viewIndex.value - 1) : updateView(viewIndex.value + 1);
    }
};
</script>

<template>
    <div class="flex items-center gap-2 w-full h-full font-[inherit] select-none">
        <button
            type="button"
            @click="updateView(viewIndex - 1)"
            :disabled="disabled || total <= 1"
            class="size-9 flex-none flex items-center justify-center rounded-full border-2 border-miku/20 text-miku-dark dark:text-miku hover:bg-miku hover:text-white transition-all active:scale-90 disabled:opacity-10 cursor-pointer"
        >
            <i class="icon-chevron-left"></i>
        </button>

        <div
            class="flex-1 h-full relative overflow-hidden bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-3xl border-2 transition-all duration-300"
            :class="[
                modelValue === viewIndex
                    ? 'border-miku shadow-[0_0_15px_rgba(57,197,187,0.4)]'
                    : 'border-miku/10 hover:border-miku/30'
            ]"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd"
        >
            <Transition
                :name="direction > 0 ? 'miku-slide-right' : 'miku-slide-left'"
                leave-active-class="transition duration-200 absolute inset-0"
            >
                <div
                    :key="viewIndex"
                    @click="toggleSelect"
                    class="w-full h-full flex items-center justify-center p-4 cursor-pointer"
                >
                    <component :is="getValidChildren()[viewIndex]" />
                </div>
            </Transition>

            <Transition name="miku-pop">
                <div
                    v-if="modelValue === viewIndex"
                    class="absolute top-3 right-3 size-5 bg-miku text-white rounded-full flex items-center justify-center shadow-sm"
                >
                    <i class="icon-check text-[10px] font-bold"></i>
                </div>
            </Transition>

            <div
                v-if="total > 1"
                class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none"
            >
                <div
                    v-for="(_, i) in total"
                    :key="i"
                    class="size-1.5 rounded-full transition-all duration-300"
                    :class="i === viewIndex ? 'w-4 bg-miku' : 'bg-miku/20'"
                ></div>
            </div>
        </div>

        <button
            type="button"
            @click="updateView(viewIndex + 1)"
            :disabled="disabled || total <= 1"
            class="size-9 flex-none flex items-center justify-center rounded-full border-2 border-miku/20 text-miku-dark dark:text-miku hover:bg-miku hover:text-white transition-all active:scale-90 disabled:opacity-10 cursor-pointer"
        >
            <i class="icon-chevron-right"></i>
        </button>
    </div>
</template>

<style scoped>
.miku-slide-right-enter-active,
.miku-slide-right-leave-active,
.miku-slide-left-enter-active,
.miku-slide-left-leave-active {
    transition: all 0.3s cubic-bezier(0.2, 1, 0.3, 1);
}
.miku-slide-right-enter-from {
    opacity: 0;
    transform: translateX(30px);
}
.miku-slide-right-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
.miku-slide-left-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}
.miku-slide-left-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

/* 选中勾号的小动画 */
.miku-pop-enter-active {
    transition: all 0.2s ease-out;
}
.miku-pop-enter-from {
    opacity: 0;
    transform: scale(0.5) rotate(-45deg);
}
</style>
