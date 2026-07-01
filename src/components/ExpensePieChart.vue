<script setup lang="ts">

import { Pie } from 'vue-chartjs';

defineProps<{
    data:any
}>()
</script>

<template>
    <Pie :data="data"/>
</template>

<style scoped></style>