import { removeLeading, removeTrail } from "@/utils/string.ts";
import { h, type VNode } from "vue";
import CardThumbnail from "@/components/card-thumbnail.vue";

export function parseCharaIcon(text: string) {
    text = removeLeading(text, "chara-");
    const parts = text.split(",");
    if (parts.length < 3) {
        throw new Error();
    }
    const chara = parts[0]!;
    let attribute = parts[1]!;
    if (!["cool", "cute", "happy", "mysterious", "pure"].includes(attribute)) {
        attribute = "cool";
    }
    const trained = parts[2]!.endsWith("+");
    let rarity = removeTrail(parts[2]!, "+");
    if (!["1", "2", "3", "4", "bd"].includes(rarity)) {
        rarity = "3";
    }
    return h(CardThumbnail, {
        img: chara,
        attribute: attribute as "cool" | "cute" | "happy" | "mysterious" | "pure",
        rarity: rarity as "1" | "2" | "3" | "4" | "bd",
        trained
    });
}
