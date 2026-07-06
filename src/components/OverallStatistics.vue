<script setup lang="ts">
import ExpensePieChart from '@/components/ExpensePieChart.vue'
import Panel from 'primevue/panel';
import Card from 'primevue/card'
import { computed } from 'vue';
import {
  Chart as ChartJs,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import Divider from 'primevue/divider';

ChartJs.register(
  ArcElement,
  Tooltip,
  Legend
)

const props = defineProps<{
    allowanceOverallTotal : number
    expenseOverallTotal : number
    differenceOverall :  number
    
}>()

const chartData = computed(() => ({
  labels: ['Allowance', 'Expense'],
  datasets: [
    {
      data: [props.allowanceOverallTotal, props.expenseOverallTotal],
      backgroundColor: [
        '#9fe1cb',
        '#f7c1c1',
      ]
    }
  ],
}))

</script>

<template>
    <Card>
        <template #title>Overall Statistics</template>
        <template #content>
            <ExpensePieChart :data="chartData" />
            <div style="margin-top: 4px;">
                <Panel header="Summary">
                    <div style="display: flex; flex-direction: column;">
                        <div
                            style="display: flex; justify-content: space-between; background-color: #6deec1; color: #085041;">
                            <span>Total Allowance</span>
                            <span>₱{{ props.allowanceOverallTotal }}</span>
                        </div>
                        <div
                            style="display: flex; justify-content: space-between; background-color: #fcebeb; color: #791f1f;">
                            <span>Total Expense</span>
                            <span>₱<span v-if="props.expenseOverallTotal">-</span>{{ props.expenseOverallTotal }}</span>
                        </div>
                        <Divider />
                        <div
                            style="display: flex; justify-content: space-between; background-color: #e6f1fb; color: #0c447c;">
                            <span>Net Gain/Loss</span>
                            <span>₱{{ props.differenceOverall }}</span>
                        </div>
                    </div>
                </Panel>
            </div>
        </template>
    </Card>
</template>

<style scoped></style>