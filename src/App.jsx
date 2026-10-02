import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import CategorySection from './components/CategorySection.jsx'
import FavoriteNotice from './components/FavoriteNotice.jsx'
import Footer from './components/Footer.jsx'
import Hero from './components/Hero.jsx'
import RecipeModal from './components/RecipeModal.jsx'
import ScrollProgressBar from './components/ScrollProgressBar.jsx'
import { categories, recipes } from './data/recipes.js'
import { recipeMatchesSearch } from './lib/recipeSearch.js'

const FAVORITES_KEY = 'kulinarya:favorites'
const FAVORITE_NOTICE_DURATION = 5000

function App() {
  const [openRecipe, setOpenRecipe] = useState(null)
  const lenisRef = useRef(null)
  const favoriteAnchorRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [favoriteNotice, setFavoriteNotice] = useState(null)
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || '[]')
      return Array.isArray(saved)
        ? saved.filter((id) => recipes.some((recipe) => recipe.id === id))
        : []
    } catch {
      return []
    }
  })
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const lenis = new Lenis()
    lenisRef.current = lenis
    let animationFrameId

    function animate(time) {
      lenis.raf(time)
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
      lenis.destroy()
      if (lenisRef.current === lenis) lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!favoriteNotice) return undefined

    const timeoutId = window.setTimeout(
      () => setFavoriteNotice(null),
      FAVORITE_NOTICE_DURATION,
    )

    return () => window.clearTimeout(timeoutId)
  }, [favoriteNotice])

  useLayoutEffect(() => {
    const favoriteAnchor = favoriteAnchorRef.current
    favoriteAnchorRef.current = null
    if (!favoriteAnchor?.element.isConnected) return

    const scrollAdjustment = favoriteAnchor.element.getBoundingClientRect().top - favoriteAnchor.top
    if (Math.abs(scrollAdjustment) < 1) return

    const targetScroll = window.scrollY + scrollAdjustment
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetScroll, { immediate: true })
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'instant' })
    }
  }, [favoriteIds])

  const query = searchQuery.trim()
  const matchingRecipes = recipes.filter((recipe) => recipeMatchesSearch(recipe, query))
  const favoriteRecipes = recipes.filter((recipe) => favoriteIds.includes(recipe.id))
  const matchingFavoriteRecipes = favoriteRecipes.filter((recipe) => recipeMatchesSearch(recipe, query))

  function toggleFavorite(recipeId, event) {
    const isFavorite = favoriteIds.includes(recipeId)
    const nextFavoriteIds = isFavorite
      ? favoriteIds.filter((id) => id !== recipeId)
      : [...favoriteIds, recipeId]

    const clickedHeart = event?.currentTarget
    if (clickedHeart && !clickedHeart.closest('#favorites')) {
      favoriteAnchorRef.current = {
        element: clickedHeart,
        top: clickedHeart.getBoundingClientRect().top,
      }
    }

    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavoriteIds))
    } catch {
      // Keep the current-session state if browser storage is unavailable.
    }

    setFavoriteIds(nextFavoriteIds)

    const recipe = recipes.find((item) => item.id === recipeId)
    if (recipe) {
      setFavoriteNotice({
        id: `${recipeId}-${isFavorite ? 'removed' : 'added'}-${Date.now()}`,
        recipeId,
        name: recipe.name,
        action: isFavorite ? 'removed' : 'added',
      })
    }
  }

  function scrollToFavorites(targetId) {
    const target = document.getElementById(targetId)
    if (!target) return

    setFavoriteNotice(null)
    if (lenisRef.current) {
      const targetScroll = window.scrollY + target.getBoundingClientRect().top - 16
      lenisRef.current.scrollTo(targetScroll, { duration: 1.1 })
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'instant' : 'smooth', block: 'start' })
  }

  return (
    <MotionConfig reducedMotion="user">
      <>
        {!openRecipe && <ScrollProgressBar progress={progress} />}
        <Hero />
        <main>
          <section id="recipe-index" className="bg-pina px-5 py-12 text-ink sm:px-10 sm:py-16 lg:px-16">
            <div className="mx-auto flex max-w-screen-2xl flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <label htmlFor="recipe-search" className="mt-2 block font-display text-3xl font-bold sm:text-4xl">
                  Find a dish
                </label>
              </div>
              <div className="w-full sm:max-w-md">
                <input
                  id="recipe-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by name or ingredient"
                  className="h-12 w-full border-b border-navy/60 bg-transparent px-1 font-sans text-base text-ink placeholder:text-navy-deep focus-visible:outline-2 focus-visible:outline-navy focus-visible:outline-offset-2"
                />
                {query && (
                  <p role="status" className="mt-2 font-sans text-sm text-navy-deep">
                    {matchingRecipes.length} {matchingRecipes.length === 1 ? 'recipe' : 'recipes'} found
                  </p>
                )}
              </div>
            </div>
          </section>
          {query && matchingRecipes.length === 0 && (
            <p role="status" className="bg-pina px-5 pb-10 font-sans text-sm text-navy-deep sm:px-10 lg:px-16">
              No recipes match that search.
            </p>
          )}
          {favoriteRecipes.length > 0 && (!query || matchingFavoriteRecipes.length > 0) && (
            <CategorySection
              key="favorites"
              category={{
                id: 'favorites',
                title: 'Favorites',
                blurb: 'Your saved dishes, gathered in one place.',
              }}
              recipes={favoriteRecipes}
              searchQuery={query}
              tone="dark"
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
              onRecipeSelect={setOpenRecipe}
            />
          )}
          {categories.map((category, index) => {
            const categoryRecipes = recipes.filter((recipe) => recipe.category === category.id)
            const hasSearchMatch = matchingRecipes.some((recipe) => recipe.category === category.id)
            if (query && !hasSearchMatch) return null

            return (
              <CategorySection
                key={category.id}
                category={category}
                recipes={categoryRecipes}
                searchQuery={query}
                tone={index % 2 === 0 ? 'light' : 'dark'}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
                onRecipeSelect={setOpenRecipe}
              />
            )
          })}
        </main>
        <Footer />
        <FavoriteNotice
          notice={favoriteNotice}
          targetId={favoriteRecipes.length > 0 ? 'favorites' : 'recipe-index'}
          onNavigate={() => scrollToFavorites(favoriteRecipes.length > 0 ? 'favorites' : 'recipe-index')}
          onDismiss={() => setFavoriteNotice(null)}
        />
        <AnimatePresence>
          {openRecipe && (
            <RecipeModal
              key={openRecipe.id}
              recipe={openRecipe}
              lenisRef={lenisRef}
              onClose={() => setOpenRecipe(null)}
            />
          )}
        </AnimatePresence>
      </>
    </MotionConfig>
  )
}

export default App
