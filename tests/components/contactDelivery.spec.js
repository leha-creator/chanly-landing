import { afterEach, expect, it, vi } from 'vitest'
import { deliverContact } from '../../src/api/contact.js'

afterEach(() => vi.unstubAllGlobals())
const fields = { name: 'Анна', email: 'anna@example.org', question: 'Вопрос', consent: true }

it('sends the form to the same-origin endpoint and requires SMTP confirmation', async () => {
  const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ delivered: true }) })
  vi.stubGlobal('fetch', fetch)
  await expect(deliverContact(fields)).resolves.toEqual({ delivered: true })
  expect(fetch).toHaveBeenCalledWith('/api/landing/contact', expect.objectContaining({
    method: 'POST', credentials: 'same-origin', body: JSON.stringify(fields), redirect: 'error',
  }))
})

it.each([429, 502, 503])('rejects HTTP %s without confirming delivery', async status => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status }))
  await expect(deliverContact(fields)).rejects.toMatchObject({ code: status === 429 ? 'rate_limited' : 'delivery_failed' })
})

it.each([{}, { delivered: false }])('rejects a successful HTTP response without delivery confirmation: %j', async body => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => body }))
  await expect(deliverContact(fields)).rejects.toThrow('not confirmed')
})
