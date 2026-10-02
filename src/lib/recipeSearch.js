function getWords(value) {
  return value.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu) || []
}

export function recipeMatchesSearch(recipe, query) {
  const queryWords = getWords(query)
  if (queryWords.length === 0) return true

  const recipeWords = new Set([
    ...getWords(recipe.name),
    ...getWords(recipe.localName),
    ...recipe.ingredients.flatMap(getWords),
  ])

  return queryWords.every((word) => recipeWords.has(word))
}