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
import { Form } from '@primevue/forms'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { useTransactions } from '@/composables/useTransactions'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'

const toast = useToast()
const router = useRouter()

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

const allowanceTotal = computed(() => {
  return transactions.value.reduce((accumulator, item) => {
    if (item.type === 'Allowance') {
      return accumulator + item.amount
    } else { return accumulator }
  }, 0)
})

const expenseTotal = computed(() => {
  return transactions.value.reduce((accumulator, item) => {
    if (item.type === 'Expense') {
      return accumulator + item.amount
    } else { return accumulator }
  }, 0)
})

const differenceTotal = computed(() => {
  return allowanceTotal.value - expenseTotal.value
})


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
    succes.value = "New transaction added."
  }
  catch (e: any) {
    fail.value = e.message
  }
}

watch(date, (newDate) => {
  console.log(newDate.toLocaleString('en-CA').slice(0, 7))
})

const handleDeleteTransaction = async (data: any) => {
  console.log(data)
  try {
    await deleteTransaction(data.id)
    toast.add({ summary: 'Delete successful', severity: 'success', life: 2000 })
    transactions.value = transactions.value.filter(
      transaction => transaction.id !== data.id
    )
  } catch (e: any) {
    toast.add({ summary: 'Something wrong has occured, try again', severity: 'error', life: 2000 })
  }
}

</script>

<template>
  <Toast />
  <div class="app-content">
    <div style="margin-right: auto ;">
      <h1>Personal Finance Tracker</h1>
    </div>
    <div class="whole-section">
      <div class="summary-cards">
        <Card :pt="{ root: { style: 'background: #e1f5ee; border: none;' } }">
          <template #title>
            <span style="color: #0F6E56;">Current Amount (PHP)</span>
          </template>
          <template #content>
            <p style="color: #085041;">{{ allowanceTotal }}</p>
          </template>
        </Card>

        <Card :pt="{ root: { style: 'background: #fcebeb; border: none;' } }">
          <template #title>
            <span style="color: #A32D2D;">Amount Spent (PHP)</span>
          </template>
          <template #content>
            <p style="color: #791F1F;">{{ expenseTotal }}</p>
          </template>
        </Card>

        <Card :pt="{ root: { style: 'background: #e6f1fb; border: none;' } }">
          <template #title>
            <span style="color: #185FA5;">Net Gain/Loss (PHP)</span>
          </template>
          <template #content>
            <p style="color: #0C447C;">{{ differenceTotal }}</p>
          </template>
        </Card>
      </div>


      <Card>
        <template #content>
          <div class="data-section">
            <div class="toolbar">
              <DatePicker v-model="date" showIcon iconDisplay="input" dateFormat="mm/yy" view="month" />
              <Button icon="pi pi-plus" label="Add Transactions/Expenses" @click="visible = true" />
            </div>
            <DataTable tableStyle="min-width: 45rem" :value="filteredTransactions" paginator :rows="3">
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
                  <Button icon="pi pi-trash" rounded severity="danger" text @click="handleDeleteTransaction(data)" />
                </template>
              </Column>
              <template #empty>
                <div class="empty-table">
                  <Button iconOnly severity="secondary" icon="pi pi-plus" rounded @click="visible = true" />
                  <p style="font-weight: lighter;">Currently no transactions placed for this month</p>
                </div>
              </template>
            </DataTable>
            <div style="display: flex; flex-direction: row; gap: 3rem;">
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

              <Card :pt="{ root: { style: 'background: #fcebeb; border: none;' } }">
                <template #title><span style="color: #A32D2D;">Month's Expense (PHP)</span></template>
                <template #content>
                  <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <p style="font-size: xx-large; margin: 0; color: #791F1F;">₱<span
                        v-if="expenseMonthTotal > 0">-</span>{{ expenseMonthTotal }}</p>
                    <Tag icon="pi pi-arrow-down" style="background: #f7c1c1; color: #571a1a; margin-right: auto;"
                      value="Monthly Expenses" />
                  </div>
                </template>
              </Card>

              <Card :pt="{ root: { style: 'background: #e6f1fb; border: none;' } }">
                <template #title><span style="color: #185FA5;">Month's Net Gain/Loss (PHP)</span></template>
                <template #content>
                  <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <p style="font-size: xx-large; margin: 0; color: #0C447C;">₱{{ differenceMonthTotal }}</p>
                    <Tag icon="pi pi-chart-line" style="background: #b5d4f4; color: #173d64; margin-right: auto;"
                      value="Monthly Net" />
                  </div>
                </template>
              </Card>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <Button label="Log out" @click="handleSignout" />
  </div>

  <Dialog v-model:visible="visible" modal header="Add Allowance/Expense" :style="{ width: '25rem' }">
    <Form @submit="onFormSubmit">
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
    <p v-if="fail">{{ fail }}</p>
    <p v-if="succes">{{ succes }}</p>
  </Dialog>
</template>

<style>
.app-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.summary-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.whole-section {
  display: flex;
  flex-direction: row;
  gap: 1rem;
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
