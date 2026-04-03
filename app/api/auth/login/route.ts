import { NextResponse } from 'next/server'
import { findUserByEmail, verifyPassword } from '@/lib/auth/users'
import { createToken } from '@/lib/auth/jwt'
import { setSessionCookie } from '@/lib/auth/session'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contrasena son requeridos' },
        { status: 400 }
      )
    }

    const user = findUserByEmail(email)
    if (!user || !verifyPassword(user, password)) {
      return NextResponse.json(
        { error: 'Credenciales invalidas' },
        { status: 401 }
      )
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      company: user.company,
      role: user.role,
    })

    await setSessionCookie(token)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
        role: user.role,
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
