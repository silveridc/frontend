import { createI18n } from 'vue-i18n'
import cn from './zh-CN'
import en from './en-US'
const i18n = createI18n({
  locale: localStorage.getItem('client-locale') || 'zh-CN',
  fallbackLocale: 'zh-CN', legacy: false,
  messages: { 'en-US': en, 'zh-CN': cn }
})
export default i18n
