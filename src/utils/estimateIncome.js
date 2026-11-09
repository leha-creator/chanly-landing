export function estimateIncome(viewsText, placements, rate) {
  const input = String(viewsText).trim()
  if (!/^(?:\d+|\d{1,3}(?:[ \u00a0\u202f]\d{3})+)$/.test(input)) return null
  const views = Number(input.replace(/\s/g, ''))
  if (!Number.isSafeInteger(views) || !Number.isInteger(placements) ||
      placements < 1 || placements > 12 || !Number.isSafeInteger(rate) || rate < 0) return null

  const thousandths = BigInt(views) * BigInt(placements) * BigInt(rate)
  return (thousandths + 500n) / 1000n
}

const rubles = new Intl.NumberFormat('ru-RU')

export function formatIncome(kopecks) {
  const fraction = kopecks % 100n
  const decimals = fraction ? ',' + String(fraction).padStart(2, '0') : ''
  return rubles.format(kopecks / 100n) + decimals + '\u00a0₽'
}
