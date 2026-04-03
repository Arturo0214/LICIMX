'use client'

/**
 * LICIMX - Local State Store
 *
 * Provides localStorage-based persistence for the entire app.
 * All data is stored under namespaced keys and initialised from mock data
 * on first use. This module replaces Supabase until the auth agent connects it.
 */

// ---------------------------------------------------------------------------
// Storage Keys
// ---------------------------------------------------------------------------

export const STORAGE_KEYS = {
  BIDS: 'licimx_bids',
  CONTACTS: 'licimx_contacts',
  SCORING_WEIGHTS: 'licimx_scoring_weights',
  SCORING_DISCARD_RULES: 'licimx_scoring_discard_rules',
  SETTINGS_ORG: 'licimx_settings_org',
  SETTINGS_NOTIF: 'licimx_settings_notif',
  IMPORTED_IDS: 'licimx_imported_ids',
  PROPOSALS: 'licimx_proposals',
  DOCUMENTS: 'licimx_documents',
  REQUIREMENTS: 'licimx_requirements',
  TASKS: 'licimx_tasks',
} as const

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

export function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

export function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage full or unavailable - silently ignore
  }
}
