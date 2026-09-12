import { Router } from 'express'
import { sendMail } from '../mailer.js'

export const mailRouter = Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function buildBody(student, { subject, message, attendance }) {
  const firstName = student.name.split(' ')[0]
  const lines = [`Hi ${firstName},`, '', message]

  if (attendance) {
    lines.push(
      '',
      `Subject: ${attendance.subjectName}`,
      `Date: ${attendance.date}`,
      `Status: ${attendance.status === 'present' ? 'Present' : 'Absent'}`,
    )
  }

  lines.push('', '— Sent via Attendly')
  const text = lines.join('\n')
  const html = `<p>${lines.filter((l) => l !== '').map((l) => l).join('</p><p>')}</p>`
    .replaceAll('<p>—', '<p style="color:#888;font-size:12px">—')

  return { subject, text, html }
}

// POST /api/send-mail
// body: {
//   subject: string,
//   message: string,
//   students: { name: string, email: string, attendance?: { subjectName, date, status } }[]
// }
mailRouter.post('/send-mail', async (req, res) => {
  const { subject, message, students } = req.body ?? {}

  if (typeof subject !== 'string' || !subject.trim()) {
    return res.status(400).json({ error: 'subject is required' })
  }
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required' })
  }
  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ error: 'students must be a non-empty array' })
  }

  const results = []

  // Send sequentially (small class sizes) to stay well under Gmail's
  // sending-rate limits and to keep per-recipient error handling simple.
  for (const student of students) {
    const name = typeof student?.name === 'string' ? student.name.trim() : ''
    const email = typeof student?.email === 'string' ? student.email.trim() : ''

    if (!name || !EMAIL_RE.test(email)) {
      results.push({ email: email || '(missing)', name, ok: false, error: 'Invalid name/email' })
      continue
    }

    try {
      const { subject: sub, text, html } = buildBody(
        { name },
        { subject, message, attendance: student.attendance },
      )
      await sendMail({ to: email, subject: sub, text, html })
      results.push({ email, name, ok: true })
    } catch (err) {
      results.push({ email, name, ok: false, error: err.message })
    }
  }

  const sent = results.filter((r) => r.ok).length
  const failed = results.length - sent

  res.json({ sent, failed, results })
})
