export function connectChannel() {
  const entry = new globalThis.URL(globalThis.location.href)
  const login = new globalThis.URL(import.meta.env.VITE_AUTH_URL || '/auth/login', entry)
  const next = entry.searchParams.get('next')
  if (next && /^\/(adv|blg|adm|common|auth)\/[^\s\\]*$/.test(next)) {
    const target = new globalThis.URL(next, entry)
    if (target.pathname !== '/auth/login' && /^\/(adv|blg|adm|common|auth)\//.test(target.pathname)) {
      login.searchParams.set('next', target.pathname + target.search + target.hash)
    }
  }
  if (import.meta.env.VITE_LOG_LEVEL !== 'silent') {
    globalThis.console.debug('[chanly] Переход к авторизации')
  }
  globalThis.location.assign(login.href)
}
