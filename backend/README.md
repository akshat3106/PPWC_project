# Attendly backend

Small Express API that sends real emails to students via [Resend](https://resend.com). Used by the
`attendance-system` frontend's teacher "Send mail" button.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in:
   - `RESEND_API_KEY` — from [resend.com/api-keys](https://resend.com/api-keys).
   - `MAIL_FROM_ADDRESS` — must be on a domain you've verified in
     [Resend's dashboard](https://resend.com/domains). Until a domain is verified, Resend only
     lets you send to your own account email (using `onboarding@resend.dev` as the from address).
3. `npm run dev` — starts the server on `http://localhost:5000` (auto-restarts on file changes).

The frontend's Vite dev server proxies `/api/*` to this server, so run both at once:

```
# terminal 1 (from the attendance-system/ folder)
cd backend && npm run dev

# terminal 2 (from the attendance-system/ folder)
npm run dev
```

## API

### `POST /api/send-mail`

```json
{
  "subject": "Attendance update",
  "message": "Your attendance for today has been recorded.",
  "students": [
    { "name": "Arjun Sharma", "email": "arjun.sharma@attendly.edu", "attendance": { "subjectName": "Mathematics", "date": "2026-09-12", "status": "present" } }
  ]
}
```

`attendance` is optional — omit it to send a plain announcement email. Returns:

```json
{ "sent": 1, "failed": 0, "results": [{ "email": "...", "name": "...", "ok": true }] }
```

Each recipient is sent (and can fail) independently, so one bad address doesn't block the rest.
