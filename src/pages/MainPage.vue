<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { supabase } from '../utils/supabase'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import ConfirmPopup from 'primevue/confirmpopup'
import { Form } from '@primevue/forms'
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

const { fetchTransactions, newTransaction, deleteTransaction } = useTransactions()

const { signOut } = useAuth()

const date = ref(new Date())
const filtereDate = computed(() => {
  return `${date.value.getFullYear()}-${String(date.value.getMonth() + 1).padStart(2, "0")}`
})
const visible = ref(false)
const types = ref(['Allowance', 'Expense'])

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

const fail = ref('')
const succes = ref('')

const onFormSubmit = async ({ values }: any) => {
  const dateSubmitted = values.date.toLocaleDateString('en-CA')
  try {
    const newSubmittedTransaction = await newTransaction(values.amount, values.type, dateSubmitted, values.description)
    transactions.value.push(newSubmittedTransaction)
    transactions.value.sort((a, b) => {
      if (a.date > b.date) { return 1 }
      if (a.date < b.date) { return -1 }
      return 0
    })
    toast.add({ summary: 'New transaction added', severity: 'success', group: 'bottom-center', life: 2000 })
  }
  catch (e: any) {
    fail.value = e.message
    toast.add({ summary: fail.value, severity: 'danger', life: 2000, group: 'bottom-center' })
  }

}

watch(date, (newDate) => {
  console.log(newDate.toLocaleString('en-CA').slice(0, 7))
})

const handleDeleteTransaction = async (data: any) => {
  console.log(data)
  try {
    await deleteTransaction(data.id)
    toast.add({ summary: 'Delete successful', severity: 'info', life: 2000 })
    transactions.value = transactions.value.filter(
      transaction => transaction.id !== data.id
    )
  } catch (e: any) {
    toast.add({ summary: 'Something wrong has occured, try again', severity: 'error', life: 2000 })
  }
}

const deleteConfirm = (event: any, data: any) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Delete this transaction?',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: () => {
      handleDeleteTransaction(data)
    }

  })
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
        <Card :pt="{ root: { style: 'background: #e1f5ee; border: none;' } }">
          <template #title><span style="color: #0F6E56;">Month's Allowance (PHP)</span></template>
          <template #content>
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              <p style="font-size: xx-large; margin: 0; color: #085041;">₱{{ allowanceMonthTotal }}</p>
              <Tag icon="pi pi-arrow-up" style="background: #9fe1cb; color: #05362e; margin-right: auto;"
                value="Monthly Allowance" />
            </div>
          </template>
        </Card>
      </div>

      <div style="grid-area: card2;">
        <Card :pt="{ root: { style: 'background: #fcebeb; border: none;' } }">
          <template #title><span style="color: #A32D2D;">Month's Expense (PHP)</span></template>
          <template #content>
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              <p style="font-size: xx-large; margin: 0; color: #791F1F;">₱<span v-if="expenseMonthTotal > 0">-</span>{{
                expenseMonthTotal }}</p>
              <Tag icon="pi pi-arrow-down" style="background: #f7c1c1; color: #571a1a; margin-right: auto;"
                value="Monthly Expenses" />
            </div>
          </template>
        </Card>
      </div>

      <div style="grid-area: card3;">
        <Card :pt="{ root: { style: 'background: #e6f1fb; border: none;' } }">
          <template #title><span style="color: #185FA5;">Month's Net Gain/Loss (PHP)</span></template>
          <template #content>
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              <p style="font-size: xx-large; margin: 0; color: #0C447C;">₱{{ differenceMonthTotal }}</p>
              <Tag icon="pi pi-chart-line" style="background: #b5d4f4; color: #173d64; margin-right: auto;"
                value="Monthly Net/Loss" />
            </div>
          </template>
        </Card>
      </div>

      <div style="grid-area: card4;">
        <Card>
          <template #content>
            <div class="data-section">
              <div class="toolbar">
                <DatePicker v-model="date" showIcon iconDisplay="input" dateFormat="mm/yy" view="month" />
                <Button icon="pi pi-plus" label="Add Transactions/Expenses" @click="visible = true" />
              </div>
              <div>
                <DataTable tableStyle="min-width: 100%" :value="filteredTransactions" paginator :rows="3">
                  <Column field="date" header="Date" />
                  <Column field="type" header="Type">
                    <template #body="{ data }">
                      <Tag :value="data.type" :severity="data.type === 'Expense' ? 'danger' : 'success'" />
                    </template>
                  </Column>
                  <Column field="amount" header="Amount" />
                  <Column field="description" header="Description" />
                  <Column header="Actions">
                    <template #body="{ data }">
                      <Button icon="pi pi-trash" rounded severity="danger" text @click="deleteConfirm($event, data)" />
                    </template>
                  </Column>
                  <template #empty>
                    <div class="empty-table">
                      <Button iconOnly severity="secondary" icon="pi pi-plus" rounded @click="visible = true" />
                      <p style="font-weight: lighter;">Currently no transactions placed for this month</p>
                    </div>
                  </template>
                </DataTable>
              </div>
            </div>
          </template>
        </Card>
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
                    <span>₱{{ expenseOverallTotal }}</span>
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

  <Dialog v-model:visible="visible" modal header="Add Allowance/Expense" :style="{ width: '25rem' }">
    <Form @submit="onFormSubmit" autocomplete="off">
      <div class="dialog-section">
        <label for="description">Description</label>
        <InputText id="description" name="description" fluid />

        <label for="amount">Amount (PHP)</label>
        <InputNumber id="amount" name="amount" fluid />

        <label for="type">Select Type</label>
        <Select id="type" name="type" :options="types" />

        <label for="type">Select Date</label>
        <DatePicker id="date" name="date" showIcon />

        <Button type="submit" label="Submit" />
      </div>
    </Form>
  </Dialog>
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
