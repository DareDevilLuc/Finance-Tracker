import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import App from './App.vue'
import router from './router'
import { definePreset } from '@primeuix/themes'
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{green.50}',
      100: '{green.100}',
      200: '{green.200}',
      300: '{green.300}',
      400: '{green.400}',
      500: '{green.500}',
      600: '{green.600}',
      700: '{green.700}',
      800: '{green.800}',
      900: '{green.900}',
      950: '{green.950}'
    },
  },
  components: {
    card: {
      colorScheme: {
        light: {
          root: {
            background: '{gray.50}',
            shadow: '0 2px 12px rgba(0,0,0,0.1)'
          }
        }
      }
    }
  }
})

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: false || 'none',
    },
  },
})

app.use(ToastService)
app.mount('#app')
