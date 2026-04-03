export const AUTH_CONFIG = {
  cookieName: 'licimx_session',
  jwtSecret: new TextEncoder().encode(
    process.env.JWT_SECRET || 'licimx-dev-secret-change-in-production-2026'
  ),
  jwtExpiration: '7d',
  saltRounds: 10,
}
