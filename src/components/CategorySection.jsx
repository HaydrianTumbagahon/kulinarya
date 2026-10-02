import { useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import RecipeCard from './RecipeCard.jsx'
import { PARALLAX, useParallaxPreferences } from '../lib/parallax.js'
import { recipeMatchesSearch } from '../lib/recipeSearch.js'

const groupOrder = {
  'flavors-of-home': ['Meat', 'Vegetables', 'Seafood', 'Rice and Noodles', 'Soups and Stews'],
  'bread-pastries': ['Breads', 'Pastries'],
  desserts: ['Cold', 'Rice Cakes', 'Warm and Fried', 'Custards and Cakes'],
}

function CategorySection({
  category,
  recipes,
  searchQuery = '',
  tone = 'light',
  favoriteIds = [],
  onToggleFavorite,
  onRecipeSelect,
}) {
  const sectionRef = useRef(null)
  const [filterState, setFilterState] = useState({ searchQuery, group: 'All', visibleCount: 6 })
  const isSearchChanged = filterState.searchQuery !== searchQuery
  const activeGroup = isSearchChanged ? 'All' : filterState.group
  const visibleCount = isSearchChanged ? 6 : filterState.visibleCount
  const isDark = tone === 'dark'
  const focusClass = isDark ? 'focus-visible:outline-gold' : 'focus-visible:outline-navy'
  const selectedClass = isDark
    ? 'border-gold bg-gold text-ink'
    : 'border-navy bg-navy text-pina'
  const hoverClass = isDark
    ? 'hover:border-gold hover:text-gold'
    : 'hover:border-crimson hover:text-crimson'
  const { prefersReducedMotion, isDesktop, distanceScale } = useParallaxPreferences()
  const parallaxLayerClass = distanceScale > 0 ? '[will-change:transform]' : ''
  const columnLayerClass = isDesktop && !prefersReducedMotion ? '[will-change:transform]' : ''
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const smoothProgress = useSpring(scrollYProgress, PARALLAX.spring)
  const progress = useTransform(smoothProgress, (value) => (prefersReducedMotion ? 0 : value))
  const titleX = useTransform(
    progress,
    [0, 1],
    PARALLAX.section.titleX.map((value) => value * distanceScale),
  )
  const watermarkX = useTransform(
    progress,
    [0, 1],
    PARALLAX.section.watermarkX.map((value) => value * distanceScale),
  )
  const circleY = useTransform(
    progress,
    [0, 1],
    PARALLAX.section.circleY.map((value) => value * distanceScale),
  )
  const columnY = [
    useTransform(progress, [0, 1], PARALLAX.section.columnY[0].map((value) => value * distanceScale)),
    useTransform(progress, [0, 1], PARALLAX.section.columnY[1].map((value) => value * distanceScale)),
    useTransform(progress, [0, 1], PARALLAX.section.columnY[2].map((value) => value * distanceScale)),
  ]
  const query = searchQuery.trim()
  const groupValues = [...new Set(recipes.map((recipe) => recipe.group).filter(Boolean))]
  const orderedGroups = groupOrder[category.id] || []
  const groups = [
    ...orderedGroups.filter((group) => groupValues.includes(group)),
    ...groupValues.filter((group) => !orderedGroups.includes(group)).sort(),
  ]
  const searchMatches = recipes.filter((recipe) => recipeMatchesSearch(recipe, query))
  const matchingGroupRecipes = activeGroup === 'All'
    ? searchMatches
    : searchMatches.filter((recipe) => recipe.group === activeGroup)
  const visibleRecipes = matchingGroupRecipes.slice(0, visibleCount)
  const themeClass = isDark ? 'dark-surface banig bg-navy text-pina' : 'bg-pina text-ink'
  const ruleClass = isDark ? 'border-pina/40' : 'border-navy/60'
  const secondaryTextClass = isDark ? 'text-pina/80' : 'text-navy-deep'

  function selectGroup(group) {
    setFilterState({ searchQuery, group, visibleCount: 6 })
  }

  return (
    <section ref={sectionRef} id={category.id} className={`relative overflow-hidden py-16 sm:py-24 ${themeClass}`}>
      <motion.div
        aria-hidden="true"
        style={{ y: circleY }}
        className={`pointer-events-none absolute -top-20 z-0 size-[clamp(18rem,35vw,34rem)] rounded-full border border-gold/30 ${parallaxLayerClass} ${isDark ? '-right-24' : '-left-24'}`}
      />
      <div className="relative z-10 mx-auto max-w-screen-2xl px-5 sm:px-10 lg:px-16">
        <header className={`border-t pt-5 sm:pt-7 ${ruleClass}`}>
          <div className="relative isolate">
            <motion.p
              aria-hidden="true"
              className={`pointer-events-none absolute -left-1 top-[-0.3em] z-0 whitespace-nowrap font-display font-black leading-none ${parallaxLayerClass} ${isDark ? 'text-pina' : 'text-navy'}`}
              style={{ x: watermarkX, opacity: PARALLAX.section.watermarkOpacity, fontSize: `${PARALLAX.section.watermarkFontVW}vw` }}
            >
              {category.title}
            </motion.p>
            <motion.h2
              style={{ x: titleX }}
              className={`relative z-10 font-display text-[clamp(3.5rem,8vw,8rem)] font-black leading-[0.88] ${parallaxLayerClass}`}
            >
              {category.title}
            </motion.h2>
          </div>
          <p className={`mt-4 max-w-2xl font-sans text-sm leading-relaxed sm:text-base ${secondaryTextClass}`}>
            {category.blurb}
          </p>
          <div role="group" aria-label={`${category.title} recipe filters`} className="mt-6 flex flex-wrap gap-2">
            {['All', ...groups].map((group) => {
              const selected = activeGroup === group
              return (
                <button
                  key={group}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => selectGroup(group)}
                  className={`min-h-10 border px-3 font-sans text-sm focus-visible:outline-2 ${focusClass} focus-visible:outline-offset-2 ${selected ? selectedClass : `border-current ${hoverClass}`}`}
                >
                  {group}
                </button>
              )
            })}
          </div>
        </header>

        {visibleRecipes.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 pb-10 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-40 lg:pb-40">
            {visibleRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                style={{ y: isDesktop && !prefersReducedMotion ? columnY[index % 3] : 0 }}
                className={columnLayerClass}
              >
                <RecipeCard
                  recipe={recipe}
                  index={index}
                  tone={tone}
                  isFavorite={favoriteIds.includes(recipe.id)}
                  prefersReducedMotion={prefersReducedMotion}
                  distanceScale={distanceScale}
                  onToggleFavorite={onToggleFavorite}
                  onSelect={onRecipeSelect}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <p role="status" className={`mt-8 font-sans text-sm ${secondaryTextClass}`}>
            No matching recipes in this group.
          </p>
        )}

        {visibleRecipes.length < matchingGroupRecipes.length && (
          <button
            type="button"
            onClick={() => setFilterState({
              searchQuery,
              group: activeGroup,
              visibleCount: visibleCount + 6,
            })}
            className={`mt-10 min-h-11 border border-current px-5 font-sans text-sm font-medium ${hoverClass} focus-visible:outline-2 ${focusClass} focus-visible:outline-offset-4`}
          >
            Show more recipes
          </button>
        )}
      </div>
    </section>
  )
}

export default CategorySection
