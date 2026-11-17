// Публичные ссылки, как в основном приложении. Пустая или некорректная ссылка отключает канал.
export function validSupportUrl(value) {
  if (!value?.trim()) return ''
  try {
    const url = new globalThis.URL(value)
    if (url.protocol === 'https:' && !url.username && !url.password) return url.href
  } catch {
    // Некорректная настройка отображается как недоступный канал связи.
  }
  return ''
}

export const supportLinks = {
  telegram: validSupportUrl(import.meta.env.VITE_SUPPORT_TELEGRAM_URL ?? 'https://t.me/sup_chanly'),
  max: validSupportUrl(import.meta.env.VITE_SUPPORT_MAX_URL),
}
