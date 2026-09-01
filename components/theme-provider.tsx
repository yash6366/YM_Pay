'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps as NextThemeProviderProps,
} from 'next-themes'

type ThemeAttribute = 'class' | `data-${string}`

type ThemeProviderProps = Omit<NextThemeProviderProps, 'attribute'> & {
  children: React.ReactNode
  attribute?: ThemeAttribute | ThemeAttribute[]
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
