import type { FixedLengthArray } from "@/types/typeConstraints.ts";

type Rewards = {
    p?: number;
    gacha?: number;
    jewel?: number;
    drink?: number;
    drinkL?: number;
};

const signIn: FixedLengthArray<Rewards, 7> = [
    {
        // 1
        p: 10,
        gacha: 10,
        jewel: 3000
    },
    {
        // 2
        p: 5,
        gacha: 10
    },
    {
        // 3
        p: 5,
        gacha: 10
    },
    {
        // 4
        p: 10,
        gacha: 10
    },
    {
        // 5
        p: 5,
        gacha: 10
    },
    {
        // 6
        p: 5,
        gacha: 10
    },
    {
        // 7
        p: 10,
        gacha: 10
    }
];

const stamp: {
    description: string;
    level: FixedLengthArray<{ require: string; rewards: Rewards; extra?: string[] }, 3>;
}[] = [
    {
        description: "能量演出卡",
        level: [
            {
                require: "消耗 80 火",
                rewards: {
                    p: 10,
                    drinkL: 1
                }
            },
            {
                require: "消耗 150 火",
                rewards: {
                    p: 15,
                    drinkL: 3
                }
            },
            {
                require: "消耗 390 火",
                rewards: {
                    p: 30,
                    drinkL: 5
                }
            }
        ]
    },
    {
        description: "歌曲卡（可AUTO）",
        level: [
            {
                require: "通关 20 首不同歌曲",
                rewards: {
                    p: 10,
                    drinkL: 1
                }
            },
            {
                require: "通关 39 首不同歌曲",
                rewards: {
                    p: 15,
                    drinkL: 3
                }
            },
            {
                require: "通关 60 首不同歌曲",
                rewards: {
                    p: 30,
                    drinkL: 5
                }
            }
        ]
    },
    {
        description: "演出卡",
        level: [
            {
                require: "演出 50 次",
                rewards: {
                    p: 15,
                    drinkL: 1
                }
            },
            {
                require: "累计 FC 20 次",
                rewards: {
                    p: 30,
                    drinkL: 3
                }
            },
            {
                require: "得分超过 150w ，累计15 次",
                rewards: {
                    p: 50,
                    drinkL: 10
                }
            }
        ]
    },
    {
        description: "活动积分卡",
        level: [
            {
                require: "获得 50万 pt",
                rewards: {
                    p: 15,
                    drinkL: 1
                }
            },
            {
                require: "获得 150万 pt",
                rewards: {
                    p: 30,
                    drinkL: 3
                }
            },
            {
                require: "获得 390万 pt",
                rewards: {
                    p: 50,
                    drinkL: 10
                }
            }
        ]
    },
    {
        description: "商店卡",
        level: [
            {
                require: "累计抽卡50次",
                rewards: {
                    p: 20,
                    gacha: 5
                }
            },
            {
                require: "完成全部子任务",
                rewards: {
                    p: 100,
                    gacha: 20,
                    jewel: 1000
                },
                extra: [
                    "抽卡 100 次",
                    "bfes池或shiho5箱卡池抽 50次",
                    "抽服装池（3000付费水）",
                    "抽1次1周年纪念庆典服装阶梯招募STEP1（500付费水）",
                    "抽1次礼物池（3000付费水）",
                    "购买1种周年set（最低1500付费）",
                    "开通4月通行证或烤森通行证（12000点数的那个）"
                ]
            },
            {
                require: "完成全部子任务",
                rewards: {
                    p: 200,
                    gacha: 30,
                    jewel: 2000
                },
                extra: [
                    "抽卡 200 次",
                    "bfes池或shiho5箱卡池抽 100 次",
                    "抽服装池（3000付费水）",
                    "抽1次1周年纪念庆典服装阶梯招募STEP4（共6500付费水）",
                    "抽1次礼物池（3000付费水）",
                    "购买2种周年set",
                    "开通4月通行证或烤森通行证（含有12000点数的）"
                ]
            }
        ]
    }
];

type exchangeChoice = { count: number; expense: number; limit: number; icon: string };
const pExchange = {
    specialGacha: {
        count: 1,
        expense: 300,
        limit: 1,
        icon: "icon-gacha-ticket-star4"
    },
    cos:{
        count: 1,
        expense: 150,
        limit: 1,
        icon: "icon-cos-1an"
    },
    heartcrystal: {
        count: 1,
        expense: 200,
        limit: 2,
        icon: "icon-material16"
    },
    shizuku: {
        count: 1,
        expense: 30,
        limit: 10,
        icon: "icon-material57"
    },
    skill3: {
        count: 1,
        expense: 30,
        limit: 10,
        icon: "icon-skill-practice-ticket3"
    },
    jewel: {
        count: 100,
        expense: 10,
        limit: 5,
        icon: "icon-jewel"
    },
    drinkL: {
        count: 1,
        expense: 10,
        limit: 5,
        icon: "icon-boost-item2"
    },
    liveCoin: {
        count: 300,
        expense: 10,
        limit: 5,
        icon: "icon-virtual-coin"
    },
    exp3: {
        count: 3,
        expense: 10,
        limit: 10,
        icon: "icon-practice-ticket3"
    },
    rainbowBottle: {
        count: 10,
        expense: 5,
        limit: 20,
        icon: "icon-material14"
    },
    bottle6: {
        count: 10,
        expense: 1,
        limit: 100,
        icon: "icon-material6"
    },
    bottle7: {
        count: 10,
        expense: 1,
        limit: 100,
        icon: "icon-material7"
    },
    bottle8: {
        count: 10,
        expense: 1,
        limit: 100,
        icon: "icon-material8"
    },
    bottle9: {
        count: 10,
        expense: 1,
        limit: 100,
        icon: "icon-material9"
    },
    bottle10: {
        count: 10,
        expense: 1,
        limit: 100,
        icon: "icon-material10"
    },
    coin: {
        count: 10000,
        expense: 1,
        limit: Infinity,
        icon: "icon-coin"
    }
} satisfies Record<string, exchangeChoice>;

const giftExchange = {
    heartcrystal159: {
        count: 1,
        expense: 30,
        limit: 1,
        icon: "icon-material159"
    },
    heartcrystal160: {
        count: 1,
        expense: 30,
        limit: 1,
        icon: "icon-material160"
    },
    heartcrystal161: {
        count: 1,
        expense: 30,
        limit: 1,
        icon: "icon-material161"
    },
    heartcrystal162: {
        count: 1,
        expense: 30,
        limit: 1,
        icon: "icon-material162"
    },
    heartcrystal163: {
        count: 1,
        expense: 30,
        limit: 1,
        icon: "icon-material163"
    },
    heartcrystal164: {
        count: 1,
        expense: 30,
        limit: 1,
        icon: "icon-material164"
    },
    drinkL: {
        count: 1,
        expense: 1,
        limit: 50,
        icon: "icon-boost-item2"
    },
    exp3: {
        count: 10,
        expense: 3,
        limit: 10,
        icon: "icon-practice-ticket3"
    },
    skill3: {
        count: 1,
        expense: 3,
        limit: 10,
        icon: "icon-skill-practice-ticket3"
    },
    expBottle60: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material60"
    },
    expBottle61: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material61"
    },
    expBottle62: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material62"
    },
    expBottle63: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material63"
    },
    expBottle64: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material64"
    },
    expBottle65: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material65"
    },
    expBottle66: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material66"
    },
    expBottle67: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material67"
    },
    expBottle68: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material68"
    },
    expBottle69: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material69"
    },
    expBottle70: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material70"
    },
    expBottle71: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material71"
    },
    expBottle72: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material72"
    },
    expBottle73: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material73"
    },
    expBottle74: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material74"
    },
    expBottle75: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material75"
    },
    expBottle76: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material76"
    },
    expBottle77: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material77"
    },
    expBottle78: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material78"
    },
    expBottle79: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material79"
    },
    expBottle80: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material80"
    },
    expBottle81: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material81"
    },
    expBottle82: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material82"
    },
    expBottle83: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material83"
    },
    expBottle84: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material84"
    },
    expBottle85: {
        count: 2,
        expense: 3,
        limit: 1,
        icon: "icon-material85"
    },
    rainbowBottle: {
        count: 20,
        expense: 1,
        limit: 25,
        icon: "icon-material14"
    },
    bottle6: {
        count: 1000,
        expense: 1,
        limit: 10,
        icon: "icon-material6"
    },
    bottle7: {
        count: 1000,
        expense: 1,
        limit: 10,
        icon: "icon-material7"
    },
    bottle8: {
        count: 1000,
        expense: 1,
        limit: 10,
        icon: "icon-material8"
    },
    bottle9: {
        count: 1000,
        expense: 1,
        limit: 10,
        icon: "icon-material9"
    },
    bottle10: {
        count: 1000,
        expense: 1,
        limit: 10,
        icon: "icon-material10"
    }
} satisfies Record<string, exchangeChoice>;
const ptExchange = {
    saki: {
        count: 1,
        expense: 15000,
        limit: 1,
        icon: "chara-res002_no046_normal,mysterious,3"
    },
    rin: {
        count: 1,
        expense: 5000,
        limit: 1,
        icon: "chara-res022_no046_normal,mysterious,2"
    },
    shizuku: {
        count: 1,
        expense: 30000,
        limit: 3,
        icon: "icon-material57"
    },
    jewel: {
        count: 100,
        expense: 1000,
        limit: 5,
        icon: "icon-jewel"
    },
    drink: {
        count: 100,
        expense: 100,
        limit: 10,
        icon: "icon-boost-item1"
    },
    exp2: {
        count: 1,
        expense: 100,
        limit: 50,
        icon: "icon-practice-ticket2"
    },
    anvoCardLn: {
        count: 1,
        expense: 15000,
        limit: 2,
        icon: "icon-material50"
    },
    stickerStamp: {
        count: 1,
        expense: 5000,
        limit: 1,
        icon: "icon-material44"
    },
    heartpiece: {
        count: 5,
        expense: 1000,
        limit: 20,
        icon: "icon-material15"
    },
    cloth: {
        count: 1,
        expense: 50,
        limit: 300,
        icon: "icon-material11"
    },
    thread: {
        count: 1,
        expense: 500,
        limit: 30,
        icon: "icon-material12"
    },
    coinSet: {
        count: 100000,
        expense: 10000,
        limit: 1,
        icon: "icon-coin"
    },
    piece2: {
        count: 100,
        expense: 500,
        limit: 10,
        icon: "icon-material2"
    },
    bottle7: {
        count: 10,
        expense: 500,
        limit: 20,
        icon: "icon-material7"
    },
    songCard: {
        count: 1,
        expense: 300,
        limit: 10,
        icon: "icon-material13"
    },
    rainbowBottle: {
        count: 5,
        expense: 1000,
        limit: 20,
        icon: "icon-material14"
    },
    seed: {
        count: 1,
        expense: 1000,
        limit: 10,
        icon: "icon-material17"
    },
    skill2: {
        count: 1,
        expense: 5000,
        limit: 8,
        icon: "icon-skill-practice-ticket2"
    },
    member3: {
        count: 1,
        expense: 15000,
        limit: 1,
        icon: "icon-material45"
    },
    member2: {
        count: 1,
        expense: 5000,
        limit: 1,
        icon: "icon-material167"
    },
    p: {
        count: 10,
        expense: 5000,
        limit: 15,
        icon: "icon-material170"
    },
    coin: {
        count: 1,
        expense: 1,
        limit: Infinity,
        icon: "icon-coin"
    }
} satisfies Record<string, exchangeChoice>;

export default {
    signIn,
    rank: {
        10000: 100,
        50000: 75,
        100000: 50
    },
    stamp,
    pExchange,
    giftExchange,
    ptExchange
};
