import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  // NOTE (Slice 2): Tailwind v4 does NOT emit v3-style theme.extend.colors
  // as CSS variables — the baseline dist/style.css contained ZERO
  // occurrences of --color-primary/secondary/background/card/text/border
  // (while default vars such as --color-red-500 ARE emitted). The old
  // theme.extend.colors block (which referenced those 6 undefined vars)
  // and the dead theme-blue/green/purple variants (0 usages in src) have
  // been removed. The 6 colour names now live in Tailwind 4 @theme in
  // packages/ui/src/styles/tokens.css, mapped from the design tokens.
  //
  // This file is still loaded via `@config` in styles/index.css because
  // the two plugins ARE applied by v4 (verified Slice 2: .prose rules
  // from @tailwindcss/typography are in dist/style.css and used by
  // OutputDisplayCore.vue). Do not remove the @config directive without
  // re-verifying .prose / forms output in the built CSS.
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 启用基于类的暗黑模式 (v4-native form also in tokens.css: @custom-variant dark)
  theme: {
    extend: {},
  },
  plugins: [
    forms,
    typography,
  ],
}
