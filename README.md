# Nylo’s Birthday Surprise

A frontend-only birthday gift-unwrapping journey created for Nylo. The experience unfolds as five small chapters with animated envelopes, a memory card, choice pockets, a wrapped gift, and a final celebration. Every chapter opens with a cinematic surprise-box reveal, falling rose petals, and a chapter-specific message treatment.

## Design direction

The project follows the **Paper Moon Keepsake** direction: warm parchment, dusty rose, berry accents, tactile paper layers, editorial typography, and intimate letter-like copy. The visual system uses DM Serif Display for expressive headings and Manrope for interface text.

## Technology

The project is built with React 19, TypeScript, Tailwind CSS 4, Framer Motion, Lucide React, and Vite within a static frontend scaffold. It does not require a database, backend API, authentication, or server-side hosting. The site is suitable for Vercel or any static hosting provider.

## Local development

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Run the type-check and production build:

```bash
pnpm check
pnpm build
```

The production build is written to `dist/public`.

## Personalizing the experience

The chapter content is defined in `client/src/pages/Home.tsx` near the top of the file in the `chapters` array. Replace the placeholder messages with your own notes. The `choiceLines` array controls the three mini-surprise options in chapter three.

The main generated visual assets are referenced through persistent project storage URLs in the same file. If you replace the visuals, update `heroImage`, `finaleImage`, and `markImage` while keeping the same aspect-ratio intent.

The global color system, typography, paper textures, envelope, gift, surprise-box overlay, rose rain, and reduced-motion behavior are in `client/src/index.css`.

## Vercel deployment

Import this repository into Vercel with the following settings:

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Root directory | Repository root |
| Install command | `pnpm install` or `npm install` |
| Build command | `pnpm build` or `npm run build` |
| Output directory | `dist/public` |

No environment variables are required for the birthday journey itself. After deployment, open the generated Vercel URL on a phone and desktop browser to verify the animations and chapter flow before sharing it.

## Project structure

```text
client/
  index.html
  src/
    App.tsx
    index.css
    pages/Home.tsx
    components/
    contexts/
    hooks/
    lib/
ideas.md                  # visual direction and design decisions
package.json              # scripts and dependencies
vite.config.ts            # Vite configuration
README.md                 # project documentation
```

## Accessibility and motion

Interactive objects are keyboard reachable, buttons use descriptive labels, and the surprise overlay supports an explicit close action. Non-essential motion is reduced when the visitor’s device has `prefers-reduced-motion` enabled.

## License

This project is a personal birthday website. Add a license here if you plan to reuse or distribute the source publicly.
