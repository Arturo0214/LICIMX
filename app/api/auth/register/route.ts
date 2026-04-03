import { NextResponse } from 'next/server'
import { createUser } from '@/lib/auth/users'
import { createToken } from '@/lib/auth/jwt'
import { setSessionCookie } from '@/lib/auth/session'

export async function POST(request: Request) {
  try {
    const { email, name, company, password, confirmPassword } =
      await request.json()

    if (!email || !name || !company || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contrasena debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Las contrasenas no coinciden' },
        { status: 400 }
      )
    }

    const user = createUser({ email, name, company, password })

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
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Error interno del servidor'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
