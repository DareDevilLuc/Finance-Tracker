<script setup lang="ts">
import Card from 'primevue/card'
import Tag from 'primevue/tag'

const props = defineProps<{
    cardBgColor : string,
    titleColor : string,
    titleText : string,
    amount : number,
    numberColor : string,
    tagBgColor : string,
    tagIcon : string,
    tagFontColor : string
    tagText : string
}>()

</script>

<template>
    <Card :pt="{ root: { style: `background: ${props.cardBgColor}; border: none;` } }">
        <template #title><span :style="{color: props.titleColor}">{{ props.titleText }}</span></template>
        <template #content>
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <p :style="{fontSize: 'xx-large', margin: 0, color: props.numberColor}">₱<span v-if="props.tagText == 'Monthly Expenses' && props.amount">-</span>{{ props.amount }}</p>
                <Tag :icon="props.tagIcon" :style="{background: props.tagBgColor, color: props.tagFontColor, marginRight: 'auto'}"
                    :value="props.tagText" />
            </div>
        </template>
    </Card>
</template>

<style scoped></style>