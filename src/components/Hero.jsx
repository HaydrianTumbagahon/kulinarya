import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import FoodImage from './FoodImage.jsx'
import { PARALLAX, useParallaxPreferences } from '../lib/parallax.js'

function Hero() {
  const heroRef = useRef(null)
  const { prefersReducedMotion, distanceScale } = useParallaxPreferences()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  })
  const smoothProgress = useSpring(scrollYProgress, PARALLAX.spring)
  const progress = useTransform(smoothProgress, (value) => (prefersReducedMotion ? 0 : value))
  const photoY = useTransform(
    progress,
    [0, 1],
    PARALLAX.hero.photo.yPercent.map((value) => `${value * distanceScale}%`),
  )
  const photoScale = useTransform(
    progress,
    [0, 1],
    PARALLAX.hero.photo.scale.map((value) => 1 + ((value - 1) * distanceScale)),
  )
  const frameY = useTransform(
    progress,
    [0, 1],
    PARALLAX.hero.frame.yPercent.map((value) => `${value * distanceScale}%`),
  )
  const frameScale = useTransform(
    progress,
    [0, 1],
    PARALLAX.hero.frame.scale.map((value) => 1 + ((value - 1) * distanceScale)),
  )
  const outlineX = useTransform(
    progress,
    [0, 1],
    PARALLAX.hero.outlineXPercent.map((value) => `${value * distanceScale}%`),
  )
  const contentY = useTransform(
    progress,
    [0, 1],
    PARALLAX.hero.content.yPercent.map((value) => `${value * distanceScale}%`),
  )
  const contentOpacity = useTransform(
    progress,
    PARALLAX.hero.content.opacityProgress,
    PARALLAX.hero.content.opacity,
  )
  const photoHeight = PARALLAX.hero.photo.frameHeight
    + (PARALLAX.hero.photo.imageOverscan * distanceScale)
  const motionLayerClass = prefersReducedMotion ? '' : '[will-change:transform]'

  return (
    <header
      ref={heroRef}
      id="top"
      style={{ height: `${PARALLAX.hero.runwaySVH}svh` }}
      className="dark-surface banig relative isolate bg-navy-deep text-pina"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-navy-deep banig">
        <div className="absolute right-0 top-[12%] z-20 h-[66%] w-[68%] overflow-hidden sm:right-[4%] sm:top-[9%] sm:h-[72%] sm:w-[58%]">
          <motion.div
            aria-hidden="true"
            style={{ y: photoY, scale: photoScale }}
            className={`absolute inset-0 origin-center ${motionLayerClass}`}
          >
            <FoodImage
              src="/images/hero.png"
              alt=""
              className="absolute inset-x-0 top-0 w-full"
              style={{ height: `${photoHeight}%` }}
            />
          </motion.div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[40%] bg-gradient-to-t from-navy-deep via-navy-deep/95 to-navy-deep/85"
          />
        </div>

        <motion.p
          aria-hidden="true"
          style={{ x: outlineX, WebkitTextStroke: '1px var(--color-gold)' }}
          className={`pointer-events-none absolute left-[2%] top-[24%] z-10 whitespace-nowrap font-display text-[28vw] font-black leading-none text-transparent ${motionLayerClass}`}
        >
          Kulinarya
        </motion.p>

        <motion.div
          aria-hidden="true"
          style={{ y: frameY, scale: frameScale }}
          className={`pointer-events-none absolute right-[2%] top-[8%] z-30 h-[70%] w-[68%] border border-gold ${motionLayerClass} sm:right-[2.5%] sm:top-[6%] sm:h-[76%] sm:w-[58%]`}
        />

        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className={`absolute inset-x-[5%] bottom-[7%] z-40 ${motionLayerClass} sm:bottom-[8%]`}
        >
          <motion.h1
            initial={{ opacity: 0, y: PARALLAX.hero.entrance.y * distanceScale }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: PARALLAX.hero.entrance.duration,
              delay: PARALLAX.hero.entrance.delay,
              ease: 'easeOut',
            }}
            className={`font-display text-[clamp(4.5rem,17vw,15rem)] font-black leading-[0.78] text-pina ${motionLayerClass}`}
          >
            Kulinarya
          </motion.h1>
          <div className="mt-6 flex flex-col items-start gap-5 lg:ml-[38%] lg:mt-8 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-md font-sans text-sm italic leading-relaxed text-pina/85 sm:text-base">
              Step into our kusina and savor the flavors that turn simple meals into happy gatherings—ulams, breads, and chilled treats made with love.
            </p>
            <a
              href="#flavors-of-home"
              className="inline-flex items-center gap-3 border-b border-gold pb-2 font-sans text-sm text-pina hover:text-gold focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4"
            >
              Start browsing
              <ArrowDown aria-hidden="true" size={16} strokeWidth={1.5} />
            </a>
          </div>
        </motion.div>
      </div>
    </header>
  )
}

export default Hero
