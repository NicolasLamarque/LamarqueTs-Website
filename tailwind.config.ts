import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.{js,ts,vue}',
    './error.{js,ts,vue}',
    './nuxt.config.{js,ts}'
  ],
  darkMode: 'class', // 👈 nécessaire pour activer le mode sombre avec DaisyUI
  theme: {
    extend: {}
  },
  plugins: [daisyui], 
  daisyui: {
    themes: ['light', 'dark', 'corporate'], 
  }
}