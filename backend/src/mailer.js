import { Resend } from 'resend'

let client = null

function getClient() {
  if (client) return client

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set. Copy .env.example to .env and fill it in.')
  }

  client = new Resend(apiKey)
  return client
}

/**
 * Sends one email and resolves/rejects per-recipient so a single bad
 * address doesn't abort the whole batch.
 */
export async function sendMail({ to, subject, text, html }) {
  const fromName = process.env.MAIL_FROM_NAME || 'Attendly'
  const fromAddress = process.env.MAIL_FROM_ADDRESS
  if (!fromAddress) {
    throw new Error('MAIL_FROM_ADDRESS is not set. Copy .env.example to .env and fill it in.')
  }

  const resend = getClient()
  const { error } = await resend.emails.send({
    from: `${fromName} <${fromAddress}>`,
    to,
    subject,
    text,
    html,
  })

  if (error) {
    throw new Error(error.message || 'Failed to send email via Resend.')
  }
}
