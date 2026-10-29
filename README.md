# E-Commerce Store

A full-featured e-commerce storefront built with **Next.js 15** and TypeScript. It talks to an external product/order API and provides category browsing, a cart and a checkout flow with Stripe and PayPal integrations.

## Tech stack

- **Next.js 15** (App Router, Turbopack in development) · **React 19** · **TypeScript**
- **Tailwind CSS**
- **Stripe** (`@stripe/react-stripe-js`, `@stripe/stripe-js`, `stripe`) and **PayPal** (`@paypal/react-paypal-js`) payment SDKs
- **Axios** for API communication
- Lucide / Iconify icons, NProgress route loading indicator

## Features

- Category-driven catalogue: dynamic category routes (`/[category]`) and an all-categories overview
- Product browsing backed by a REST API (base URL configured via environment)
- Shopping cart with shared state via React context (`src/context`)
- Checkout flow (`/checkout`) wired for Stripe and PayPal payments
- Responsive, component-based UI (`src/components`) with typed data models (`src/types`)

## Getting started

```bash
npm install
cp .env.example .env   # then set NEXT_PUBLIC_API_BASE_URL to your API
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Environment

Configuration is provided through environment variables — copy `.env.example` to `.env` and fill in your own values. Never commit a real `.env` file.

---

Built by [Abrar Hussain](https://github.com/abrar5518) — Senior Full Stack Developer (Next.js · Laravel · Node.js).
