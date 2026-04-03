import { SignJWT, jwtVerify } from 'jose'
import { AUTH_CONFIG } from './config'

export interface SessionPayload {
  userId: string
  email: string
  name: string
  company: string
  role: string
}

export async function createToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(AUTH_CONFIG.jwtExpiration)
    .sign(AUTH_CONFIG.jwtSecret)
}

export async function verifyToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, AUTH_CONFIG.jwtSecret)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}
