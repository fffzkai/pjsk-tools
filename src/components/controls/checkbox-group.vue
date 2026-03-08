<script setup lang="ts">
interface Option {
    label: string;
    value: string | number;
    tooltip?: string;
}

interface ChangeEvent {
    value: string | number;
    checked: boolean;
    currentList: (string | number)[];
}

const props = defineProps<{
    options: Option[];
    modelValue: (string | number)[];
    beforeChange?: (value: string | number, willCheck: boolean) => boolean | Promise<boolean>;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: (string | number)[]): void;
    (e: "change", payload: ChangeEvent): void;
}>();

const isChecked = (value: string | number) => props.modelValue.includes(value);

const handleToggle = async (value: string | number) => {
    const willCheck = !isChecked(value);

    if (props.beforeChange) {
        const shouldProceed = await props.beforeChange(value, willCheck);
        if (shouldProceed === false) return;
    }

    let newList = [...props.modelValue];
    if (willCheck) {
        newList.push(value);
    } else {
        newList = newList.filter((v) => v !== value);
    }

    emit("update:modelValue", newList);
    emit("change", {
        value,
        checked: willCheck,
        currentList: newList
    });
};
</script>

<template>
    <div class="flex flex-wrap gap-3">
        <div v-for="item in options" :key="item.value" class="group relative">
            <div
                v-if="item.tooltip"
                v-html="item.tooltip"
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 bg-zinc-900/90 dark:bg-miku/90 backdrop-blur-md text-white text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none shadow-xl items-center"
            ></div>

            <button
                type="button"
                @click="handleToggle(item.value)"
                class="flex items-center justify-center p-2 rounded-lg border-2 transition-all duration-200 cursor-pointer select-none active:scale-95 min-w-25 overflow-hidden"
                :class="
                    isChecked(item.value)
                        ? 'bg-miku border-miku text-white shadow-[0_4px_12px_rgba(57,197,187,0.3)]'
                        : 'bg-white/40 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-miku/50'
                "
            >
                <span
                    class="relative z-10 flex items-center gap-2 text-sm font-bold"
                    v-html="item.label"
                ></span>

                <Transition
                    enter-active-class="transition duration-300"
                    enter-from-class="opacity-0 scale-50"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition duration-200"
                >
                    <div
                        v-if="isChecked(item.value)"
                        class="absolute inset-0 bg-white/10 pointer-events-none"
                    ></div>
                </Transition>
            </button>
        </div>
    </div>
</template>

<style scoped></style>
