/**
 * LICIMX Type Exports
 *
 * Re-exports all database types and provides additional UI-specific types.
 */

// Re-export everything from the database schema types
export * from './database'

// ---------------------------------------------------------------------------
// UI-Specific Types
// ---------------------------------------------------------------------------

/** Opción genérica para select / dropdown components */
export interface SelectOption<T = string> {
  label: string
  value: T
  description?: string
  disabled?: boolean
}

/** Elemento de navegación lateral */
export interface NavItem {
  label: string
  href: string
  icon?: string
  badge?: string | number
  children?: NavItem[]
  roles?: import('./database').UserRole[]
}

/** Elemento de breadcrumb */
export interface BreadcrumbItem {
  label: string
  href?: string
}

/** Configuración de columnas para tablas */
export interface TableColumn<T = unknown> {
  key: string
  label: string
  sortable?: boolean
  /** Ancho en px o porcentaje */
  width?: string | number
  /** Función de renderizado personalizado */
  render?: (value: unknown, row: T) => React.ReactNode
}

/** Parámetros de paginación */
export interface PaginationParams {
  page: number
  per_page: number
  total: number
  total_pages: number
}

/** Parámetros de ordenamiento */
export interface SortParams {
  column: string
  direction: 'asc' | 'desc'
}

/** Filtros genéricos para listados */
export interface FilterParams {
  search?: string
  sort?: SortParams
  pagination?: PaginationParams
  [key: string]: unknown
}

/** Resultado de una operación asíncrona */
export interface AsyncResult<T> {
  data: T | null
  error: string | null
  loading: boolean
}

/** Toast / notificación de la UI */
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
}

/** Estado del modal genérico */
export interface ModalState<T = unknown> {
  isOpen: boolean
  data?: T
}

/** Respuesta paginada del servidor */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationParams
}

/** Resumen de un archivo subido (usado en el uploader) */
export interface UploadedFile {
  name: string
  original_filename: string
  storage_path: string
  url: string
  mime_type: string
  size_bytes: number
}

/** Elemento de actividad reciente para el dashboard */
export interface ActivityItem {
  id: string
  action: string
  bid_title?: string
  timestamp: string
  user: string
  type: 'stage_change' | 'comment' | 'document' | 'bid_created' | 'task_completed'
}
