import { useRef } from 'react'
import { Heart } from 'lucide-react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import FoodImage from './FoodImage.jsx'
import { PARALLAX } from '../lib/parallax.js'

function RecipeCard({
  recipe,
  index = 0,
  tone = 'light',
  isFavorite = false,
  prefersReducedMotion = false,
  distanceScale = 1,
  onToggleFavorite,
  onSelect,
}) {
  const photoFrameRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: photoFrameRef,
    offset: ['start end', 'end start'],
  })
  const smoothProgress = useSpring(scrollYProgress, PARALLAX.spring)
  const photoY = useTransform(
    smoothProgress,
    [0, 1],
    PARALLAX.section.cardPhotoYPercent.map((value) => `${value * distanceScale}%`),
  )
  const photoHeight = 100 + ((PARALLAX.section.cardPhotoHeight - 100) * distanceScale)
  const focusClass = tone === 'dark' ? 'focus-visible:outline-gold' : 'focus-visible:outline-navy'
  const localNameClass = tone === 'dark' ? 'text-gold' : 'text-pina'
  const timeClass = tone === 'dark' ? 'text-pina/75' : 'text-navy-deep'

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: PARALLAX.section.cardRevealY * distanceScale }}
      whileInView={prefersReducedMotion ? undefined : {
        opacity: 1,
        y: 0,
        transition: {
          duration: PARALLAX.section.cardRevealDuration,
          delay: index * PARALLAX.section.cardRevealIndexDelay,
          ease: 'easeOut',
        },
      }}
      viewport={{ once: true, amount: PARALLAX.section.cardRevealViewportAmount }}
      className="relative w-full"
    >
      <button
        type="button"
        aria-label={`Open recipe: ${recipe.name}`}
        onClick={() => onSelect?.(recipe)}
        className={`group block w-full text-left focus-visible:outline-2 ${focusClass} focus-visible:outline-offset-4`}
      >
        <span ref={photoFrameRef} className="relative block aspect-[3/4] overflow-hidden bg-navy">
          <motion.div
            aria-hidden="true"
            style={{ y: photoY, height: `${photoHeight}%` }}
            className={`absolute inset-x-0 top-0 ${distanceScale > 0 ? '[will-change:transform]' : ''}`}
          >
            <FoodImage
              src={recipe.image}
              alt={recipe.name}
              className="h-full w-full"
              imageClassName={prefersReducedMotion ? '' : 'transition-transform duration-700 group-hover:scale-[1.04]'}
            />
          </motion.div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 border border-pina/65"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-navy-deep via-navy-deep/95 to-navy-deep/85"
          />
          <span className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <span className={`mb-2 block font-sans text-xs font-medium uppercase ${localNameClass}`}>
              {recipe.localName}
            </span>
            <span className="block font-display text-3xl font-black leading-[0.95] text-pina sm:text-4xl">
              {recipe.name}
            </span>
          </span>
        </span>
        <span className={`mt-3 block font-sans text-sm ${timeClass}`}>
          {recipe.time}
        </span>
      </button>
      <button
        type="button"
        aria-label={`${isFavorite ? 'Remove' : 'Add'} ${recipe.name} ${isFavorite ? 'from' : 'to'} favorites`}
        aria-pressed={isFavorite}
        onClick={(event) => onToggleFavorite?.(recipe.id, event)}
        className="absolute right-3 top-3 z-10 grid size-11 place-items-center border border-pina/65 bg-navy-deep/75 focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
      >
        <Heart
          aria-hidden="true"
          size={19}
          strokeWidth={1.5}
          fill={isFavorite ? 'currentColor' : 'none'}
          className={isFavorite ? 'text-gold' : 'text-pina'}
        />
      </button>
    </motion.div>
  )
}

export default RecipeCard
