<script setup lang="ts">
import ContainerPageContent from "@/components/containers/container-page-content.vue";
import PartH1 from "@/components/parts/part-h1.vue";
import PartH2 from "@/components/parts/part-h2.vue";
import { computed, type Reactive, reactive, type Ref, ref } from "vue";
import data from "../data/1an/1an-data.ts";
import ContainerTab from "@/components/containers/container-tab.vue";
import CheckboxGroup from "@/components/controls/checkbox-group.vue";
import InputNumber from "@/components/controls/input-number.vue";
import CheckboxSwitch from "@/components/controls/checkbox-switch.vue";
import CheckboxSlide from "@/components/controls/checkbox-slide.vue";
import { parseCharaIcon } from "@/utils/icon.ts";

// vars
const signDays = ref(0);
const gachaFes = ref(0);
const gachaGift = ref(false);
const gachaCostume = ref(false);
const pExchange = reactive(
    (() => {
        const exchange: { [key: string]: number } = {};
        for (let key in data.pExchange) {
            exchange[key] = 0;
        }
        return exchange as { [key in keyof typeof data.pExchange]: number };
    })()
);
const giftExchange = reactive(
    (() => {
        const exchange: { [key: string]: number } = {};
        for (let key in data.giftExchange) {
            exchange[key] = 0;
        }
        return exchange as { [key in keyof typeof data.giftExchange]: number };
    })()
);
const ptExchange = reactive(
    (() => {
        const exchange: { [key: string]: number } = {};
        for (let key in data.ptExchange) {
            exchange[key] = 0;
        }
        return exchange as { [key in keyof typeof data.ptExchange]: number };
    })()
);
const rankP = ref(0);
const mySekai = ref(0);
const stamp: Reactive<(number | undefined)[]> = reactive([]);

// counters
// negative
const pUsedCount = computed(() => {
    let count = 0;

    for (const key1 in data.pExchange) {
        const key = key1 as keyof typeof data.pExchange;
        count += pExchange[key] * data.pExchange[key].expense;
    }

    return count;
});
const giftUsedCount = computed(() => {
    let count = 0;

    for (const key1 in data.giftExchange) {
        const key = key1 as keyof typeof data.giftExchange;
        count += giftExchange[key] * data.giftExchange[key].expense;
    }

    return count;
});
const ptUsedCount = computed(() => {
    let count = 0;

    for (const key1 in data.ptExchange) {
        const key = key1 as keyof typeof data.ptExchange;
        count += ptExchange[key] * data.ptExchange[key].expense;
    }

    return count;
});
const paidJewelUsedCount = computed(() => {
    let count = 0;

    if (gachaGift.value) {
        count += 3000;
    }
    if (gachaCostume.value) {
        count += 3000;
    }
    const stampLevel = stamp[4];
    if (stampLevel == 1) {
        count += 5000 + 1500; // 10选1限定池 + 1种周年set
    }
    if (stampLevel == 2) {
        count += 5000 + 1500 * 2; // 10选1限定池 + 2种周年set
    }

    return count;
});
// positive

const pGotCount = computed(() => {
    let count = 0;

    for (let i = 0; i < signDays.value; i++) {
        count += data.signIn[i]!.p || 0;
    }
    count += gachaFes.value * 2; // n/50*100
    if (gachaGift.value) {
        count += 200;
    }
    if (gachaCostume.value) {
        count += 200;
    }
    count += ptExchange.p * 15;
    count += rankP.value;
    count += mySekai.value;

    for (let i = 0; i < 5; i++) {
        if (stamp[i] == undefined) {
            continue;
        }
        count += data.stamp[i]!.level[stamp[i]!]!.rewards.p || 0;
    }

    return count;
});
const pCount = computed(() => pGotCount.value - pUsedCount.value);
const giftGotCount = computed(() => {
    let count = 0;
    if (gachaGift.value) {
        count += 50;
    }
    return count;
});
const giftCount = computed(() => giftGotCount.value - giftUsedCount.value);
const statistics = computed(() => {
    const map: { [key: string]: { icon: string; count: number } } = {};
    const alias: Record<string, string> = { coinSet: "coin" };
    const ignore: string[] = ["p"];

    let jewel = 0;
    let gacha = 0;
    let drink = 0;
    let heartpiece = 0;

    for (let i = 0; i < signDays.value; i++) {
        jewel += data.signIn[i]!.jewel || 0;
        gacha += data.signIn[i]!.gacha || 0;
    }
    for (let i = 0; i < 5; i++) {
        if (stamp[i] == undefined) {
            continue;
        }
        jewel += data.stamp[i]!.level[stamp[i]!]!.rewards.jewel || 0;
        gacha += data.stamp[i]!.level[stamp[i]!]!.rewards.gacha || 0;
        drink += data.stamp[i]!.level[stamp[i]!]!.rewards.drink || 0;
        heartpiece += 70;
    }

    map["saki"] = {
        icon: "chara-res002_no046_normal,mysterious,3",
        count: 0
    };
    map["rin"] = {
        icon: "chara-res022_no046_normal,mysterious,2",
        count: 0
    };
    map["jewel"] = {
        icon: "icon-jewel",
        count: jewel
    };
    map["specialGacha"] = {
        icon: "icon-gacha-ticket-star4",
        count: 0
    };
    map["gacha"] = {
        icon: "icon-gacha-ticket",
        count: gacha
    };
    map["drinkL"] = {
        icon: "icon-boost-item2",
        count: 0
    };
    map["drink"] = {
        icon: "icon-boost-item1",
        count: drink
    };
    map["heartcrystal"] = {
        icon: "icon-material16",
        count: 0
    };
    map["heartpiece"] = {
        icon: "icon-material15",
        count: heartpiece
    };

    for (const key1 in data.pExchange) {
        const key = key1 as keyof typeof data.pExchange;
        if (ignore.includes(key)) {
            continue;
        }
        const mapK = alias[key] == undefined ? key : alias[key];
        if (map[mapK] == undefined) {
            map[mapK] = {
                icon: data.pExchange[key].icon,
                count: 0
            };
        }
        map[mapK].count += pExchange[key] * data.pExchange[key].count;
    }

    for (const key1 in data.giftExchange) {
        const key = key1 as keyof typeof data.giftExchange;
        if (ignore.includes(key)) {
            continue;
        }
        const mapK = alias[key] == undefined ? key : alias[key];
        if (map[mapK] == undefined) {
            map[mapK] = {
                icon: data.giftExchange[key].icon,
                count: 0
            };
        }
        map[mapK].count += giftExchange[key] * data.giftExchange[key].count;
    }

    for (const key1 in data.ptExchange) {
        const key = key1 as keyof typeof data.ptExchange;
        if (ignore.includes(key)) {
            continue;
        }
        const mapK = alias[key] == undefined ? key : alias[key];
        if (map[mapK] == undefined) {
            map[mapK] = {
                icon: data.ptExchange[key].icon,
                count: 0
            };
        }
        map[mapK].count += ptExchange[key] * data.ptExchange[key].count;
    }

    const result: typeof map = {};
    for (const key in map) {
        if (map[key] && map[key].count > 0) {
            result[key] = map[key];
        }
    }

    return result;
});

// format
const pCountFormatted = computed(() => {
    if (Math.abs(pCount.value) >= 10000000) {
        return (pCount.value / 1000000).toFixed(0) + "M";
    }
    if (Math.abs(pCount.value) >= 1000) {
        return (pCount.value / 1000).toFixed(0) + "K";
    }
    return pCount.value.toString();
});

// page controls
const tabs = [
    { key: "collect", label: '收集<i class="icon-material170" ></i>' },
    { key: "exchangeP", label: '<i class="icon-material170" ></i>兑换所' },
    { key: "exchangeGift", label: '<i class="icon-material171" ></i>兑换所' },
    { key: "exchangeBadge", label: '<i class="icon-eventbadge-shiho3" ></i>兑换所' },
    { key: "materials", label: "资源统计" }
];
const activeTab = ref(tabs[0]!.key);

const signInRewardList = data.signIn.map((item, index) => {
    let tooltip = "";
    if (item.p) {
        tooltip += `${item.p}<i class="icon-material170" ></i> `;
    }
    if (item.jewel) {
        tooltip += `${item.jewel}<i class="icon-jewel" ></i> `;
    }
    if (item.gacha) {
        tooltip += `${item.gacha}<i class="icon-gacha-ticket" ></i> `;
    }
    return {
        label: `<div class="block"><div><i class="icon-material170 size-16" ></i></div><div class="text-xs font-medium">DAY ${index + 1}</div></div><span
            class="absolute right-2 bottom-6 min-w-5 h-5 px-1.5 bg-miku text-white rounded-full text-[0.65rem] font-bold flex items-center justify-center shadow-md border border-white"
            >${item.p || 0}</span
        >`,
        value: index,
        tooltip
    };
});
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
const signInRewards = computed(() => {
    const count = {
        p: 0,
        gacha: 0,
        jewel: 0
    };
    for (let i = 0; i < signDays.value; i++) {
        count.p += data.signIn[i]!.p || 0;
        count.gacha += data.signIn[i]!.gacha || 0;
        count.jewel += data.signIn[i]!.jewel || 0;
    }
    return count;
});
</script>

<template>
    <ContainerPageContent>
        <PartH1>
            <template #tag>活动攻略</template>
            <template #title>1 周年集章 <span class="text-miku">活动攻略</span></template>
            <template #subtitle>世界碎片完全攻略</template>
        </PartH1>

        <ContainerTab v-model="activeTab" :tabs="tabs">
            <template #collect>
                <h2 class="hidden">收集世界碎片</h2>
                <div class="inline-flex text-miku mb-5">✨ 点按选择或操控控件选择收集途径</div>
                <PartH2 level="3"> 登录奖励 </PartH2>
                <CheckboxGroup
                    v-model="signInRewardSelects"
                    :options="signInRewardList"
                    @change="handleSignInRewardChange"
                ></CheckboxGroup>
                <div class="my-4 flex items-center">
                    共计 {{ signInRewards.p }} <i class="icon-material170 mr-3"></i>
                    {{ signInRewards.jewel }} <i class="icon-jewel mr-3"></i>
                    {{ signInRewards.gacha }}
                    <i class="icon-gacha-ticket"></i>
                </div>
                <PartH2 level="3"> 卡池获取 </PartH2>
                <div class="flex flex-row items-center">
                    <i class="icon-gacha-banner704 w-60 h-28" />
                    <div class="m-5 flex flex-col gap-3">
                        <div class="flex items-center">
                            每满 50 抽 → 100<i class="icon-material170" />，无上限
                        </div>
                        <div class="flex flex-row items-center w-max">
                            <div class="h-8 min-w-24 mr-2">
                                <InputNumber v-model="gachaFes" :min="0" :step="50" />
                            </div>
                            → {{ gachaFes * 2 }}
                            <i class="icon-material170" />
                        </div>
                    </div>
                </div>
                <div class="flex flex-row items-center">
                    <i class="icon-gacha-banner710 w-60 h-28" />
                    <div class="m-5 flex flex-col gap-3">
                        <div class="flex items-center">
                            3000 付费<i class="icon-jewel" /> → 200<i class="icon-material170" /> +
                            50<i class="icon-material171" />
                        </div>
                        <div class="flex flex-row items-center gap-3 w-max">
                            我要抽！
                            <div class="h-6 w-12 my-auto">
                                <CheckboxSwitch v-model="gachaGift" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-row items-center">
                    <i class="icon-gacha-banner705 w-60 h-28" />
                    <div class="m-5 flex flex-col gap-3">
                        <div class="flex items-center">
                            3000 付费<i class="icon-jewel" /> → 200<i class="icon-material170" />
                        </div>
                        <div class="flex flex-row items-center gap-3 w-max">
                            我要抽！
                            <div class="h-6 w-12 my-auto">
                                <CheckboxSwitch v-model="gachaCostume" />
                            </div>
                        </div>
                    </div>
                </div>
                <PartH2 level="3"> 活动兑换所 </PartH2>
                <div class="inline-flex text-miku mb-5">✨ 本节与兑换所选项卡保持同步</div>
                <div class="flex items-center">
                    5000 <i class="icon-eventbadge-shiho3" /> → 15<i
                        class="icon-material170"
                    />，限15次
                </div>
                <div class="flex flex-row items-center my-5">
                    <div class="h-8 min-w-24 mr-2">
                        <InputNumber v-model="ptExchange.p" :min="0" :max="15" />
                    </div>
                    * 5000
                    <i class="icon-eventbadge-shiho3" /> → {{ ptExchange.p * 15 }}
                    <i class="icon-material170" />
                </div>
                <PartH2 level="3"> 烤森挖矿 </PartH2>

                <div class="flex items-center">
                    挖矿（所有种类） 每个矿石有概率获得 0～1个 <i class="icon-material170" />
                </div>
                <div class="flex flex-row items-center my-5">
                    <div class="h-8 min-w-24 mr-2">
                        <InputNumber v-model="mySekai" :min="0" />
                    </div>
                    <i class="icon-material170" />
                </div>
                <PartH2 level="3"> 集章任务 </PartH2>
                <div class="inline-flex text-miku mb-5">✨ 点按以选择</div>
                <div class="flex flex-col gap-5">
                    <div v-for="(cardGroup, cardGroupIndex) in data.stamp" :key="cardGroupIndex">
                        <div class="ml-10 p-4 text-lg font-bold text-miku">
                            {{ cardGroupIndex + 1 }}. {{ cardGroup.description }}
                        </div>
                        <div class="w-160 h-80">
                            <CheckboxSlide v-model="stamp[cardGroupIndex]">
                                <div
                                    v-for="(card, cardIndex) of cardGroup.level"
                                    :key="cardIndex"
                                    class="flex flex-col gap-3"
                                >
                                    <div class="flex justify-center">
                                        {{ card.require }}
                                    </div>
                                    <ul v-if="card.extra" class="list-disc text-sm text-gray-500">
                                        <li v-for="extra of card.extra">
                                            {{ extra }}
                                        </li>
                                    </ul>
                                    <div class="flex justify-center">
                                        <span v-if="card.rewards.p">
                                            {{ card.rewards.p }}<i class="icon-material170" />
                                        </span>
                                        <span v-if="card.rewards.jewel">
                                            {{ card.rewards.jewel }}<i class="icon-jewel" />
                                        </span>
                                        <span v-if="card.rewards.gacha">
                                            {{ card.rewards.gacha }}<i class="icon-gacha-ticket" />
                                        </span>
                                        <span v-if="card.rewards.drink">
                                            {{ card.rewards.drink }}<i class="icon-boost-item1" />
                                        </span>
                                        <span> 70<i class="icon-material15" /> </span>
                                    </div>
                                </div>
                            </CheckboxSlide>
                        </div>
                    </div>
                </div>
            </template>

            <template #exchangeP>
                <h2 class="hidden">世界碎片兑换所</h2>
                <TransitionGroup name="yslide">
                    <div v-if="pCount < 0" class="flex -mt-3 w-full h-13 absolute left-0">
                        <div
                            class="mx-auto p-2 border-miku text-red-400 font-bold border-2 rounded-lg"
                        >
                            <i class="icon-material170" /> 获取量小于消耗量！
                        </div>
                    </div>
                    <div class="mt-2 mb-8">
                        共获得 {{ pGotCount }} <i class="icon-material170" /> 消耗 {{ pUsedCount }}
                        <i class="icon-material170" />
                    </div>
                    <div class="flex flex-wrap gap-5">
                        <button
                            v-for="(item, key) in data.pExchange"
                            :key="key"
                            class="flex flex-col items-center justify-center p-2 gap-1 rounded-lg border-2 transition-all duration-200 active:scale-95 min-w-25 overflow-hidden"
                            :class="
                                pExchange[key]! > 0
                                    ? 'border-miku bg-miku/10'
                                    : 'bg-white/40 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-miku/50'
                            "
                            @click="pExchange[key]!++"
                        >
                            <div class="relative">
                                <div>
                                    <Component
                                        v-if="item.icon.startsWith('chara-')"
                                        :is="parseCharaIcon(item.icon)"
                                        class="size-16"
                                    />
                                    <i v-else :class="item.icon" class="size-16" />
                                </div>
                                <span
                                    class="absolute right-2 bottom-2 min-w-5 h-5 px-1.5 bg-miku text-white rounded-full text-[0.65rem] font-bold flex items-center justify-center shadow-md border border-white"
                                    >{{
                                        pExchange[key]! > 0
                                            ? pExchange[key]! * data.pExchange[key]!.count
                                            : data.pExchange[key]!.count
                                    }}</span
                                >
                            </div>
                            <div class="flex items-center text-sm">
                                <i class="icon-material170" />
                                {{
                                    pExchange[key]! > 0
                                        ? pExchange[key]! * data.pExchange[key]!.expense
                                        : data.pExchange[key]!.expense
                                }}
                            </div>
                            <div class="h-8 w-20">
                                <InputNumber
                                    v-model="pExchange[key]!"
                                    :min="0"
                                    :max="data.pExchange[key]!.limit"
                                    @click.stop
                                />
                            </div>
                        </button>
                    </div>
                </TransitionGroup>
            </template>

            <template #exchangeGift>
                <h2 class="hidden">礼物券兑换所</h2>
                <TransitionGroup name="yslide">
                    <div v-if="giftCount < 0" class="flex -mt-3 w-full h-13 absolute left-0">
                        <div
                            class="mx-auto p-2 border-miku text-red-400 font-bold border-2 rounded-lg"
                        >
                            <i class="icon-material171" /> 获取量小于消耗量！
                        </div>
                    </div>
                    <div class="mt-2 mb-8">
                        共获得 {{ giftGotCount }} <i class="icon-material171" /> 消耗
                        {{ giftUsedCount }}
                        <i class="icon-material171" />
                    </div>
                    <div class="flex flex-wrap gap-5">
                        <button
                            v-for="(item, key) in data.giftExchange"
                            :key="key"
                            class="flex flex-col items-center justify-center p-2 gap-1 rounded-lg border-2 transition-all duration-200 active:scale-95 min-w-25 overflow-hidden"
                            :class="
                                giftExchange[key]! > 0
                                    ? 'border-miku bg-miku/10'
                                    : 'bg-white/40 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-miku/50'
                            "
                            @click="giftExchange[key]!++"
                        >
                            <div class="relative">
                                <div>
                                    <Component
                                        v-if="item.icon.startsWith('chara-')"
                                        :is="parseCharaIcon(item.icon)"
                                        class="size-16"
                                    />
                                    <i v-else :class="item.icon" class="size-16" />
                                </div>
                                <span
                                    class="absolute right-2 bottom-2 min-w-5 h-5 px-1.5 bg-miku text-white rounded-full text-[0.65rem] font-bold flex items-center justify-center shadow-md border border-white"
                                    >{{
                                        giftExchange[key]! > 0
                                            ? giftExchange[key]! * data.giftExchange[key]!.count
                                            : data.giftExchange[key]!.count
                                    }}</span
                                >
                            </div>
                            <div class="flex items-center text-sm">
                                <i class="icon-material171" />
                                {{
                                    giftExchange[key]! > 0
                                        ? giftExchange[key]! * data.giftExchange[key]!.expense
                                        : data.giftExchange[key]!.expense
                                }}
                            </div>
                            <div class="h-8 w-20">
                                <InputNumber
                                    v-model="giftExchange[key]!"
                                    :min="0"
                                    :max="data.giftExchange[key]!.limit"
                                    @click.stop
                                />
                            </div>
                        </button>
                    </div>
                </TransitionGroup>
            </template>

            <template #exchangeBadge>
                <h2 class="hidden">活动徽章兑换所</h2>
                <TransitionGroup name="yslide">
                    <div class="mt-2 mb-8">
                        共消耗 {{ ptUsedCount }}
                        <i class="icon-eventbadge-shiho3" />
                    </div>
                    <div class="flex flex-wrap gap-5">
                        <button
                            v-for="(item, key) in data.ptExchange"
                            :key="key"
                            class="flex flex-col items-center justify-center p-2 gap-1 rounded-lg border-2 transition-all duration-200 active:scale-95 min-w-25 overflow-hidden"
                            :class="
                                ptExchange[key]! > 0
                                    ? 'border-miku bg-miku/10'
                                    : 'bg-white/40 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-miku/50'
                            "
                            @click="ptExchange[key]!++"
                        >
                            <div class="relative">
                                <div>
                                    <Component
                                        v-if="item.icon.startsWith('chara-')"
                                        :is="parseCharaIcon(item.icon)"
                                        class="size-16"
                                    />
                                    <i v-else :class="item.icon" class="size-16" />
                                </div>
                                <span
                                    class="absolute right-2 bottom-2 min-w-5 h-5 px-1.5 bg-miku text-white rounded-full text-[0.65rem] font-bold flex items-center justify-center shadow-md border border-white"
                                    >{{
                                        ptExchange[key]! > 0
                                            ? ptExchange[key]! * data.ptExchange[key]!.count
                                            : data.ptExchange[key]!.count
                                    }}</span
                                >
                            </div>
                            <div class="flex items-center text-sm">
                                <i class="icon-eventbadge-shiho3" />
                                {{
                                    ptExchange[key]! > 0
                                        ? ptExchange[key]! * data.ptExchange[key]!.expense
                                        : data.ptExchange[key]!.expense
                                }}
                            </div>
                            <div class="h-8 w-20">
                                <InputNumber
                                    v-model="ptExchange[key]!"
                                    :min="0"
                                    :max="data.ptExchange[key]!.limit"
                                    @click.stop
                                />
                            </div>
                        </button>
                    </div>
                </TransitionGroup>
            </template>

            <template #materials>
                <h2 class="hidden">资源统计</h2>
                <PartH2 level="3">兑换物</PartH2>
                <div class="mt-2 mb-4">
                    共获得 {{ pGotCount }} <i class="icon-material170" /> 消耗 {{ pUsedCount }}
                    <i class="icon-material170" />
                </div>
                <div class="my-4">
                    共获得 {{ giftGotCount }} <i class="icon-material171" /> 消耗
                    {{ giftUsedCount }}
                    <i class="icon-material171" />
                </div>
                <div class="my-4">
                    共消耗 {{ ptUsedCount }}
                    <i class="icon-eventbadge-shiho3" />
                </div>
                <div class="mt-4 mb-8">
                    共消耗 {{ paidJewelUsedCount }} 付费
                    <i class="icon-jewel" />
                </div>
                <PartH2 level="3">获得的资源</PartH2>
                <div class="flex flex-wrap gap-5">
                    <div
                        v-for="(item, key) in statistics"
                        :key="key"
                        class="flex flex-col items-center justify-center p-2 gap-1 rounded-lg border-2 min-w-25 overflow-hidden bg-white/40 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-miku/50"
                    >
                        <div class="relative">
                            <div>
                                <Component
                                    v-if="item.icon.startsWith('chara-')"
                                    :is="parseCharaIcon(item.icon)"
                                    class="size-16"
                                />
                                <i v-else :class="item.icon" class="size-16" />
                            </div>
                            <span
                                v-if="item.count > 1"
                                class="absolute right-2 bottom-2 min-w-5 h-5 px-1.5 bg-miku text-white rounded-full text-[0.65rem] font-bold flex items-center justify-center shadow-md border border-white"
                                >{{ item.count }}</span
                            >
                        </div>
                    </div>
                </div>
            </template>
        </ContainerTab>
    </ContainerPageContent>
    <div
        class="fixed right-6 bottom-6 size-20 bg-white flex items-center justify-center text-white text-2xl z-1000 rounded-full shadow-lg shadow-miku/20 cursor-pointer transition-shadow hover:shadow-xl hover:shadow-miku/40"
    >
        <i class="icon-material-bare170 size-32" />
        <span
            class="absolute right-4 bottom-4 min-w-5 h-5 px-1.5 bg-miku text-white rounded-full text-[0.65rem] font-bold flex items-center justify-center shadow-md border border-white pointer-events-none"
            >{{ pCountFormatted }}</span
        >
    </div>
</template>

<style scoped>
.yslide-enter-active,
.yslide-leave-active,
.yslide-move {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.yslide-enter-from {
    opacity: 0;
    transform: translateY(-4.25rem);
}

.yslide-leave-to {
    opacity: 0;
}

.yslide-leave-active {
    margin-top: -4.25rem;
}
</style>
