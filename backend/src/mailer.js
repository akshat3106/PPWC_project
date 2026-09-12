import nodemailer from 'nodemailer'

let transporter = null

function getTransporter() {
  if (transporter) return transporter

  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    throw new Error(
      'GMAIL_USER / GMAIL_APP_PASSWORD are not set. Copy .env.example to .env and fill them in.',
    )
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })

  return transporter
}

/**
 * Sends one email and resolves/rejects per-recipient so a single bad
 * address doesn't abort the whole batch.
 */
export async function sendMail({ to, subject, text, html }) {
  const fromName = process.env.MAIL_FROM_NAME || 'Attendly'
  const transport = getTransporter()

  await transport.sendMail({
    from: `"${fromName}" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  })
}

export async function verifyMailer() {
  const transport = getTransporter()
  await transport.verify()
}
