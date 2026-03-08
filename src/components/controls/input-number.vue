<script setup lang="ts">
import { ref, watch, computed } from "vue";

interface Props {
    modelValue: number;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    disabled?: boolean;
    placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
    min: -Infinity,
    max: Infinity,
    step: 1,
    precision: 0,
    disabled: false,
    placeholder: "0"
});

const emit = defineEmits(["update:modelValue", "change"]);

const innerStr = ref(props.modelValue.toString());

watch(
    () => props.modelValue,
    (newVal) => {
        if (parseFloat(innerStr.value) !== newVal) {
            innerStr.value = newVal.toString();
        }
        validateAndSync();
    }
);

const filterInvalid = (val: string) => {
    const match = val.match(/^-?\d*\.?\d*/);
    return match ? match[0] : "";
};

const handleInput = (e: Event) => {
    const el = e.target as HTMLInputElement;
    const filtered = filterInvalid(el.value);

    if (el.value !== filtered) {
        el.value = filtered;
    }
    innerStr.value = filtered;

    const num = parseFloat(filtered);
    emit("update:modelValue", isNaN(num) ? 0 : num);
};

const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData?.getData("text") || "";
    const filtered = filterInvalid(text);

    const start = (e.target as HTMLInputElement).selectionStart || 0;
    const end = (e.target as HTMLInputElement).selectionEnd || 0;
    const current = innerStr.value;
    const nextStr = current.substring(0, start) + filtered + current.substring(end);

    const finalFiltered = filterInvalid(nextStr);
    innerStr.value = finalFiltered;

    const num = parseFloat(finalFiltered);
    emit("update:modelValue", isNaN(num) ? 0 : num);
};

const validateAndSync = () => {
    let num = parseFloat(innerStr.value);
    if (isNaN(num)) num = 0;

    num = Math.max(props.min, Math.min(props.max, num));

    const base = isFinite(props.min) ? props.min : 0;
    const gap = Math.round((num - base) / props.step);
    num = base + gap * props.step;

    const finalVal = parseFloat(num.toFixed(props.precision));
    innerStr.value = finalVal.toString();
    emit("update:modelValue", finalVal);
    emit("change", finalVal);
};

const changeStep = (delta: number) => {
    if (props.disabled) return;
    const current = parseFloat(innerStr.value) || 0;
    innerStr.value = (current + delta).toString();
    validateAndSync();
};

const isMin = computed(() => (parseFloat(innerStr.value) || 0) <= props.min);
const isMax = computed(() => (parseFloat(innerStr.value) || 0) >= props.max);
</script>

<template>
    <div
        class="inline-flex items-center p-1 rounded-full border-2 transition-all duration-200 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md w-full h-full font-[inherit]"
        :class="[
            disabled
                ? 'opacity-50 cursor-not-allowed border-zinc-200'
                : 'border-miku/20 focus-within:border-miku shadow-sm'
        ]"
    >
        <button
            type="button"
            @click="changeStep(-step)"
            :disabled="disabled || isMin"
            class="flex h-full aspect-square p-[1%] rounded-full transition-all text-miku-dark dark:text-miku hover:bg-miku hover:text-white active:scale-90 disabled:opacity-20 select-none cursor-pointer items-center justify-center"
        >
            <i class="icon-minus size-full m-0"></i>
        </button>

        <input
            type="text"
            :value="innerStr"
            :disabled="disabled"
            :placeholder="placeholder"
            inputmode="decimal"
            spellcheck="false"
            @input="handleInput"
            @paste="handlePaste"
            @blur="validateAndSync"
            @keydown.enter="validateAndSync"
            class="flex-1 w-0 h-full text-center bg-transparent border-none outline-none text-zinc-700 dark:text-zinc-200 font-[inherit]"
        />

        <button
            type="button"
            @click="changeStep(step)"
            :disabled="disabled || isMax"
            class="flex h-full aspect-square p-[1%] rounded-full transition-all text-miku-dark dark:text-miku hover:bg-miku hover:text-white active:scale-90 disabled:opacity-20 select-none cursor-pointer items-center justify-center"
        >
            <i class="icon-plus size-full m-0"></i>
        </button>
    </div>
</template>

<style scoped></style>
