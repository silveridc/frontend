import Cookies from 'js-cookie'

const TokenKey = 'admin_token'

export function getToken(): string | undefined {
  return Cookies.get(TokenKey)
}

export function setToken(token: string, remember = false): string | undefined {
  return Cookies.set(TokenKey, token, {
    expires: remember ? 7 : 1,
    path: '/',
    sameSite: 'lax'
  })
}

export function removeToken(): void {
  Cookies.remove(TokenKey, { path: '/' })
}
