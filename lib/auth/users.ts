import bcrypt from 'bcryptjs'
import { AUTH_CONFIG } from './config'

interface StoredUser {
  id: string
  email: string
  name: string
  company: string
  role: string
  passwordHash: string
  createdAt: string
}

// In-memory user store (persists during server lifetime)
const users: Map<string, StoredUser> = new Map()

// Seed a demo user
const demoHash = bcrypt.hashSync('demo1234', AUTH_CONFIG.saltRounds)
users.set('demo@licimx.com', {
  id: 'usr_demo_001',
  email: 'demo@licimx.com',
  name: 'Carlos Mendoza',
  company: 'TechGov Solutions',
  role: 'director',
  passwordHash: demoHash,
  createdAt: new Date().toISOString(),
})

export function findUserByEmail(email: string): StoredUser | undefined {
  return users.get(email.toLowerCase())
}

export function createUser(data: {
  email: string
  name: string
  company: string
  password: string
  role?: string
}): StoredUser {
  const existing = users.get(data.email.toLowerCase())
  if (existing) throw new Error('El correo ya esta registrado')

  const user: StoredUser = {
    id: `usr_${Date.now()}`,
    email: data.email.toLowerCase(),
    name: data.name,
    company: data.company,
    role: data.role || 'analista',
    passwordHash: bcrypt.hashSync(data.password, AUTH_CONFIG.saltRounds),
    createdAt: new Date().toISOString(),
  }
  users.set(user.email, user)
  return user
}

export function verifyPassword(user: StoredUser, password: string): boolean {
  return bcrypt.compareSync(password, user.passwordHash)
}

export function getAllUsers(): Omit<StoredUser, 'passwordHash'>[] {
  return Array.from(users.values()).map(
    ({ passwordHash: _passwordHash, ...u }) => u
  )
}
