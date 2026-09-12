export interface SendMailStudent {
  name: string
  email: string
  attendance?: {
    subjectName: string
    date: string
    status: 'present' | 'absent'
  }
}

export interface SendMailResult {
  email: string
  name: string
  ok: boolean
  error?: string
}

export interface SendMailResponse {
  sent: number
  failed: number
  results: SendMailResult[]
}

// Falls back to the Vite dev proxy ('/api/...') when unset, so local dev needs no config.
// Set VITE_API_URL to point at a deployed backend, e.g. the Cloud Run service URL.
const API_BASE = import.meta.env.VITE_API_URL ?? ''

export async function sendMail(payload: {
  subject: string
  message: string
  students: SendMailStudent[]
}): Promise<SendMailResponse> {
  const res = await fetch(`${API_BASE}/api/send-mail`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error || `Failed to send mail (${res.status})`)
  }

  return res.json()
}
