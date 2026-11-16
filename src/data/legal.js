import manifest from './legal.json'

export const legalDocuments = manifest.documents
export const feedbackConsent = {
  ...manifest.documents.find(document => document.id === 'consent-feedback'),
  version: manifest.version,
}
