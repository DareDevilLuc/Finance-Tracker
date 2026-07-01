<script setup lang="ts">

import { chartData } from '../composables/chartConfig';
import { Pie } from 'vue-chartjs';

</script>

<template>
    <Pie :data="chartData"/>
</template>

<style scoped></style>