export async function deliverContact(fields) {
  const controller = new globalThis.AbortController()
  const timeout = globalThis.setTimeout(() => controller.abort(), 30_000)
  try {
    const response = await globalThis.fetch('/api/landing/contact', {
      method: 'POST',
      credentials: 'same-origin',
      redirect: 'error',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
      signal: controller.signal,
    })
    if (!response.ok) {
      const error = new Error('Contact delivery failed')
      error.code = response.status === 429 ? 'rate_limited' : 'delivery_failed'
      throw error
    }
    const result = await response.json()
    if (result?.delivered !== true) throw new Error('Contact delivery was not confirmed')
    return { delivered: true }
  } finally {
    globalThis.clearTimeout(timeout)
  }
}
