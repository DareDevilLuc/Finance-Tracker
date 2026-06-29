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

const router = useRouter()

const { fetchTransactions, newTransaction } = useTransactions()

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

</script>

<template>
  <div class="app-content">
    <div class="top-section">
      <Card>
        <template #title>
          Current Amount (PHP)
        </template>
        <template #content>
          <p>{{ allowanceTotal }}</p>
        </template>
      </Card>
      <Card>
        <template #title>Amount Spent (PHP)</template>
        <template #content>
          <p>{{ expenseTotal }}</p>
        </template>
      </Card>
      <Card>
        <template #title>Net Gain/Loss (PHP)</template>
        <template #content>
          <p>{{ differenceTotal }}</p>
        </template>
      </Card>
    </div>

    <div class="data-section">
      <Card>
        <template #content>
          <div class="month-button">
            <DatePicker v-model="date" showIcon fluid iconDisplay="input" dateFormat="mm/yy" view="month" />
            <Button label="Add Allowance/Expense" @click="visible = true" />
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <DataTable tableStyle="min-width: 50rem" :value="filteredTransactions">
            <Column field="date" header="Date" />
            <Column field="type" header="Type">
              <template #body="{ data }">
                <Tag :value="data.type" :severity="data.type === 'Expense' ? 'danger' : 'success'" />
              </template>
            </Column>
            <Column field="amount" header="Amount" />
            <Column field="description" header="Description" />
          </DataTable>
          <p>Current Month's Total Allowance: {{ allowanceMonthTotal }}</p>
          <p>Current Month's Total Expense: {{ expenseMonthTotal }}</p>
          <p>Current Month's Total Gain/Loss: {{ differenceMonthTotal }}</p>
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

.top-section {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.data-section {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.month-button {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dialog-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
