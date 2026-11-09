import { expect, it, vi } from 'vitest'
import { incomeTopics } from '../../src/data/incomeTopics.js'
import { estimateIncome, formatIncome } from '../../src/utils/estimateIncome.js'

it.each([[30, 300n, 1200n], [35, 350n, 1400n], [65, 650n, 2600n]])(
  'рассчитывает контрольные суммы при ставке %i', (rate, once, four) => {
    expect(estimateIncome('10 000', 1, rate)).toBe(once)
    expect(estimateIncome('10 000', 4, rate)).toBe(four)
  },
)
it('округляет один раз в конце и сохраняет точность', () => {
  expect(estimateIncome('0', 12, 65)).toBe(0n)
  expect(estimateIncome('5', 12, 65)).toBe(4n)
  expect(estimateIncome('10', 1, 50)).toBe(1n)
  expect(formatIncome(350n)).toBe('3,50 ₽')
  expect(formatIncome(estimateIncome('9007199254740991', 12, 100))).toBe('108 086 391 056 891,89 ₽')
})
it.each(['', ' ', '-1', '1,5', '1.5', '1 2', 'текст', '9007199254740992'])('отклоняет ввод «%s»', input => {
  expect(estimateIncome(input, 1, 35)).toBeNull()
})
it.each([0, 13, 1.5])('отклоняет число размещений %s', placements => {
  expect(estimateIncome('10', placements, 35)).toBeNull()
})
it('сохраняет весь справочник между загрузками', async () => {
  expect(incomeTopics.length).toBeGreaterThanOrEqual(15)
  expect(incomeTopics.length).toBeLessThanOrEqual(30)
  expect(new Set(incomeTopics.map(t => t.id)).size).toBe(incomeTopics.length)
  expect(incomeTopics.every(t => Number.isInteger(t.rate) && t.rate >= 30 && t.rate <= 100)).toBe(true)
  vi.resetModules()
  expect((await import('../../src/data/incomeTopics.js')).incomeTopics).toEqual(incomeTopics)
})
