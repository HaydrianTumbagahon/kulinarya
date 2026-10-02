# Kulinarya

Kulinarya is a Filipino recipe website for exploring familiar dishes, learning how they are prepared, and discovering a little context about their history. Recipes are organized into **Flavors of Home**, **Bread and Pastries**, and **Desserts** in an editorial, magazine-inspired experience.

## Why I Built This

I built Kulinarya as a practice project to learn by making a complete website with the help of AI. It gave me a way to practice frontend development, work with animation and interaction libraries, and build a useful home for Filipino recipes.

## What It Is For

Visitors can search recipes by name or ingredient, browse category and food-group filters, save favorites, and open a recipe for its ingredients, method, cooking time, taste notes, and background. A recipe can also be downloaded as an image.

## Technology

- React 19 for the user interface
- Vite for local development and production builds
- Tailwind CSS 4 for styling
- Framer Motion for transitions, scroll-linked effects, and reduced-motion support
- Lenis for smooth scrolling
- GSAP and ScrollTrigger for animation utilities
- Lucide React for interface icons
- html-to-image for exporting recipe views
- Oxlint for linting

## How the Data Works

Recipe and category data is maintained in `src/data/recipes.js` as JavaScript objects; the site does not currently use a server or database. Each recipe includes its category and food group, image path, names, cooking time, description, history, ingredients, and numbered preparation steps. Recipe images are served from `public/images/`.

The page filters this local data in the browser. Search matches words in a recipe's English name, local name, and ingredient list. Category sections offer an `All` option and the food groups represented in that section, initially show six recipes, and reveal more when requested. Favorites are saved in the browser's `localStorage`, so they persist on that browser but are not synchronized between devices. Recipe history is shown in the selected recipe's detail view.

To add a recipe, add an object with a unique `id` to the `recipes` array in `src/data/recipes.js`, assign an existing category and its expected food group, and add its image under `public/images/`. Use a short `imageQuery` to describe the dish image.

## Run Locally

Requires Node.js and npm.

```sh
npm install
npm run dev
```

Create and check a production build with:

```sh
npm run build
npm run lint
```
