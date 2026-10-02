export const COLORS = {
  background: '#fbf6ec',
  ink: '#14161f',
  navy: '#0b2a5e',
  gold: '#e9b824',
  muted: '#55586a',
  crimson: '#c1121f',
}

export async function downloadRecipeImage(element, recipeId) {
  const { toPng } = await import('html-to-image')
  const image = await toPng(element, {
    backgroundColor: COLORS.background,
    cacheBust: true,
    pixelRatio: 2,
    skipFonts: true,
    style: {
      backgroundColor: COLORS.background,
      color: COLORS.ink,
    },
  })
  const link = document.createElement('a')
  link.download = `${recipeId}.png`
  link.href = image
  document.body.append(link)
  link.click()
  link.remove()
}
