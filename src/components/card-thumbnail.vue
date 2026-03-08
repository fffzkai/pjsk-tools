<script setup lang="ts">
type Attribute = "cool" | "cute" | "happy" | "mysterious" | "pure";
type Rarity = "1" | "2" | "3" | "4" | "bd";
interface Props {
    img: string;
    attribute: Attribute;
    rarity: Rarity;
    trained?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    trained: false
});
let starCount = 1;
let starName = "star-normal";
if (props.rarity == "bd") {
    starName = "rarity-birthday";
} else {
    if (props.trained) {
        starName = "rarity-star-after-training";
    }
    starCount = Number(props.rarity);
}
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 156 156">
        <image
            :href="`https://snowyassets.exmeaning.com/startapp/thumbnail/chara/${img}.png`"
            x="8"
            y="8"
            height="140"
            width="140"
        ></image>
        <image
            :href="`/assets/icons/card-frame-${rarity}.png`"
            x="0"
            y="0"
            height="156"
            width="156"
        ></image>
        <image
            :href="`/assets/icons/attribute-${attribute}.png`"
            x="1"
            y="1"
            width="35"
            height="35"
        ></image>
        <image
            v-for="n in starCount"
            :key="n"
            :href="`/assets/icons/${starName}.png`"
            :x="n * 26 - 16"
            y="118"
            width="28"
            height="28"
        ></image>
    </svg>
</template>

<style scoped></style>
