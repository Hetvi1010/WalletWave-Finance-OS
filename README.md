# WalletWave

WalletWave is a full-stack personal finance tracker built with Next.js, Tailwind CSS, Framer Motion, and MongoDB. The frontend and backend now run in a single Next.js app using App Router pages plus `app/api` route handlers, with JWT authentication, budgeting tools, exports, and responsive navigation.

## Tech stack

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts
- Backend: Next.js Route Handlers, TypeScript, MongoDB, Mongoose, JWT
- UX: Dark/light theme, glassmorphism, soft shadows, loading skeletons, toasts, animated transitions

## Project structure

```text
.
├── src/app/       # Next.js pages and API routes
├── src/server/    # DB, auth, models, serializers, server helpers
├── .env.example
└── package.json
```

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env.local
```

3. Start MongoDB locally or point `MONGODB_URI` at Atlas.

4. Run the app:

```bash
npm run dev
```

## Deployment

- Deploy the single Next.js app to Vercel or any Node-compatible host.
- Provide `MONGODB_URI`, `JWT_SECRET`, and optionally `NEXT_PUBLIC_API_URL`.
- If the frontend and API are served together, `NEXT_PUBLIC_API_URL` can be omitted because the app defaults to `/api`.

## Core features

- JWT auth with signup and login
- Animated dashboard with balance, trends, and recent transactions
- Transaction CRUD with search and filters
- Budget tracking with over-limit warnings
- Analytics charts for category spend and monthly cash flow
- CSV and PDF export endpoints
- Theme toggle, profile page, and responsive navigation

## Sample credentials

Create a user from the signup page, then log in with that account.
