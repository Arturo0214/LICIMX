/**
 * API Route: /api/contacts
 *
 * GET  - List contacts with filtering by type
 * POST - Create a new contact
 */

import { type NextRequest } from 'next/server'
import { mockContacts } from '@/lib/data/mock-data'
import type { Contact, ContactType } from '@/types'

// ---------------------------------------------------------------------------
// GET /api/contacts
// ---------------------------------------------------------------------------

const VALID_CONTACT_TYPES: ContactType[] = ['funcionario', 'competidor', 'proveedor', 'aliado']

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') as ContactType | null
    const search = searchParams.get('search')

    // TODO: Replace with supabase.from('contacts').select('*').order('name')
    let filtered = [...mockContacts]

    // Filter by type
    if (type) {
      if (!VALID_CONTACT_TYPES.includes(type)) {
        return Response.json(
          { error: `Tipo de contacto inválido. Valores permitidos: ${VALID_CONTACT_TYPES.join(', ')}` },
          { status: 400 }
        )
      }
      // TODO: Replace with .eq('type', type)
      filtered = filtered.filter((c) => c.type === type)
    }

    // Search by name, entity, or email
    if (search) {
      // TODO: Replace with .or(`name.ilike.%${search}%,entity.ilike.%${search}%,email.ilike.%${search}%`)
      const term = search.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.entity?.toLowerCase().includes(term) ||
          c.email?.toLowerCase().includes(term)
      )
    }

    return Response.json({ data: filtered })
  } catch (error) {
    console.error('[GET /api/contacts]', error)
    return Response.json(
      { error: 'Error al obtener contactos' },
      { status: 500 }
    )
  }
}

// ---------------------------------------------------------------------------
// POST /api/contacts
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const required = ['name', 'type'] as const
    const missing = required.filter((field) => !body[field])

    if (missing.length > 0) {
      return Response.json(
        { error: `Campos requeridos faltantes: ${missing.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate type
    if (!VALID_CONTACT_TYPES.includes(body.type)) {
      return Response.json(
        { error: `Tipo de contacto inválido. Valores permitidos: ${VALID_CONTACT_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()

    // TODO: Replace with supabase.from('contacts').insert({...}).select().single()
    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      organization_id: 'org-mock-001',
      type: body.type,
      name: body.name,
      position: body.position ?? null,
      entity: body.entity ?? null,
      email: body.email ?? null,
      phone: body.phone ?? null,
      notes: body.notes ?? null,
      tags: body.tags ?? [],
      created_at: now,
      updated_at: now,
    }

    mockContacts.push(newContact)

    return Response.json({ data: newContact }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/contacts]', error)
    return Response.json(
      { error: 'Error al crear contacto' },
      { status: 500 }
    )
  }
}
