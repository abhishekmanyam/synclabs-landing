# Sync Labs — AI-Powered Lip Sync Landing Page

A modern, high-converting landing page for Sync Labs built with Astro, Tailwind CSS v4, and AI-generated imagery via Nano Banana Pro.

## Project Structure

```text
/
├── public/
│   └── images/          # AI-generated images (Nano Banana Pro)
├── src/
│   ├── components/      # Page section components
│   │   ├── Navbar.astro
│   │   ├── Hero.astro
│   │   ├── LogoCloud.astro
│   │   ├── Features.astro
│   │   ├── HowItWorks.astro
│   │   ├── UseCases.astro
│   │   ├── NanoBanana.astro
│   │   ├── Testimonials.astro
│   │   ├── Pricing.astro
│   │   ├── CTA.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── vercel.json
└── package.json
```

## Getting Started

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploy to Vercel

### Option 1: Vercel CLI
```sh
npm i -g vercel
vercel
```

### Option 2: Git Integration
1. Push this repo to GitHub
2. Import the repository at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Astro — click Deploy

## Tech Stack

- **Framework:** Astro 5
- **Styling:** Tailwind CSS v4
- **Images:** AI-generated with Nano Banana Pro (Gemini)
- **Deployment:** Vercel (static output)
- **Fonts:** Inter (Google Fonts)

## Page Sections

| Section | Description |
|---------|-------------|
| Hero | Value proposition with AI lip-sync visual |
| Logo Cloud | Social proof with trusted brands |
| Features | 6 key capabilities including Nano Banana |
| How It Works | 3-step workflow visualization |
| Use Cases | AI avatars, localization, marketing |
| Nano Banana | Dedicated AI image generation showcase |
| Testimonials | Customer quotes |
| Pricing | Free, Pro, Enterprise tiers |
| CTA | Final conversion section |
