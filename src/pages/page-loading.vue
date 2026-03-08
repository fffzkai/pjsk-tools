<script setup lang="ts">
// TODO: 换成 moe 的加载动画
import { onMounted, onUnmounted, ref } from "vue";

let interval: NodeJS.Timeout | undefined = undefined;
const timeout = ref(false);

function reload() {
    location.reload();
}

onMounted(() => {
    interval = setInterval(() => {
        timeout.value = true;
        clearInterval(interval);
        interval = undefined;
    }, 10000);
});

onUnmounted(() => {
    if (interval) {
        clearInterval(interval);
        interval = undefined;
    }
});
</script>

<template>
    <div class="w-full flex flex-col">
        <div class="h-[40vh] w-full flex flex-col">
            <div class="size-full" />
            <div class="mx-auto">
                <span class="text-2xl font-bold">Loading</span>
                <br />
                <span class="text-gray-500">请稍等</span>
            </div>
        </div>
        <div v-if="timeout" class="mt-4 mx-auto">
            <span>加载时间过长，请尝试 </span>
            <span @click="reload" role="button" class="text-green-600 hover:text-green-500">
                刷新
            </span>
        </div>
    </div>
</template>

<style scoped></style>
