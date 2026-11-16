import { URL } from 'node:url'
import console from 'node:console'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'

const publicManifest = readFileSync(new URL('../public/legal-manifest.json', import.meta.url), 'utf8')
assert.equal(publicManifest, readFileSync(new URL('../src/data/legal.json', import.meta.url), 'utf8'))
const manifest = JSON.parse(publicManifest)
const expected = ['consent-feedback', 'offer', 'offer-author', 'privacy_policy', 'requisites', 'rules']
assert.deepEqual(manifest.documents.map(document => document.id).sort(), expected)
for (const document of manifest.documents) {
  assert.match(document.sha256, /^[a-f0-9]{64}$/)
  assert.equal(document.href, `/${document.id}.pdf`)
  assert.equal(document.asset, `/landing-assets/${document.id}-${document.sha256}.pdf`)
  const pdf = readFileSync(new URL(`../public${document.href}`, import.meta.url))
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-')
  assert.equal(createHash('sha256').update(pdf).digest('hex'), document.sha256)
  assert.deepEqual(pdf, readFileSync(new URL(`../public${document.asset}`, import.meta.url)))
}
console.log(`Verified ${manifest.documents.length} PDF documents, version ${manifest.version}`)

