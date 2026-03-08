import * as fs from "node:fs";
import * as path from "node:path";
import type { Plugin } from "vite";

function generateIconCSS({
    inputDir = "public/assets/icons",
    outputFile = "src/styles/icons.css",
    iconSize = "1.5em"
} = {}) {
    const iconsDir = path.resolve(process.cwd(), inputDir);
    const outputCss = path.resolve(process.cwd(), outputFile);

    let icons: { [key: string]: string } = {};

    for (let i = 1; i <= 225; i++) {
        icons[`material${i}`] =
            `https://snowyassets.exmeaning.com/startapp/thumbnail/material/material${i}.png`;
    }
    for (let i = 1; i <= 225; i++) {
        icons[`material-bare${i}`] =
            `https://snowyassets.exmeaning.com/ondemand/mysekai/item_preview/material/material${i}.png`;
    }
    for (let i = 1; i <= 27; i++) {
        icons[`boost-item${i}`] =
            `https://snowyassets.exmeaning.com/startapp/thumbnail/boost_item/boost_item${i}.png`;
    }
    for (let i = 1; i <= 916; i++) {
        icons[`gacha-logo${i}`] =
            `https://snowyassets.exmeaning.com/startapp/gacha/ab_gacha_${i}/logo/logo.png`;
        icons[`gacha-banner${i}`] =
            `https://snowyassets.exmeaning.com/startapp/home/banner/banner_gacha${i}/banner_gacha${i}.png`;
    }
    for (let i = 1; i <= 4; i++) {
        icons[`skill-practice-ticket${i}`] =
            `https://snowyassets.exmeaning.com/startapp/thumbnail/skill_practice_ticket/ticket${i}.png`;
    }
    for (let i = 1; i <= 4; i++) {
        icons[`practice-ticket${i}`] =
            `https://snowyassets.exmeaning.com/startapp/thumbnail/practice_ticket/ticket${i}.png`;
    }
    icons["heartcrystal-bare"] =
        "https://snowyassets.exmeaning.com/startapp/thumbnail/common_event/heart/icon_heartcrystal.png";
    icons["heartpiece-bare"] =
        "https://snowyassets.exmeaning.com/startapp/thumbnail/common_event/heart/icon_heartpiece.png";
    icons["coinset"] =
        "https://snowyassets.exmeaning.com/startapp/thumbnail/material_exchange/item_gr_coinset.png";
    icons["coinsmallset"] =
        "https://snowyassets.exmeaning.com/startapp/thumbnail/material_exchange/item_gr_coinsmallset.png";
    icons["jewel"] =
        "https://snowyassets.exmeaning.com/startapp/thumbnail/common_material/jewel.png";
    icons["virtual-coin"] =
        "https://snowyassets.exmeaning.com/startapp/thumbnail/common_material/virtual_coin.png";
    icons["coin"] = "https://snowyassets.exmeaning.com/startapp/thumbnail/common_material/coin.png";
    icons["gacha-ticket"] =
        "https://snowyassets.exmeaning.com/startapp/thumbnail/gacha_ticket/gacha_ticket.png";
    icons["gacha-ticket-star4"] =
        "https://snowyassets.exmeaning.com/startapp/thumbnail/gacha_ticket/gacha_ticket_star4.png";
    for (const name of ["shiho"]) {
        for (let i = 1; i <= 4; i++) {
            icons[`eventbadge-${name}${i}`] =
                `https://snowyassets.exmeaning.com/startapp/thumbnail/common_event/badge_${name}/icon_eventbadge_${i}.png`;
        }
    }

    if (fs.existsSync(iconsDir)) {
        fs.readdirSync(iconsDir)
            .filter(
                (file) => file.endsWith(".webp") || file.endsWith(".png") || file.endsWith(".svg")
            )
            .forEach((file) => {
                const iconName = path.parse(file).name;
                icons[iconName] = `/assets/icons/${file}`;
            });
    }
    let cssContent = `@utility icon-base{
    width: ${iconSize};
    height: ${iconSize};
    display: inline-block;
    vertical-align: middle;
    margin: 4px;

    &::after {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
}`;
    for (const [iconName, filePath] of Object.entries(icons)) {
        cssContent += `
@utility icon-${iconName} {
    @apply icon-base;

    &::after {
        background-image: url('${filePath}');
    }
}
`;
    }
    cssContent = `${cssContent}`;
    fs.writeFileSync(outputCss, cssContent.trim());
}

export default function vitePluginIcon(options = {}): Plugin {
    return {
        name: "icon-css-generator",
        buildStart() {
            generateIconCSS(options);
        },
        configureServer(server) {
            // server.watcher 就是 chokidar 的实例

            // 监听新增文件
            server.watcher.on("add", (filePath) => {
                if (filePath.includes("src/assets/icons")) {
                    generateIconCSS(options);
                }
            });

            // 监听删除文件
            server.watcher.on("unlink", (filePath) => {
                if (filePath.includes("src/assets/icons")) {
                    generateIconCSS(options);
                }
            });
        }
    };
}
