<script setup lang="ts">
import ContainerPageContent from "@/components/containers/container-page-content.vue";
import PartH1 from "@/components/parts/part-h1.vue";
import PartH2 from "@/components/parts/part-h2.vue";
import { computed, onMounted, type Reactive, reactive, type Ref, ref, watch } from "vue";
import data from "../data/1an/1an-data.ts";
import ContainerTab from "@/components/containers/container-tab.vue";
import CheckboxGroup from "@/components/controls/checkbox-group.vue";
import InputNumber from "@/components/controls/input-number.vue";
import CheckboxSwitch from "@/components/controls/checkbox-switch.vue";
import CheckboxSlide from "@/components/controls/checkbox-slide.vue";
import { parseCharaIcon } from "@/utils/icon.ts";
import ButtonNormal from "@/components/controls/button-normal.vue";
import InputTextarea from "@/components/controls/input-textarea.vue";

// vars
const signDays = ref(0);
const gachaFes = ref(0);
const gachaGiftValue = ref(false);
const gachaGift = computed({
    get: () => (stamp[4] ? true : gachaGiftValue.value),
    set: (value: boolean) => {
        gachaGiftValue.value = value;
    }
});
const gachaCostumeValue = ref(false);
const gachaCostume = computed({
    get: () => (stamp[4] ? true : gachaCostumeValue.value),
    set: (value: boolean) => {
        gachaCostumeValue.value = value;
    }
});
const rankP = ref(0);
const mySekai = ref(0);
const stamp: Reactive<(number | undefined)[]> = reactive([]);
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

// import and export
function clear() {
    signDays.value = 0;
    updateSignIn();
    gachaFes.value = 0;
    gachaGift.value = false;
    gachaCostume.value = false;
    rankP.value = 0;
    mySekai.value = 0;
    stamp.length = 0;
    for (let key1 in data.pExchange) {
        const key = key1 as keyof typeof data.pExchange;
        pExchange[key] = 0;
    }
    for (let key1 in data.giftExchange) {
        const key = key1 as keyof typeof data.giftExchange;
        giftExchange[key] = 0;
    }
    for (let key1 in data.ptExchange) {
        const key = key1 as keyof typeof data.ptExchange;
        ptExchange[key] = 0;
    }
}
function exportTo(): string {
    const data = {
        signDays: signDays.value,
        gachaFes: gachaFes.value,
        gachaGift: gachaGift.value,
        gachaCostume: gachaCostume.value,
        rankP: rankP.value,
        mySekai: mySekai.value,
        stamp: [...stamp],
        pExchange: { ...pExchange } as Record<string, number | undefined>,
        giftExchange: { ...giftExchange } as Record<string, number | undefined>,
        ptExchange: { ...ptExchange } as Record<string, number | undefined>
    };

    for (let key in data.pExchange) {
        if (data.pExchange[key] === 0) {
            data.pExchange[key] = undefined;
        }
    }
    for (let key in data.giftExchange) {
        if (data.giftExchange[key] === 0) {
            data.giftExchange[key] = undefined;
        }
    }
    for (let key in data.ptExchange) {
        if (data.ptExchange[key] === 0) {
            data.ptExchange[key] = undefined;
        }
    }
    return JSON.stringify(data);
}
function importFrom(dataStr: string) {
    const data = JSON.parse(dataStr);
    clear();
    signDays.value = data.signDays;
    updateSignIn();
    gachaFes.value = data.gachaFes;
    gachaGift.value = data.gachaGift;
    gachaCostume.value = data.gachaCostume;
    rankP.value = data.rankP;
    mySekai.value = data.mySekai;
    for (let i = 0; i < 5 && i < data.stamp.length; i++) {
        stamp[i] = data.stamp[i] || undefined;
    }
    for (let key in data.pExchange) {
        pExchange[key as keyof typeof pExchange] = data.pExchange[key];
    }
    for (let key in data.giftExchange) {
        giftExchange[key as keyof typeof giftExchange] = data.giftExchange[key];
    }
    for (let key in data.ptExchange) {
        ptExchange[key as keyof typeof ptExchange] = data.ptExchange[key];
    }
}
onMounted(() => {
    const savedData = localStorage.getItem("1an-collection");
    if (savedData) {
        try {
            importFrom(savedData);
            console.log(savedData);
        } catch (e) {
            console.error(e);
        }
    }
});
watch(
    [
        signDays,
        gachaFes,
        gachaGift,
        gachaCostume,
        rankP,
        mySekai,
        stamp,
        pExchange,
        giftExchange,
        ptExchange
    ],
    () => {
        const dataStr = exportTo();
        localStorage.setItem("1an-collection", dataStr);
    },
    { deep: true }
);

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
        count += 500 + 1500; // 服装阶梯招募STEP1 + 1种周年set
    }
    if (stampLevel == 2) {
        count += 6500 + 1500 + 3000; // 服装阶梯招募STEP4 + 2种周年set(1500+3000)
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
    let drinkL = 0;
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
        drinkL += data.stamp[i]!.level[stamp[i]!]!.rewards.drinkL || 0;
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
        count: drinkL
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
    { key: "materials", label: "资源统计" },
    { key: "importExport", label: "导入导出" }
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
function updateSignIn() {
    signInRewardSelects.value = [];
    for (let i = 0; i < signDays.value; i++) {
        signInRewardSelects.value.push(i);
    }
}
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
const importText = ref("");
const importStat = ref<boolean>();
function clearUI() {
    importStat.value = undefined;
    clear();
}
function importFromText() {
    importStat.value = undefined;
    try {
        importFrom(importText.value);
    } catch (e) {
        importStat.value = false;
        throw e;
    }
    importStat.value = true;
}
function exportAndCopy() {
    importStat.value = undefined;
    const str = exportTo();
    navigator.clipboard.writeText(str);
}
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
                <div class="px-2">
                    <PartH2 level="3"> 登录奖励 </PartH2>
                </div>
                <CheckboxGroup
                    v-model="signInRewardSelects"
                    :options="signInRewardList"
                    @change="handleSignInRewardChange"
                ></CheckboxGroup>
                <div
                    class="my-6 p-4 sm:px-6 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white/40 dark:border-slate-700/50 flex flex-wrap items-center gap-y-2 text-slate-700 dark:text-slate-200 font-medium shadow-sm backdrop-blur-sm"
                >
                    <span class="mr-2">共计</span>
                    <span class="text-miku text-lg mx-1 sm:mx-2">{{ signInRewards.p }}</span>
                    <i class="icon-material170 mr-3 sm:mr-4 drop-shadow-sm"></i>
                    <span class="text-blue-400 dark:text-blue-300 text-lg mx-1 sm:mx-2">{{
                        signInRewards.jewel
                    }}</span>
                    <i class="icon-jewel mr-3 sm:mr-4 drop-shadow-sm"></i>
                    <span class="text-yellow-400 dark:text-yellow-300 text-lg mx-1 sm:mx-2">{{
                        signInRewards.gacha
                    }}</span>
                    <i class="icon-gacha-ticket drop-shadow-sm"></i>
                </div>
                <div class="px-2 mt-2">
                    <PartH2 level="3"> 卡池获取 </PartH2>
                </div>
                <div
                    class="flex flex-col sm:flex-row items-center bg-white/40 dark:bg-slate-800/40 p-3 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm mb-4"
                >
                    <i class="icon-gacha-banner704 w-60 h-28 rounded-xl shadow-md" />
                    <div class="m-3 sm:m-5 flex flex-col items-center sm:items-start gap-3">
                        <div
                            class="flex items-center text-center sm:text-left text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium"
                        >
                            每满 50 抽 → 100<i class="icon-material170 ml-1" />，无上限
                        </div>
                        <div
                            class="flex flex-row items-center w-max text-slate-700 dark:text-slate-200 font-bold bg-white/60 dark:bg-slate-900/60 pl-2 pr-4 py-1 rounded-full border border-white/50 dark:border-slate-700/50 shadow-inner"
                        >
                            <div class="h-8 min-w-24 mr-3">
                                <InputNumber v-model="gachaFes" :min="0" :step="50" />
                            </div>
                            <span class="text-slate-400 dark:text-slate-500 mr-2">→</span>
                            <span class="text-miku text-lg mr-1">{{ gachaFes * 2 }}</span>
                            <i class="icon-material170 drop-shadow-sm" />
                        </div>
                    </div>
                </div>
                <div
                    class="flex flex-col sm:flex-row items-center bg-white/40 dark:bg-slate-800/40 p-3 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm mb-4"
                >
                    <i class="icon-gacha-banner710 w-60 h-28 rounded-xl shadow-md" />
                    <div class="m-3 sm:m-5 flex flex-col items-center sm:items-start gap-3">
                        <div
                            class="flex items-center text-center sm:text-left text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium"
                        >
                            3000 付费<i class="icon-jewel mx-1" /> → 200<i
                                class="icon-material170 mx-1"
                            />
                            + 50<i class="icon-material171 ml-1" />
                        </div>
                        <div
                            class="flex flex-row items-center gap-3 w-max font-bold text-slate-700 dark:text-slate-200 bg-white/60 dark:bg-slate-900/60 px-4 py-2 rounded-full border border-white/50 dark:border-slate-700/50 shadow-inner"
                        >
                            <span class="mr-2">我要抽！</span>
                            <div class="h-6 w-12 my-auto">
                                <CheckboxSwitch v-model="gachaGift" :disabled="!!stamp[4]" />
                            </div>
                            <span v-if="stamp[4]" class="ml-2 font-normal text-sm"
                                >被集章卡要求锁定了！</span
                            >
                        </div>
                    </div>
                </div>
                <div
                    class="flex flex-col sm:flex-row items-center bg-white/40 dark:bg-slate-800/40 p-3 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm mb-6"
                >
                    <i class="icon-gacha-banner705 w-60 h-28 rounded-xl shadow-md" />
                    <div class="m-3 sm:m-5 flex flex-col items-center sm:items-start gap-3">
                        <div
                            class="flex items-center text-center sm:text-left text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium"
                        >
                            3000 付费<i class="icon-jewel mx-1" /> → 200<i
                                class="icon-material170 ml-1"
                            />
                        </div>
                        <div
                            class="flex flex-row items-center gap-3 w-max font-bold text-slate-700 dark:text-slate-200 bg-white/60 dark:bg-slate-900/60 px-4 py-2 rounded-full border border-white/50 dark:border-slate-700/50 shadow-inner"
                        >
                            <span class="mr-2">我要抽！</span>
                            <div class="h-6 w-12 my-auto">
                                <CheckboxSwitch v-model="gachaCostume" :disabled="!!stamp[4]" />
                            </div>
                            <span v-if="stamp[4]" class="ml-2 font-normal text-sm"
                                >被集章卡要求锁定了！</span
                            >
                        </div>
                    </div>
                </div>
                <div class="px-2">
                    <PartH2 level="3"> 获取零碎碎片 </PartH2>
                </div>
                <!-- Combined Box for PT Exchange & My Sekai -->
                <div
                    class="bg-white/40 dark:bg-slate-800/40 p-4 sm:p-6 mb-6 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm flex flex-col md:flex-row gap-6 md:gap-8"
                >
                    <!-- PT Exchange (活动兑换所) -->
                    <div class="flex-1 flex flex-col">
                        <div
                            class="text-base font-bold text-slate-800 dark:text-slate-100 mb-3 ml-1 flex items-center"
                        >
                            活动兑换所
                        </div>
                        <div
                            class="flex items-center text-sm text-slate-600 dark:text-slate-300 font-medium bg-white/50 dark:bg-slate-900/40 p-3 rounded-xl border border-white/40 dark:border-slate-700/40 shadow-inner mb-3"
                        >
                            5000 <i class="icon-eventbadge-shiho3 mx-1" /> → 15<i
                                class="icon-material170 mx-1"
                            />，限15次
                        </div>
                        <div
                            class="flex flex-row items-center mt-auto text-slate-700 dark:text-slate-200 font-bold bg-white/60 dark:bg-slate-900/60 pl-2 pr-4 py-2 rounded-full border border-white/50 dark:border-slate-700/50 shadow-sm w-max"
                        >
                            <div class="h-8 min-w-24 mr-3">
                                <InputNumber v-model="ptExchange.p" :min="0" :max="15" />
                            </div>
                            <span class="text-slate-400 dark:text-slate-500 mx-1">*</span> 5k
                            <i class="icon-eventbadge-shiho3 ml-0.5 mr-2" />
                            <span class="text-slate-400 dark:text-slate-500 mr-2">→</span>
                            <span class="text-miku text-lg mr-1">{{ ptExchange.p * 15 }}</span>
                            <i class="icon-material170 drop-shadow-sm" />
                        </div>
                    </div>

                    <!-- Divider for desktop -->
                    <div class="hidden md:block w-px bg-slate-200 dark:bg-slate-700/60 my-2"></div>

                    <!-- My Sekai (烤森挖矿) -->
                    <div class="flex-1 flex flex-col">
                        <div
                            class="text-base font-bold text-slate-800 dark:text-slate-100 mb-3 ml-1 flex items-center"
                        >
                            烤森挖矿
                        </div>
                        <div
                            class="flex items-center text-sm text-slate-600 dark:text-slate-300 font-medium bg-white/50 dark:bg-slate-900/40 p-3 rounded-xl border border-white/40 dark:border-slate-700/40 shadow-inner mb-3"
                        >
                            挖矿（所有种类） 每个矿石有概率获得 0～1个
                            <i class="icon-material170 shrink-0 ml-1" />
                        </div>
                        <div
                            class="flex flex-row items-center mt-auto text-slate-700 dark:text-slate-200 font-bold bg-white/60 dark:bg-slate-900/60 pl-2 pr-4 py-2 rounded-full border border-white/50 dark:border-slate-700/50 shadow-sm w-max"
                        >
                            <div class="h-8 min-w-24 mr-3">
                                <InputNumber v-model="mySekai" :min="0" />
                            </div>
                            <span class="mr-2">累计产出</span>
                            <span class="text-miku text-lg mr-1">{{ mySekai }}</span>
                            <i class="icon-material170 drop-shadow-sm" />
                        </div>
                    </div>
                </div>
                <PartH2 level="3"> 集章任务 </PartH2>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                    <div
                        v-for="(cardGroup, cardGroupIndex) in data.stamp"
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
                                        <span v-if="card.rewards.p" class="flex items-center">
                                            <span class="text-miku mr-0.5">{{
                                                card.rewards.p
                                            }}</span
                                            ><i class="icon-material170 drop-shadow-sm gap-1" />
                                        </span>
                                        <span
                                            v-if="card.rewards.jewel"
                                            class="flex items-center ml-1"
                                        >
                                            <span class="text-blue-400 mr-0.5">{{
                                                card.rewards.jewel
                                            }}</span
                                            ><i class="icon-jewel drop-shadow-sm" />
                                        </span>
                                        <span
                                            v-if="card.rewards.gacha"
                                            class="flex items-center ml-1"
                                        >
                                            <span class="text-yellow-400 mr-0.5">{{
                                                card.rewards.gacha
                                            }}</span
                                            ><i class="icon-gacha-ticket drop-shadow-sm" />
                                        </span>
                                        <span
                                            v-if="card.rewards.drinkL"
                                            class="flex items-center ml-1"
                                        >
                                            <span class="mr-0.5">{{ card.rewards.drinkL }}</span
                                            ><i class="icon-boost-item2 drop-shadow-sm" />
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
            </template>

            <template #exchangeP>
                <h2 class="hidden">世界碎片兑换所</h2>
                <TransitionGroup name="yslide">
                    <div v-if="pCount < 0" class="flex w-full mb-2">
                        <div
                            class="mr-auto py-1.5 px-3 border-red-500/50 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 font-bold border rounded-lg shadow-sm text-sm"
                        >
                            <i class="icon-material170 drop-shadow-sm" /> 获取量小于消耗量！
                        </div>
                    </div>
                    <div
                        class="mt-2 mb-8 bg-white/40 dark:bg-slate-800/40 p-4 rounded-xl border border-white/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 font-medium shadow-sm flex flex-wrap items-center gap-y-2 w-full sm:w-max mx-auto sm:mx-0"
                    >
                        <span class="mr-2">共获得</span>
                        <span class="text-miku text-lg mx-1 sm:mx-2">{{ pGotCount }}</span>
                        <i class="icon-material170 mr-3 sm:mr-4 drop-shadow-sm" />
                        <span class="ml-2 sm:ml-0 mr-2">消耗</span>
                        <span class="text-slate-500 dark:text-slate-400 text-lg mx-1 sm:mx-2">{{
                            pUsedCount
                        }}</span>
                        <i class="icon-material170 drop-shadow-sm" />
                    </div>
                    <div class="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-5">
                        <button
                            v-for="(item, key) in data.pExchange"
                            :key="key"
                            class="flex flex-col items-center justify-center p-3 gap-2 rounded-2xl border-2 transition-all duration-300 active:scale-95 min-w-36 overflow-hidden shadow-sm"
                            :class="
                                pExchange[key]! > 0
                                    ? 'border-miku bg-miku/10 dark:bg-miku/20 shadow-[0_4px_15px_rgba(51,204,187,0.15)]'
                                    : 'bg-white/40 dark:bg-slate-800/40 border-zinc-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-miku/50 dark:hover:border-miku/60'
                            "
                            @click="pExchange[key]!++"
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
                                        pExchange[key]! > 0
                                            ? pExchange[key]! * data.pExchange[key]!.count
                                            : data.pExchange[key]!.count
                                    }}</span
                                >
                            </div>
                            <div
                                class="flex items-center text-sm font-bold text-slate-700 dark:text-slate-200 mt-1 bg-white/50 dark:bg-slate-900/50 px-3 py-1 rounded-full border border-white/30 dark:border-slate-700/30"
                            >
                                <i class="icon-material170 mr-1 drop-shadow-sm" />
                                {{
                                    pExchange[key]! > 0
                                        ? pExchange[key]! * data.pExchange[key]!.expense
                                        : data.pExchange[key]!.expense
                                }}
                            </div>
                            <div class="h-8 w-20 mt-1">
                                <InputNumber
                                    v-model="pExchange[key]!"
                                    :min="0"
                                    :max="data.pExchange[key]!.limit"
                                    @click.stop
                                />
                            </div>
                            <div
                                v-if="data.pExchange[key]!.limit !== Infinity"
                                class="text-[0.7rem] font-bold text-slate-500 dark:text-slate-400 mt-0.5"
                            >
                                余 {{ data.pExchange[key]!.limit - pExchange[key]! }}
                            </div>
                        </button>
                    </div>
                </TransitionGroup>
            </template>

            <template #exchangeGift>
                <h2 class="hidden">礼物券兑换所</h2>
                <TransitionGroup name="yslide">
                    <div v-if="giftCount < 0" class="flex w-full mb-2">
                        <div
                            class="mr-auto py-1.5 px-3 border-red-500/50 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 font-bold border rounded-lg shadow-sm text-sm"
                        >
                            <i class="icon-material171 drop-shadow-sm" /> 获取量小于消耗量！
                        </div>
                    </div>
                    <div
                        class="mt-2 mb-8 bg-white/40 dark:bg-slate-800/40 p-4 rounded-xl border border-white/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 font-medium shadow-sm flex flex-wrap items-center gap-y-2 w-full sm:w-max mx-auto sm:mx-0"
                    >
                        <span class="mr-2">共获得</span>
                        <span class="text-miku text-lg mx-1 sm:mx-2">{{ giftGotCount }}</span>
                        <i class="icon-material171 mr-3 sm:mr-4 drop-shadow-sm" />
                        <span class="ml-2 sm:ml-0 mr-2">消耗</span>
                        <span class="text-slate-500 dark:text-slate-400 text-lg mx-1 sm:mx-2">{{
                            giftUsedCount
                        }}</span>
                        <i class="icon-material171 drop-shadow-sm" />
                    </div>
                    <div class="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-5">
                        <button
                            v-for="(item, key) in data.giftExchange"
                            :key="key"
                            class="flex flex-col items-center justify-center p-3 gap-2 rounded-2xl border-2 transition-all duration-300 active:scale-95 min-w-36 overflow-hidden shadow-sm"
                            :class="
                                giftExchange[key]! > 0
                                    ? 'border-miku bg-miku/10 dark:bg-miku/20 shadow-[0_4px_15px_rgba(51,204,187,0.15)]'
                                    : 'bg-white/40 dark:bg-slate-800/40 border-zinc-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-miku/50 dark:hover:border-miku/60'
                            "
                            @click="giftExchange[key]!++"
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
                                        giftExchange[key]! > 0
                                            ? giftExchange[key]! * data.giftExchange[key]!.count
                                            : data.giftExchange[key]!.count
                                    }}</span
                                >
                            </div>
                            <div
                                class="flex items-center text-sm font-bold text-slate-700 dark:text-slate-200 mt-1 bg-white/50 dark:bg-slate-900/50 px-3 py-1 rounded-full border border-white/30 dark:border-slate-700/30"
                            >
                                <i class="icon-material171 mr-1 drop-shadow-sm" />
                                {{
                                    giftExchange[key]! > 0
                                        ? giftExchange[key]! * data.giftExchange[key]!.expense
                                        : data.giftExchange[key]!.expense
                                }}
                            </div>
                            <div class="h-8 w-20 mt-1">
                                <InputNumber
                                    v-model="giftExchange[key]!"
                                    :min="0"
                                    :max="data.giftExchange[key]!.limit"
                                    @click.stop
                                />
                            </div>
                            <div
                                v-if="data.giftExchange[key]!.limit !== Infinity"
                                class="text-[0.7rem] font-bold text-slate-500 dark:text-slate-400 mt-0.5"
                            >
                                余 {{ data.giftExchange[key]!.limit - giftExchange[key]! }}
                            </div>
                        </button>
                    </div>
                </TransitionGroup>
            </template>

            <template #exchangeBadge>
                <h2 class="hidden">活动徽章兑换所</h2>
                <TransitionGroup name="yslide">
                    <div
                        class="mt-2 mb-8 bg-white/40 dark:bg-slate-800/40 p-4 rounded-xl border border-white/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 font-medium shadow-sm flex flex-wrap items-center gap-y-2 w-full sm:w-max mx-auto sm:mx-0"
                    >
                        <span class="mr-2">共消耗</span>
                        <span class="text-slate-500 dark:text-slate-400 text-lg mx-1 sm:mx-2">{{
                            ptUsedCount
                        }}</span>
                        <i class="icon-eventbadge-shiho3 drop-shadow-sm" />
                    </div>
                    <div class="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-5">
                        <button
                            v-for="(item, key) in data.ptExchange"
                            :key="key"
                            class="flex flex-col items-center justify-center p-3 gap-2 rounded-2xl border-2 transition-all duration-300 active:scale-95 min-w-36 overflow-hidden shadow-sm"
                            :class="
                                ptExchange[key]! > 0
                                    ? 'border-miku bg-miku/10 dark:bg-miku/20 shadow-[0_4px_15px_rgba(51,204,187,0.15)]'
                                    : 'bg-white/40 dark:bg-slate-800/40 border-zinc-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-miku/50 dark:hover:border-miku/60'
                            "
                            @click="ptExchange[key]!++"
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
                                        ptExchange[key]! > 0
                                            ? ptExchange[key]! * data.ptExchange[key]!.count
                                            : data.ptExchange[key]!.count
                                    }}</span
                                >
                            </div>
                            <div
                                class="flex items-center text-sm font-bold text-slate-700 dark:text-slate-200 mt-1 bg-white/50 dark:bg-slate-900/50 px-3 py-1 rounded-full border border-white/30 dark:border-slate-700/30"
                            >
                                <i class="icon-eventbadge-shiho3 mr-1 drop-shadow-sm" />
                                {{
                                    ptExchange[key]! > 0
                                        ? ptExchange[key]! * data.ptExchange[key]!.expense
                                        : data.ptExchange[key]!.expense
                                }}
                            </div>
                            <div class="h-8 w-20 mt-1">
                                <InputNumber
                                    v-model="ptExchange[key]!"
                                    :min="0"
                                    :max="data.ptExchange[key]!.limit"
                                    @click.stop
                                />
                            </div>
                            <div
                                v-if="data.ptExchange[key]!.limit !== Infinity"
                                class="text-[0.7rem] font-bold text-slate-500 dark:text-slate-400 mt-0.5"
                            >
                                余 {{ data.ptExchange[key]!.limit - ptExchange[key]! }}
                            </div>
                        </button>
                    </div>
                </TransitionGroup>
            </template>

            <template #materials>
                <h2 class="hidden">资源统计</h2>
                <PartH2 level="3">兑换物</PartH2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <div
                        class="bg-white/40 dark:bg-slate-800/40 py-3 sm:py-4 rounded-xl border border-white/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 font-medium shadow-sm grid grid-cols-2 items-center"
                    >
                        <div class="flex items-center justify-center whitespace-nowrap">
                            共获得
                            <span class="text-miku text-[1.05rem] sm:text-lg font-bold mx-1.5">{{
                                pGotCount
                            }}</span>
                            <i class="icon-material170 drop-shadow-sm" />
                        </div>
                        <div
                            class="flex items-center justify-center border-l dark:border-slate-600 border-slate-300 whitespace-nowrap"
                        >
                            消耗
                            <span
                                class="text-slate-500 dark:text-slate-400 text-[1.05rem] sm:text-lg font-bold mx-1.5"
                                >{{ pUsedCount }}</span
                            >
                            <i class="icon-material170 drop-shadow-sm" />
                        </div>
                    </div>
                    <div
                        class="bg-white/40 dark:bg-slate-800/40 py-3 sm:py-4 rounded-xl border border-white/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 font-medium shadow-sm grid grid-cols-2 items-center"
                    >
                        <div class="flex items-center justify-center whitespace-nowrap">
                            共获得
                            <span class="text-miku text-[1.05rem] sm:text-lg font-bold mx-1.5">{{
                                giftGotCount
                            }}</span>
                            <i class="icon-material171 drop-shadow-sm" />
                        </div>
                        <div
                            class="flex items-center justify-center border-l dark:border-slate-600 border-slate-300 whitespace-nowrap"
                        >
                            消耗
                            <span
                                class="text-slate-500 dark:text-slate-400 text-[1.05rem] sm:text-lg font-bold mx-1.5"
                                >{{ giftUsedCount }}</span
                            >
                            <i class="icon-material171 drop-shadow-sm" />
                        </div>
                    </div>
                    <div
                        class="bg-white/40 dark:bg-slate-800/40 py-3 sm:py-4 rounded-xl border border-white/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 font-medium shadow-sm grid grid-cols-2 items-center col-span-1 md:col-span-2 lg:col-span-1"
                    >
                        <div class="flex items-center justify-center whitespace-nowrap">
                            共消耗
                            <span
                                class="text-slate-500 dark:text-slate-400 text-[1.05rem] sm:text-lg font-bold mx-1.5"
                                >{{ ptUsedCount }}</span
                            >
                            <i class="icon-eventbadge-shiho3 drop-shadow-sm" />
                        </div>
                        <div
                            class="flex items-center justify-center border-l dark:border-slate-600 border-slate-300 whitespace-nowrap"
                        >
                            消耗
                            <span
                                class="text-blue-400 text-[1.05rem] sm:text-lg font-bold ml-1.5 mr-1 text-shadow-sm"
                                >{{ paidJewelUsedCount }}</span
                            >
                            <span class="text-sm dark:text-slate-400 text-slate-500 mr-1"
                                >付费</span
                            >
                            <i class="icon-jewel drop-shadow-sm" />
                        </div>
                    </div>
                </div>

                <PartH2 level="3">获得的资源</PartH2>
                <div class="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-5 pb-8">
                    <div
                        v-for="(item, key) in statistics"
                        :key="key"
                        class="flex flex-col items-center justify-center p-3 gap-2 rounded-2xl border border-white/40 bg-white/40 dark:bg-slate-800/40 dark:border-slate-700/50 hover:bg-white/60 dark:hover:bg-slate-700/50 transition-colors shadow-sm min-w-24 overflow-hidden"
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
                                v-if="item.count > 1"
                                class="absolute -right-2 -bottom-2 min-w-6 h-6 px-1.5 bg-miku text-white rounded-full text-xs font-bold flex items-center justify-center shadow-md border-2 border-white dark:border-slate-800"
                                >{{ item.count }}</span
                            >
                        </div>
                    </div>
                </div>
            </template>

            <template #importExport>
                <h2 class="hidden">导入导出</h2>
                <div
                    class="flex flex-nowrap items-center my-4 text-slate-700 dark:text-slate-200 font-medium"
                >
                    清空选择：
                    <div class="w-20">
                        <ButtonNormal type="secondary" @click="clearUI">清空</ButtonNormal>
                    </div>
                </div>
                <div
                    class="flex flex-nowrap items-center my-4 text-slate-700 dark:text-slate-200 font-medium border-t border-slate-200 dark:border-slate-700/50 pt-4"
                >
                    导出到剪切板：
                    <div class="w-20"><ButtonNormal @click="exportAndCopy">导出</ButtonNormal></div>
                </div>

                <div
                    class="flex flex-nowrap items-center my-4 text-slate-700 dark:text-slate-200 font-medium"
                >
                    导入：
                    <div class="w-20 mr-3">
                        <ButtonNormal @click="importFromText">导入</ButtonNormal>
                    </div>
                    <span
                        v-if="importStat == true"
                        class="text-miku font-bold bg-miku/10 px-3 py-1 rounded-full border border-miku/20"
                    >
                        导入成功！
                    </span>
                    <span
                        v-else-if="importStat == false"
                        class="text-red-500 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full border border-red-200 dark:border-red-800/50"
                    >
                        导入失败！
                    </span>
                </div>
                <div class="h-40">
                    <InputTextarea v-model="importText" placeholder="在此粘贴导出的数据..." />
                </div>
            </template>
        </ContainerTab>
    </ContainerPageContent>
    <!-- 给底部留出滑动空间 -->
    <div class="h-30" />
    <div
        class="fixed right-6 bottom-6 size-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-slate-100 text-2xl z-50 rounded-full shadow-lg border border-white/50 dark:border-slate-700/50 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-miku/30 dark:hover:shadow-miku/20 active:scale-95 group"
    >
        <div
            class="absolute inset-0 rounded-full bg-linear-to-tr from-miku/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        ></div>
        <i
            class="icon-material-bare170 size-24 drop-shadow-sm group-hover:drop-shadow-[0_0_8px_rgba(51,204,187,0.5)] transition-all duration-300 relative z-10"
        />
        <span
            class="absolute right-0 bottom-0 min-w-8 h-6 px-2 bg-miku text-white rounded-full text-xs font-bold flex items-center justify-center shadow-md border-2 border-white dark:border-slate-800 z-20"
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
    transform: translateY(-2.69rem);
}

.yslide-leave-to {
    opacity: 0;
}

.yslide-leave-active {
    margin-top: -2.69rem;
}
</style>
