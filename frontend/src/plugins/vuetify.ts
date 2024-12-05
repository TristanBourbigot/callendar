/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify,ThemeDefinition } from 'vuetify'
import { fr } from 'vuetify/locale';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
const callendarDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#1C0023',
    surface: '#1C0023',
    primary: '#FFFFFF',
    'primary-darken-1': '#FFFFFF',
    'primary-link': '#F24405',
    secondary: '#FFFFFF',
    'secondary-darken-1': '#018786',
    'secondary-link': '#FA7909',
    'secondary-link-hover': '#FEA929',
    error: '#A60808',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#F25C05',
  },
}
export default createVuetify({
  theme: {
    defaultTheme: 'callendarDarkTheme',
    themes:{
      callendarDarkTheme,
    },
  },
  locale: {
    locale: 'fr',
    fallback: 'fr',
    messages: { fr }
  }
})
