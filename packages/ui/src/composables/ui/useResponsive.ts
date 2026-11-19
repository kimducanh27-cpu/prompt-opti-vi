import { ref, computed, onMounted, onUnmounted } from 'vue'

import type { ResponsiveConfig } from '../../types/components'
import { WORKSPACE_SPLIT_MIN_WIDTH } from './useWorkspaceLayout'

/**
 * Responsive Layout Composable (Mobile-First Aligned)
 * Unifies breakpoints with DESIGN.md and useWorkspaceLayout (1024px split boundary):
 * - xs: < 360px (compact small phones)
 * - sm: 360px - 639px (primary mobile target, including Honor Magic 6 ~412px-421px)
 * - md: 640px - 1023px (large foldables / portrait tablets, compact workspace mode)
 * - lg: 1024px - 1279px (desktop split-pane)
 * - xl: >= 1280px (wide desktop split-pane)
 */
export function useResponsive() {
  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : WORKSPACE_SPLIT_MIN_WIDTH)

  const breakpoints = {
    xs: 0,
    sm: 360,
    md: 640,
    lg: WORKSPACE_SPLIT_MIN_WIDTH,
    xl: 1280
  }

  const updateWidth = () => {
    if (typeof window !== 'undefined') {
      windowWidth.value = window.innerWidth
    }
  }

  const currentBreakpoint = computed(() => {
    const width = windowWidth.value
    if (width >= breakpoints.xl) return 'xl'
    if (width >= breakpoints.lg) return 'lg'
    if (width >= breakpoints.md) return 'md'
    if (width >= breakpoints.sm) return 'sm'
    return 'xs'
  })

  // Mobile covers xs (<360) and sm (360-639, e.g., Honor Magic 6)
  const isMobile = computed(() => ['xs', 'sm'].includes(currentBreakpoint.value))
  // Tablet covers md (640-1023)
  const isTablet = computed(() => currentBreakpoint.value === 'md')
  // Desktop starts strictly at WORKSPACE_SPLIT_MIN_WIDTH (1024px)
  const isDesktop = computed(() => ['lg', 'xl'].includes(currentBreakpoint.value))

  const responsiveConfig = computed((): ResponsiveConfig => ({
    breakpoints,
    currentBreakpoint: currentBreakpoint.value,
    isMobile: isMobile.value,
    isTablet: isTablet.value,
    isDesktop: isDesktop.value
  }))

  const gridConfig = computed(() => {
    switch (currentBreakpoint.value) {
      case 'xs':
        return { cols: 1, xGap: 8, yGap: 8 }
      case 'sm':
        return { cols: 1, xGap: 12, yGap: 12 }
      case 'md':
        return { cols: 2, xGap: 14, yGap: 14 }
      case 'lg':
        return { cols: 2, xGap: 20, yGap: 20 }
      case 'xl':
        return { cols: 3, xGap: 24, yGap: 24 }
      default:
        return { cols: 1, xGap: 12, yGap: 12 }
    }
  })

  const spaceSize = computed(() => {
    switch (currentBreakpoint.value) {
      case 'xs':
      case 'sm':
        return 'small' as const
      case 'md':
      case 'lg':
        return 'medium' as const
      case 'xl':
        return 'large' as const
      default:
        return 'medium' as const
    }
  })

  const buttonSize = computed<'small' | 'medium' | 'large'>(() => {
    // Naive UI renders 'medium' at 34px; the mobile design system raises every
    // interactive control to the 44px touch floor in CSS, so the JS size stays
    // 'medium' while the declared union keeps callers type-safe.
    switch (currentBreakpoint.value) {
      case 'xs':
      case 'sm':
        return 'medium'
      default:
        return 'medium'
    }
  })

  const inputSize = computed(() => {
    return 'medium' as const
  })

  const modalWidth = computed(() => {
    switch (currentBreakpoint.value) {
      case 'xs':
        return '96vw'
      case 'sm':
        return '94vw'
      case 'md':
        return '88vw'
      case 'lg':
        return '72vw'
      case 'xl':
        return '60vw'
      default:
        return '80vw'
    }
  })

  const cardPadding = computed(() => {
    switch (currentBreakpoint.value) {
      case 'xs':
        return '12px'
      case 'sm':
        return '14px'
      case 'md':
        return '16px'
      default:
        return '20px'
    }
  })

  const shouldUseVerticalLayout = computed(() => {
    return isMobile.value || isTablet.value
  })

  // Unified with useWorkspaceLayout.isCompact (< 1024px)
  const shouldUseCompactMode = computed(() => {
    return windowWidth.value < WORKSPACE_SPLIT_MIN_WIDTH
  })

  const fontSize = computed(() => {
    switch (currentBreakpoint.value) {
      case 'xs':
        return { small: '12px', medium: '14px', large: '16px' }
      case 'sm':
        return { small: '13px', medium: '14px', large: '17px' }
      default:
        return { small: '14px', medium: '16px', large: '18px' }
    }
  })

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateWidth)
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateWidth)
    }
  })

  return {
    windowWidth,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    responsiveConfig,
    gridConfig,
    spaceSize,
    buttonSize,
    inputSize,
    modalWidth,
    cardPadding,
    fontSize,
    shouldUseVerticalLayout,
    shouldUseCompactMode,
    breakpoints
  }
}