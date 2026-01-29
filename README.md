# Habit Tracker Frontend

Minimal Next.js + TypeScript + Tailwind frontend for the Habit Tracker backend.

Quick start

1. Change to the `frontend` directory:

```bash
cd frontend
```

2. Install dependencies and run dev server:

```bash
npm install
npm run dev
```

3. Configure the API base URL (optional): create a `.env.local` with:

```
NEXT_PUBLIC_API_BASE=http://localhost:3001
```

The frontend expects the backend to expose the API described in the backend README under `/users/:userId/...`.
