import type { Handler } from '@netlify/functions'

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY
const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID // optional

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  if (!MAILERLITE_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfigured' }) }
  }

  let email: string
  try {
    const body = JSON.parse(event.body ?? '{}')
    email = (body.email ?? '').trim().toLowerCase()
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request' }) }
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email' }) }
  }

  const payload: Record<string, unknown> = { email }
  if (MAILERLITE_GROUP_ID) {
    payload.groups = [MAILERLITE_GROUP_ID]
  }

  const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MAILERLITE_API_KEY}`,
    },
    body: JSON.stringify(payload),
  })

  // 200 = already subscribed (updated), 201 = new subscriber
  if (res.status === 200 || res.status === 201) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
  }

  const data = await res.json()
  return {
    statusCode: res.status,
    body: JSON.stringify({ error: data?.message ?? 'MailerLite error' }),
  }
}
