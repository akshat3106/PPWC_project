# Attendly backend

Small Express API that sends real emails to students via Gmail SMTP (Nodemailer). Used by the
`attendance-system` frontend's teacher "Send mail" button.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in:
   - `GMAIL_USER` — the Gmail address to send from.
   - `GMAIL_APP_PASSWORD` — a 16-character [App Password](https://myaccount.google.com/apppasswords)
     (requires 2-Step Verification on the Google account; your normal Gmail password will not work).
3. `npm run dev` — starts the server on `http://localhost:5000` (auto-restarts on file changes).

The frontend's Vite dev server proxies `/api/*` to this server, so run both at once:

```
# terminal 1
cd attendance-system-backend && npm run dev

# terminal 2
cd attendance-system && npm run dev
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
