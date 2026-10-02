import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

export const PARALLAX = {
  media: {
    smallScreen: '(max-width: 639px)',
    desktop: '(min-width: 1024px)',
    smallScreenScale: 0.5,
  },
  spring: {
    stiffness: 70,
    damping: 24,
    restDelta: 0.001,
  },
  hero: {
    runwaySVH: 170,
    photo: {
      frameHeight: 100,
      imageOverscan: 35,
      yPercent: [0, 30],
      scale: [1.05, 1.3],
    },
    frame: {
      yPercent: [0, 12],
      scale: [1, 0.94],
    },
    outlineXPercent: [0, -25],
    content: {
      yPercent: [0, -60],
      opacity: [1, 0],
      opacityProgress: [0.6, 0.95],
    },
    entrance: {
      y: 48,
      duration: 0.9,
      delay: 0.15,
    },
  },
  section: {
    titleX: [-60, 60],
    watermarkX: [120, -120],
    watermarkOpacity: 0.06,
    watermarkFontVW: 18,
    columnY: [
      [0, -80],
      [0, 40],
      [0, -40],
    ],
    cardPhotoHeight: 120,
    cardPhotoYPercent: [-8, 8],
    circleY: [-80, 80],
    cardRevealY: 36,
    cardRevealDuration: 0.55,
    cardRevealIndexDelay: 0.08,
    cardRevealViewportAmount: 0.3,
  },
}

export function useParallaxPreferences() {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [isSmallScreen, setIsSmallScreen] = useState(() => (
    typeof window !== 'undefined'
    && window.matchMedia(PARALLAX.media.smallScreen).matches
  ))
  const [isDesktop, setIsDesktop] = useState(() => (
    typeof window !== 'undefined'
    && window.matchMedia(PARALLAX.media.desktop).matches
  ))

  useEffect(() => {
    const smallScreenQuery = window.matchMedia(PARALLAX.media.smallScreen)
    const desktopQuery = window.matchMedia(PARALLAX.media.desktop)
    const updateViewport = () => {
      setIsSmallScreen(smallScreenQuery.matches)
      setIsDesktop(desktopQuery.matches)
    }

    smallScreenQuery.addEventListener('change', updateViewport)
    desktopQuery.addEventListener('change', updateViewport)

    return () => {
      smallScreenQuery.removeEventListener('change', updateViewport)
      desktopQuery.removeEventListener('change', updateViewport)
    }
  }, [])

  return {
    prefersReducedMotion,
    isDesktop,
    distanceScale: prefersReducedMotion
      ? 0
      : isSmallScreen
        ? PARALLAX.media.smallScreenScale
        : 1,
  }
}
