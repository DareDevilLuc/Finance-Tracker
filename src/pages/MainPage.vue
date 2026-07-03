<script setup lang="ts">
import MonthSummaryCard from '@/components/MonthSummaryCard.vue'
import TransactionTable from '@/components/TransactionTable.vue'
import AddTransactionDialog from '@/components/AddTransactionDialog.vue'
import { ref, onMounted, watch, computed } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import ConfirmPopup from 'primevue/confirmpopup'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { useTransactions } from '@/composables/useTransactions'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import { useConfirm } from 'primevue/useconfirm'
import ExpensePieChart from '@/components/ExpensePieChart.vue'
import {
  Chart as ChartJs,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import Panel from 'primevue/panel';
import Divider from 'primevue/divider';

const toast = useToast()
const router = useRouter()
const confirm = useConfirm()

const { fetchTransactions } = useTransactions()

const { signOut } = useAuth()

const date = ref(new Date())
const filtereDate = computed(() => {
  return `${date.value.getFullYear()}-${String(date.value.getMonth() + 1).padStart(2, "0")}`
})
const visible = ref(false)

const transactions = ref<any[]>([])
onMounted(async () => {
  transactions.value = await fetchTransactions()
})

const allowanceOverallTotal = computed(() => {
  return transactions.value.reduce((accumulator, item) => {
    if (item.type === 'Allowance') {
      return accumulator + item.amount
    } else { return accumulator }
  }, 0)
})

const expenseOverallTotal = computed(() => {
  return transactions.value.reduce((accumulator, item) => {
    if (item.type === 'Expense') {
      return accumulator + item.amount
    } else { return accumulator }
  }, 0)
})

const differenceOverall = computed(() => allowanceOverallTotal.value - expenseOverallTotal.value)


const filteredTransactions = computed(() => {
  return transactions.value.filter(
    transaction => filtereDate.value === transaction.date.slice(0, 7)
  ).sort((a, b) => {
    if (a.date > b.date) { return 1 }
    if (a.date < b.date) { return -1 }
    return 0
  })
})

const allowanceMonthTotal = computed(() => {
  return filteredTransactions.value.reduce((accumulator, item) => {
    if (item.type === 'Allowance') {
      return accumulator + item.amount
    } else { return accumulator }
  }, 0)
})

const expenseMonthTotal = computed(() => {
  return filteredTransactions.value.reduce((accumulator, item) => {
    if (item.type === 'Expense') {
      return accumulator + item.amount
    } else { return accumulator }
  }, 0)
})

const differenceMonthTotal = computed(() => {
  return allowanceMonthTotal.value - expenseMonthTotal.value
})

const handleSignout = async () => {
  await signOut()
  router.push('/auth/login')
}


const handleNewTransaction = (transaction: any) => {
  transactions.value.push(transaction)
  transactions.value.sort((a, b) => {
    if (a.date > b.date) { return 1 }
    if (a.date < b.date) { return -1 }
    return 0
  })
  toast.add({ summary: 'New transaction added', severity: 'success', group: 'bottom-center', life: 2000 })
}

watch(date, (newDate) => {
  console.log(newDate.toLocaleString('en-CA').slice(0, 7))
})

const handleDeleteTransaction = async (data: any) => {
  toast.add({ summary: 'Delete Successful', severity: 'info', life: 2000 })
  transactions.value = transactions.value.filter(
    transaction => transaction.id !== data.id
  )
}


ChartJs.register(
  ArcElement,
  Tooltip,
  Legend
)

const chartData = computed(() => ({
  labels: ['Allowance', 'Expense'],
  datasets: [
    {
      data: [allowanceOverallTotal.value, expenseOverallTotal.value],
      backgroundColor: [
        '#9fe1cb',
        '#f7c1c1',
      ]
    }
  ],
}))


</script>

<template>
  <Toast position="bottom-center" group="bottom-center" />
  <Toast />
  <ConfirmPopup></ConfirmPopup>
  <div class="app-content">
    <div style="margin-right: auto ;">
      <h1>Personal Finance Tracker</h1>
    </div>
    <div class="grid-container">
      <div style="grid-area: card1;">
        <MonthSummaryCard cardBgColor="#e1f5ee" titleColor="#0F6E56" titleText="Month's Allowance (PHP)"
          :amount="allowanceMonthTotal" numberColor="#085041" tagBgColor="#9fe1cb" tagIcon="pi pi-arrow-up"
          tagFontColor="#05362e" tagText="Monthly Allowance" />
      </div>
      <div style="grid-area: card2;">
        <MonthSummaryCard cardBgColor="#fcebeb" titleColor="#A32D2D" titleText="Month's Expense (PHP)"
          :amount="expenseMonthTotal" numberColor="#791F1F" tagBgColor="#f7c1c1" tagIcon="pi pi-arrow-down"
          tagFontColor="#571a1a" tagText="Monthly Expenses" />
      </div>
      <div style="grid-area: card3;">
        <MonthSummaryCard cardBgColor="#e6f1fb" titleColor="#185FA5" titleText="Month's Net Gain/Loss (PHP)"
          :amount="differenceMonthTotal" numberColor="#0C447C" tagBgColor="#b5d4f4" tagIcon="pi pi-chart-line"
          tagFontColor="#173d64" tagText="Monthly Net/Loss" />
      </div>

      <div style="grid-area: card4;">
        <TransactionTable v-model:date="date" :filteredTransactions="filteredTransactions" v-on:btn-click="visible = true"
          v-on:delete-row="handleDeleteTransaction" />
      </div>

      <div style="grid-area: card5;">
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
                    <span>₱{{ allowanceOverallTotal }}</span>
                  </div>
                  <div
                    style="display: flex; justify-content: space-between; background-color: #fcebeb; color: #791f1f;">
                    <span>Total Expense</span>
                    <span>₱<span v-if="expenseOverallTotal">-</span>{{ expenseOverallTotal }}</span>
                  </div>
                  <Divider />
                  <div
                    style="display: flex; justify-content: space-between; background-color: #e6f1fb; color: #0c447c;">
                    <span>Net Gain/Loss</span>
                    <span>₱{{ differenceOverall }}</span>
                  </div>
                </div>
              </Panel>
            </div>

          </template>
        </Card>
      </div>

    </div>

    <div style="display: flex; justify-content: center;">
      <Button label="Log out" @click="handleSignout" />
    </div>
  </div>

  <AddTransactionDialog v-model:visible="visible" @submitted="handleNewTransaction" />
</template>

<style>
.app-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1rem;
  grid-template-areas:
    "card1 card2 card3 card5"
    "card4 card4 card4 card5";
}

.data-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.toolbar {
  display: flex;
  width: 100%;
  align-items: center;
}

.toolbar .p-button {
  margin-left: auto;
}

.dialog-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-table {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 1rem;
}
</style>
