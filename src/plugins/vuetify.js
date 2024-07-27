import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import {
  VApp,
  VMain,
  VBtn,
  VIcon,
  VCheckbox,
  VCard,
  VCol,
  VRow,
  VListGroup,
  VList,
  VListItem,
  VContainer,
  VTextField,
  VBreadcrumbs,
  VSwitch,
  VRadioGroup,
  VRadio,
  VForm,
  VImg,
  VEmptyState,
} from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { createVuetify } from 'vuetify'

const cutomColorTheme = {
  dark: false,
colors:{
  purple: '#4A148C',
  white: '#FFFFFF',
  DarkPurple : '#4C0070',
  White: '#FFFFFF',
  LightGray: '#F2F2F',
  MediumGray:'#9E9E9E'
}
}


export default createVuetify({
  components: {
    VApp,
    VMain,
    VBtn,
    VIcon,
    VCheckbox,
    VCard,
    VCol,
    VRow,
    VListGroup,
    VList,
    VListItem,
    VContainer,
    VTextField,
    VBreadcrumbs,
    VSwitch,
    VRadioGroup,
    VRadio,
    VForm,
    VImg,
    VEmptyState,
    
  },
  directives,
  rtl: true, 
  theme: {
 
    defaultTheme:'cutomColorTheme',
    themes: {
      cutomColorTheme
    },
   
  },
})
