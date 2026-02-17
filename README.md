# Salary & Expenses Manager

Mobile-first personal finance tracker built with Next.js + TypeScript + Tailwind + Prisma + NextAuth.

## Features
- Auth (register/login/logout with credentials)
- User-isolated transactions CRUD
- Salary sources + recurring generation (auto-catch-up +60 days)
- Monthly category budgets + in-app notifications
- Dashboard and reports with Recharts
- CSV export and CSV import + template download
- Responsive bottom navigation on mobile

## Run locally
```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

## Demo credentials
- Email: `demo@salary.app`
- Password: `demo1234`

## Checks
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Notes
- SQLite in local dev via `DATABASE_PROVIDER=sqlite`
- Switch to Postgres by changing `DATABASE_PROVIDER` and `DATABASE_URL`
