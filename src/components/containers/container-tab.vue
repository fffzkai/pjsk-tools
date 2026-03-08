<script setup lang="ts">
import { computed } from "vue";

interface Tab {
    key: string;
    label: string;
}

const props = defineProps<{
    tabs: Tab[];
    modelValue: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const activeIndex = computed(() => props.tabs.findIndex((t) => t.key === props.modelValue));

const selectTab = (key: string) => {
    emit("update:modelValue", key);
};
</script>

<template>
    <div class="w-full flex flex-col items-center">
        <nav
            class="sticky top-6 z-50 p-1 flex items-center bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-miku/20 rounded-full shadow-sm"
        >
            <div class="relative flex items-center">
                <div
                    class="absolute h-full transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] bg-miku rounded-full shadow-sm"
                    :style="{
                        width: `${100 / tabs.length}%`,
                        transform: `translateX(${activeIndex * 100}%)`
                    }"
                />

                <button
                    v-for="tab in tabs"
                    :key="tab.key"
                    @click="selectTab(tab.key)"
                    class="relative z-10 flex-1 h-full px-5 py-1.5 text-sm font-semibold transition-colors duration-200 rounded-full cursor-pointer flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap overflow-hidden"
                    :class="
                        modelValue === tab.key
                            ? 'text-white'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-miku-dark'
                    "
                >
                    <span class="flex items-center flex-row w-max" v-html="tab.label"></span>
                </button>
            </div>
        </nav>

        <div class="w-full mt-8">
            <div v-for="tab in tabs" :key="tab.key">
                <Transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="opacity-0 translate-y-1"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="hidden"
                >
                    <div v-show="modelValue === tab.key" class="w-full">
                        <slot :name="tab.key" />
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<style></style>
