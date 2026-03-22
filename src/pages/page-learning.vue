<script setup lang="ts">
import ContainerPageContent from "@/components/containers/container-page-content.vue";
import PartH1 from "@/components/parts/part-h1.vue";
import PartH2 from "@/components/parts/part-h2.vue";
import CheckboxGroup from "@/components/controls/checkbox-group.vue";
import { reactive, type Reactive, ref, type Ref } from "vue";
import type { FixedLengthArray } from "@/types/typeConstraints.ts";
import CheckboxSlide from "@/components/controls/checkbox-slide.vue";
import { parseCharaIcon } from "@/utils/icon.ts";
import InputNumber from "@/components/controls/input-number.vue";

const signIn: FixedLengthArray<number, 7> = [5, 10, 5, 5, 5, 5, 10];
const signInRewardList = signIn.map((item, index) => {
    let tooltip = "";
    tooltip += `${item}<i class="icon-jewel" ></i> `;
    return {
        label: `<div class="block"><div><i class="icon-jewel size-16" ></i></div><div class="text-xs font-medium">DAY ${index + 1}</div></div><span
            class="absolute right-2 bottom-6 min-w-5 h-5 px-1.5 bg-miku text-white rounded-full text-[0.65rem] font-bold flex items-center justify-center shadow-md border border-white"
            >${item}</span
        >`,
        value: index,
        tooltip
    };
});
const signDays = ref(0);
const signInRewardSelects: Ref<number[]> = ref([]);
const handleSignInRewardChange = (payload: {
    value: string | number;
    checked: boolean;
    currentList: (string | number)[];
}) => {
    if (payload.value === signDays.value - 1 && !payload.checked) {
        signDays.value = 0;
    } else {
        signDays.value = (payload.value as number) + 1;
    }
    signInRewardSelects.value = [];
    for (let i = 0; i < signDays.value; i++) {
        signInRewardSelects.value.push(i);
    }
};

const stamp: Reactive<(number | undefined)[]> = reactive([]);
const stampCards: {
    description: string;
    level: FixedLengthArray<{ require: string; rewards: number; extra?: string[] }, 3>;
}[] = [
    {
        description: "任务集章卡",
        level: [
            {
                require: "任务 A",
                extra: ["一般会尝试一句话概括任务", "也就是第三张卡那样"],
                rewards: 300
            },
            {
                require: "完成以下任务",
                extra: ["如果无法一句话概括任务的话", "这里是子任务"],
                rewards: 600
            },
            {
                require: "演出 100 次",
                rewards: 900
            }
        ]
    }
];

type exchangeChoice = { count: number; expense: number; limit: number; icon: string };
const exchangeData = {
    jewel: {
        count: 100,
        expense: 1000,
        limit: 5,
        icon: "icon-jewel"
    },
    coin: {
        count: 1,
        expense: 1,
        limit: Infinity,
        icon: "icon-coin"
    }
} satisfies Record<string, exchangeChoice>;
const userExchange = reactive(
    (() => {
        const exchange: { [key: string]: number } = {};
        for (let key in exchangeData) {
            exchange[key] = 0;
        }
        return exchange as { [key in keyof typeof exchangeData]: number };
    })()
);
</script>

<template>
    <ContainerPageContent>
        <PartH1>
            <template #tag>使用教程</template>
            <template #title>计算工具 <span class="text-miku">使用教程</span></template>
            <template #subtitle>本站交互式工具使用介绍</template>
        </PartH1>

        <PartH2>签到</PartH2>
        <div class="mb-5">
            签到组件点击第 N 天即选择签到 N 天，再次点击取消选择（即一天都不签）。
        </div>
        <CheckboxGroup
            v-model="signInRewardSelects"
            :options="signInRewardList"
            @change="handleSignInRewardChange"
        ></CheckboxGroup>
        <div class="mb-5"></div>
        <PartH2>集章卡</PartH2>
        <div class="mb-5">
            集章卡组件可以滑动（触屏）或点击左右按钮切换卡片，点击卡片选中（完成这一张并收集奖励），未选择代表这一组一张都不完成。
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
            <div
                v-for="(cardGroup, cardGroupIndex) in stampCards"
                :key="cardGroupIndex"
                class="bg-white/30 dark:bg-slate-800/30 p-4 rounded-2xl border border-white/40 dark:border-slate-700/50 shadow-sm flex flex-col h-full"
            >
                <div
                    class="ml-2 p-2 text-lg font-bold text-slate-800 dark:text-slate-100 drop-shadow-sm flex-none"
                >
                    {{ cardGroupIndex + 1 }}. {{ cardGroup.description }}
                </div>
                <div class="w-full h-80 sm:h-76 mt-2 px-1 sm:px-2 box-border flex-1">
                    <CheckboxSlide v-model="stamp[cardGroupIndex]">
                        <div
                            v-for="(card, cardIndex) of cardGroup.level"
                            :key="cardIndex"
                            class="flex flex-col gap-3 sm:gap-4 items-center w-full justify-center h-full"
                        >
                            <!-- require text styling -->
                            <div
                                class="flex justify-center font-black text-xl sm:text-2xl text-slate-800 dark:text-slate-100 drop-shadow-sm tracking-wide"
                            >
                                {{ card.require }}
                            </div>

                            <!-- extra tasks list styling -->
                            <ul
                                v-if="card.extra"
                                class="flex flex-col gap-1 sm:gap-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 w-full max-w-md bg-white/50 dark:bg-slate-800/60 px-3 py-2 sm:p-4 rounded-xl border border-white/60 dark:border-slate-600/50 shadow-sm backdrop-blur-sm self-center"
                            >
                                <li
                                    v-for="extra of card.extra"
                                    class="flex items-start gap-2 text-left"
                                >
                                    <div
                                        class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1 sm:mt-1.5 shrink-0"
                                    ></div>
                                    <span class="flex-1 leading-snug">{{ extra }}</span>
                                </li>
                            </ul>

                            <!-- rewards styling -->
                            <div
                                class="flex flex-wrap justify-center items-center gap-1 sm:gap-2 font-bold text-slate-700 dark:text-slate-200 bg-white/60 dark:bg-slate-900/60 px-3 sm:px-4 py-1.5 sm:py-2 mt-1 sm:mt-2 rounded-full border border-white/50 dark:border-slate-700/50 shadow-inner self-center"
                            >
                                <span class="flex items-center ml-1">
                                    <span class="text-blue-400 mr-0.5">{{ card.rewards }}</span
                                    ><i class="icon-jewel drop-shadow-sm" />
                                </span>
                                <span
                                    class="flex items-center ml-1 text-slate-600 dark:text-slate-300"
                                >
                                    <span class="mr-0.5">70</span
                                    ><i class="icon-material15 drop-shadow-sm" />
                                </span>
                            </div>
                        </div>
                    </CheckboxSlide>
                </div>
            </div>
        </div>
        <div class="mb-5" />
        <PartH2>兑换所</PartH2>
        <div class="mb-5">
            <p>点击卡片可以兑换一份，或使用数量输入框控制兑换份数。</p>
            <p>有限制兑换次数的会在下面显示余量。</p>
            <p>显示的数量在未选中时是一份的数量，在选中时是总数量。价格也是一样。</p>
        </div>
        <div class="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-5">
            <button
                v-for="(item, key) in exchangeData"
                :key="key"
                class="flex flex-col items-center justify-center p-3 gap-2 rounded-2xl border-2 transition-all duration-300 active:scale-95 min-w-36 overflow-hidden shadow-sm"
                :class="
                    userExchange[key]! > 0
                        ? 'border-miku bg-miku/10 dark:bg-miku/20 shadow-[0_4px_15px_rgba(51,204,187,0.15)]'
                        : 'bg-white/40 dark:bg-slate-800/40 border-zinc-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-miku/50 dark:hover:border-miku/60'
                "
                @click="userExchange[key]!++"
            >
                <div class="relative drop-shadow-md">
                    <div>
                        <Component
                            v-if="item.icon.startsWith('chara-')"
                            :is="parseCharaIcon(item.icon)"
                            class="size-16"
                        />
                        <i v-else :class="item.icon" class="size-16" />
                    </div>
                    <span
                        class="absolute -right-2 -bottom-2 min-w-6 h-6 px-1.5 bg-miku text-white rounded-full text-xs font-bold flex items-center justify-center shadow-md border-2 border-white dark:border-slate-800"
                        >{{
                            userExchange[key]! > 0
                                ? userExchange[key]! * exchangeData[key]!.count
                                : exchangeData[key]!.count
                        }}</span
                    >
                </div>
                <div
                    class="flex items-center text-sm font-bold text-slate-700 dark:text-slate-200 mt-1 bg-white/50 dark:bg-slate-900/50 px-3 py-1 rounded-full border border-white/30 dark:border-slate-700/30"
                >
                    <i class="icon-eventbadge-shiho1 mr-1 drop-shadow-sm" />
                    {{
                        userExchange[key]! > 0
                            ? userExchange[key]! * exchangeData[key]!.expense
                            : exchangeData[key]!.expense
                    }}
                </div>
                <div class="h-8 w-20 mt-1">
                    <InputNumber
                        v-model="userExchange[key]!"
                        :min="0"
                        :max="exchangeData[key]!.limit"
                        @click.stop
                    />
                </div>
                <div
                    v-if="exchangeData[key]!.limit !== Infinity"
                    class="text-[0.7rem] font-bold text-slate-500 dark:text-slate-400 mt-0.5"
                >
                    余 {{ exchangeData[key]!.limit - userExchange[key]! }}
                </div>
            </button>
        </div>
        <div class="mb-5" />
        <PartH2>右下角浮动气泡</PartH2>
        <div class="mb-5">
            <p>有些页面会在右下角浮动气泡展示某种兑换物的目前拥有量。</p>
            <p>显示的量是获取量减去消耗量。在兑换所消耗了会对应减少的哦。</p>
        </div>

        <div
            class="size-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-slate-100 text-2xl z-50 rounded-full shadow-lg border border-white/50 dark:border-slate-700/50 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-miku/30 dark:hover:shadow-miku/20 active:scale-95 group"
        >
            <div
                class="absolute inset-0 rounded-full bg-linear-to-tr from-miku/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>
            <i
                class="icon-heartpiece-bare size-14 drop-shadow-sm group-hover:drop-shadow-[0_0_8px_rgba(51,204,187,0.5)] transition-all duration-300 relative z-10"
            />
            <span
                class="absolute right-0 bottom-0 min-w-8 h-6 px-2 bg-miku text-white rounded-full text-xs font-bold flex items-center justify-center shadow-md border-2 border-white dark:border-slate-800 z-20"
                >{{ stamp[0] == undefined ? 0 : 70 }}</span
            >
        </div>
        <div class="mb-5" />
        <PartH2>清空选择</PartH2>
        <div class="mb-5">
            <p>如果需要清空所有选择数据，可以寻找“清空选择”的按钮。</p>
            <p>在允许导入导出的情况下，这个按钮一般在导入导出的地方哦。</p>
        </div>
        <div class="mb-5" />
        <PartH2>导入和导出</PartH2>
        <div class="mb-5">
            <p>有些地方支持导入和导出选择情况来分享。</p>
            <p>点击导出按钮可以复制数据到剪切板。</p>
            <p>把数据粘贴到对应的文本框再点击导入就可以加载数据啦。</p>
        </div>
    </ContainerPageContent>
</template>

<style scoped></style>
