export function connectChannel() {
  const address = import.meta.env.VITE_AUTH_URL
  if (address) globalThis.location.assign(address)
  else if (import.meta.env.VITE_LOG_LEVEL !== 'silent') globalThis.console.info('[chanly] Подключить канал: адрес авторизации не настроен')
}
