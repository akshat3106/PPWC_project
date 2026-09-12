# Attendly — Frontend Attendance Management System

A frontend-only (mock data, no backend) attendance management prototype built
with React, TypeScript, Vite, and Tailwind CSS v4, based on the provided PRD
and design specification.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. Build for production with `npm run build`
(output goes to `dist/`).

## Demo accounts

Shown directly on the login screens:

- **Student:** arjun.sharma@attendly.edu / demo1234
- **Teacher:** priya.menon@attendly.edu / demo1234

You can also sign up as a brand-new student or teacher — new accounts start
with no attendance history, which is a good way to see the empty states.

## What's included

- Landing / role selection
- Student & teacher login and signup, with validation and mock-credential
  checking
- Student dashboard, subject-wise attendance, and history
- Teacher dashboard, "Take attendance" (with bulk actions, unsaved-changes
  guard, and an occasional simulated save failure to exercise the error
  state), and attendance history with filters
- Mock email/notification preview modal after a teacher saves attendance
- Deterministic seeded mock data (1 teacher, 5 students, 4 subjects, ~30 days
  of attendance) tuned to show high / medium / low attendance states
- Responsive layout: sidebar nav on desktop, bottom nav on mobile
- Loading skeletons, empty states, and accessible focus/status handling

## Notes

- All data lives in React Context and is persisted to `localStorage` under
  the key `attendly:v1` — refresh the page and your changes stay. Clear
  localStorage to reset to the original seeded dataset.
- No backend, authentication server, or real email delivery is implemented,
  per the PRD's scope.
