# Kulinarya Project Rules

- Kulinarya is a Filipino recipe site built with React, Vite, Tailwind CSS v4, framer-motion, and lucide-react.
- The three categories are Flavors of Home (`flavors-of-home`), Bread and Pastries (`bread-pastries`), and Desserts (`desserts`).
- Use an editorial magazine style: large Fraunces headlines, small Inter body text, thin rules, inset frames, and overlapping layers. Use only the `pina`, `navy`, `navy-deep`, `ink`, `gold`, and `crimson` palette tokens defined in `src/index.css`.
- On pina sections use ink and navy for headings and body text; gold is decorative, and crimson is for small accents and hovers. On navy or navy-deep sections use pina text and gold accents.
- Animate only `transform` and `opacity`. Do not use scroll event listeners; use framer-motion `useScroll` or `whileInView` instead. Do not use infinite scroll or `background-attachment: fixed`. Use `100svh`, never `100vh`.
- Wrap the app in `<MotionConfig reducedMotion="user">`.
- Recipe data lives only in `src/data/recipes.js`. Each recipe has a `group` from its section's allowed values: Flavors of Home (`Meat`, `Vegetables`, `Seafood`, `Rice and Noodles`, `Soups and Stews`), Bread and Pastries (`Breads`, `Pastries`), or Desserts (`Cold`, `Rice Cakes`, `Warm and Fried`, `Custards and Cakes`), plus a short Pexels search `imageQuery`.
- Recipe history appears only inside the recipe view for the selected dish.
- Category filters show `All` and the groups represented in that section. Show six recipes at a time and use a `Show more` button; never use infinite scroll.
- Give every interactive element an accessible name and a visible focus style.
