import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import Ripple from 'primevue/ripple'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'

import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

import App from './App.vue'

import 'primeicons/primeicons.css'
import 'virtual:uno.css'

import './animation.css'
import './style-all.css'

const app = createApp(App)

const customTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}'
    }
  }
})

app.directive('ripple', Ripple)
app.directive('tooltip', Tooltip)

app.use(ToastService)
app.use(ConfirmationService)
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: customTheme,
    options: {
      darkModeSelector: '.dark-mode'
    }
  }
})

app.use(createPinia())

app.mount('#app')
