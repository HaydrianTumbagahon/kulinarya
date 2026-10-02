import { useEffect, useRef, useState } from 'react'
import { Download, X } from 'lucide-react'
import { motion, useScroll, useSpring } from 'framer-motion'
import FoodImage from './FoodImage.jsx'
import ScrollProgressBar from './ScrollProgressBar.jsx'
import { downloadRecipeImage } from '../lib/downloadRecipe.js'

function RecipeModal({ recipe, lenisRef, onClose }) {
  const panelRef = useRef(null)
  const desktopScrollRef = useRef(null)
  const closeButtonRef = useRef(null)
  const exportRef = useRef(null)
  const [downloadStatus, setDownloadStatus] = useState('')
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 768px)').matches)
  const { scrollYProgress: panelScrollProgress } = useScroll({ container: panelRef })
  const { scrollYProgress: desktopScrollProgress } = useScroll({ container: desktopScrollRef })
  const panelProgress = useSpring(panelScrollProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const desktopProgress = useSpring(desktopScrollProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const progress = isDesktop ? desktopProgress : panelProgress

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const updateViewport = () => setIsDesktop(media.matches)
    media.addEventListener('change', updateViewport)
    return () => media.removeEventListener('change', updateViewport)
  }, [])

  useEffect(() => {
    const scrollY = window.scrollY
    const previousFocus = document.activeElement
    const lenis = lenisRef?.current
    const body = document.body
    const root = document.documentElement
    const previousBodyStyles = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    }
    const previousRootOverflow = root.style.overflow

    lenis?.stop()
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    root.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    return () => {
      body.style.position = previousBodyStyles.position
      body.style.top = previousBodyStyles.top
      body.style.width = previousBodyStyles.width
      root.style.overflow = previousRootOverflow
      window.scrollTo({ top: scrollY, behavior: 'instant' })
      lenis?.start()
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true })
      }
    }
  }, [lenisRef])

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }

    if (event.key !== 'Tab') return

    const focusable = panelRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    if (!focusable?.length) {
      event.preventDefault()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const focusOutsidePanel = !panelRef.current.contains(document.activeElement)

    if (event.shiftKey && (document.activeElement === first || focusOutsidePanel)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && (document.activeElement === last || focusOutsidePanel)) {
      event.preventDefault()
      first.focus()
    }
  }

  function closeFromBackdrop(event) {
    if (event.target === event.currentTarget) onClose()
  }

  async function downloadRecipe() {
    if (!exportRef.current) return

    try {
      await downloadRecipeImage(exportRef.current, recipe.id)
      setDownloadStatus('Recipe image downloaded.')
    } catch {
      setDownloadStatus('The recipe image could not be created. Please try again.')
    }
  }

  return (
    <motion.div
      onMouseDown={closeFromBackdrop}
      onTouchStart={closeFromBackdrop}
      onKeyDownCapture={handleKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="dark-surface fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/70 backdrop-blur-[1px]"
    >
      <ScrollProgressBar progress={progress} />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${recipe.id}-title`}
        aria-describedby={`${recipe.id}-summary`}
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="relative flex h-[100dvh] w-full flex-col overflow-y-auto overscroll-contain bg-pina md:grid md:h-[92dvh] md:max-w-[1200px] md:grid-cols-[1fr_1.1fr] md:grid-rows-[minmax(0,1fr)] md:overflow-hidden"
        data-lenis-prevent
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close recipe"
          onClick={onClose}
          className="sticky top-0 z-20 ml-auto mr-3 mt-3 -mb-11 grid size-11 shrink-0 place-items-center bg-navy-deep text-pina hover:bg-crimson focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 md:absolute md:right-4 md:top-4 md:m-0"
        >
          <X aria-hidden="true" size={20} strokeWidth={1.5} />
        </button>

        <div className="relative h-[45dvh] shrink-0 md:h-full md:min-h-0">
          <FoodImage
            src={recipe.image}
            alt={recipe.name}
            className="absolute inset-0 h-full w-full"
          />
          <span aria-hidden="true" className="absolute inset-x-0 bottom-1 h-1 bg-gold" />
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-crimson" />
        </div>

        <div
          ref={desktopScrollRef}
          data-lenis-prevent
          className="min-h-0 px-5 pt-6 pb-24 sm:px-9 sm:pt-9 md:h-full md:overflow-y-auto md:overscroll-contain md:pt-20"
        >
          <div ref={exportRef} className="bg-pina">
              <p className="font-sans text-xs font-semibold uppercase text-crimson">
                {recipe.localName}
              </p>
              <h2
                id={`${recipe.id}-title`}
                className="mt-2 pr-10 font-display text-4xl font-black leading-[0.95] sm:text-6xl"
              >
                {recipe.name}
              </h2>
              <p id={`${recipe.id}-summary`} className="mt-5 font-sans text-sm leading-relaxed text-navy-deep sm:text-base">
                {recipe.summary}
              </p>

              <div className="mt-6 grid gap-4 border-y border-navy/60 py-4 sm:grid-cols-2">
                <div>
                  <h3 className="font-sans text-xs font-semibold uppercase text-navy-deep">Taste</h3>
                  <p className="mt-1 font-sans text-sm leading-relaxed">{recipe.taste}</p>
                </div>
                <div>
                  <h3 className="font-sans text-xs font-semibold uppercase text-navy-deep">Time</h3>
                  <p className="mt-1 font-sans text-sm leading-relaxed">{recipe.time}</p>
                </div>
              </div>

              <section className="mt-6">
                <h3 className="font-display text-2xl font-bold">A little history</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-5xl first-letter:leading-none first-letter:text-crimson">{recipe.history}</p>
              </section>

          <div className="grid gap-8 border-t border-navy/60 p-5 sm:p-9 md:grid-cols-2">
            <section>
              <h3 className="font-display text-3xl font-bold">Ingredients</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 font-sans text-sm leading-relaxed marker:text-crimson">
                {recipe.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}
              </ul>
            </section>
            <section>
              <h3 className="font-display text-3xl font-bold">Method</h3>
              <ol className="mt-4 list-decimal space-y-3 pl-5 font-sans text-sm leading-relaxed marker:font-semibold marker:text-navy">
                {recipe.steps.map((step, index) => <li key={`${recipe.id}-step-${index}`}>{step}</li>)}
              </ol>
            </section>
          </div>
        </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-navy/60 px-1 py-4">
          <p aria-live="polite" className="font-sans text-sm text-navy-deep">{downloadStatus}</p>
          <button
            type="button"
            aria-label={`Download ${recipe.name} recipe as an image`}
            onClick={downloadRecipe}
            className="inline-flex min-h-11 items-center gap-2 bg-navy px-4 font-sans text-sm font-medium text-pina hover:bg-navy-deep focus-visible:outline-2 focus-visible:outline-navy focus-visible:outline-offset-4"
          >
            <Download aria-hidden="true" size={17} strokeWidth={1.5} />
            Download image
          </button>
        </div>
          {recipe.photoCredit && (
            <p className="mt-4 font-sans text-xs text-navy-deep">Photo credit: {recipe.photoCredit}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RecipeModal
