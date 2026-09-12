# Attendly — Attendance Management System

A full attendance management app: a React/TypeScript/Vite/Tailwind frontend backed by a small
Express + Nodemailer service for sending real attendance emails.

## Structure

- **`frontend/`** — the React app (student & teacher dashboards, take attendance, history, auth).
- **`backend/`** — Express API that sends real emails to students via Gmail SMTP.

## Getting started

Run both from their own terminals:

```bash
# terminal 1 — backend
cd backend
npm install
cp .env.example .env   # fill in GMAIL_USER / GMAIL_APP_PASSWORD, see backend/README.md
npm run dev             # http://localhost:5000

# terminal 2 — frontend
cd frontend
npm install
npm run dev              # http://localhost:5173
```

The frontend's Vite dev server proxies `/api/*` requests to the backend, so both need to be
running for the "Send mail" features to work.

## Demo accounts

Shown directly on the login screens:

- **Student:** arjun.sharma@attendly.edu / demo1234
- **Teacher:** priya.menon@attendly.edu / demo1234

You can also sign up as a brand-new student or teacher — new accounts start with no attendance
history, which is a good way to see the empty states.

## What's included

- Landing / role selection
- Student & teacher login and signup, with validation and mock-credential checking
- Student dashboard, subject-wise attendance, and history
- Teacher dashboard, "Take attendance" (bulk actions, unsaved-changes guard, simulated save
  failure to exercise the error state), and attendance history with filters
- Real email sending to students (single test recipient or the whole class) via the backend
- Seeded mock data (1 teacher, a full class of students, 4 subjects, ~30 days of attendance)
  tuned to show high / medium / low attendance states
- Responsive layout: sidebar nav on desktop, bottom nav on mobile
- Loading skeletons, empty states, and accessible focus/status handling

## Notes

- Frontend app data (students, subjects, records) lives in React Context and is persisted to
  `localStorage` under the key `attendly:v1` — refresh the page and your changes stay. Clear
  localStorage to reset to the original seeded dataset.
- The backend never stores anything — it only relays emails through Gmail SMTP on request.
  See `backend/README.md` for API details and Gmail app-password setup.
