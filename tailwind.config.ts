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
  
  darkMode: 'class',
  
  theme: {
    extend: {
      // 🔥 BREAKPOINTS PERSONNALISÉS POUR TOUS LES ÉCRANS
      screens: {
        'xs': '375px',      // Petits mobiles (iPhone SE)
        'sm': '640px',      // Mobiles standards
        'md': '768px',      // Tablettes portrait
        'lg': '1024px',     // Tablettes paysage / petits desktops
        'xl': '1280px',     // Desktops
        '2xl': '1536px',    // Grands écrans
        
        // 🎯 CRITIQUES POUR MODE PAYSAGE
        'landscape': { 'raw': '(orientation: landscape)' },
        'portrait': { 'raw': '(orientation: portrait)' },
        
        // Hauteurs spécifiques (mode paysage mobile)
        'short': { 'raw': '(max-height: 500px)' },
        'x-short': { 'raw': '(max-height: 400px)' },
        'tall': { 'raw': '(min-height: 800px)' },
        
        // Combinaisons utiles
        'mobile-landscape': { 
          'raw': '(max-width: 926px) and (orientation: landscape)' 
        },
      },
      
      // Espacements adaptatifs
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      
      // Hauteurs intelligentes
      minHeight: {
        'screen-1/2': '50vh',
        'screen-3/4': '75vh',
        'screen-safe': 'calc(100vh - 4rem)',
        'screen-short': 'min(100vh, 600px)',
      },
      
      maxHeight: {
        'screen-safe': 'calc(100vh - 4rem)',
        'landscape': '60vh',
      },
      
      // Largeurs fluides
      maxWidth: {
        'prose-wide': '75ch',
      },
      
      // Font sizes fluides (avec clamp)
      fontSize: {
        'fluid-xs': 'clamp(0.75rem, 2vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 2.5vw, 1rem)',
        'fluid-base': 'clamp(1rem, 3vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 3.5vw, 1.5rem)',
        'fluid-xl': 'clamp(1.25rem, 4vw, 1.875rem)',
        'fluid-2xl': 'clamp(1.5rem, 5vw, 2.25rem)',
        'fluid-3xl': 'clamp(1.875rem, 6vw, 3rem)',
        'fluid-4xl': 'clamp(2.25rem, 7vw, 3.75rem)',
        'fluid-5xl': 'clamp(3rem, 8vw, 4.5rem)',
      },
      
      // Transitions fluides
      transitionDuration: {
        '400': '400ms',
      },
      
      // Animations personnalisées
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
    }
  },
  
  plugins: [daisyui],
  
  daisyui: {
    themes: ['light', 'dark', 'corporate'],
    // Désactive les utilitaires inutilisés pour réduire la taille
    styled: true,
    base: true,
    utils: true,
    logs: false,
  },
  
  // Optimisations de production
  future: {
    hoverOnlyWhenSupported: true, // Hover uniquement sur devices qui le supportent
  },
}