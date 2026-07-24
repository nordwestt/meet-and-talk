import type { ResourceId } from '@/lib/admin/client'

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'image'
  | 'date'
  | 'time'
  | 'lines' // newline-separated strings (gallery)
  | 'json' // advanced JSON blob (social, languages)

export type FieldDef = {
  key: string
  label: string
  type: FieldType
  required?: boolean
  hidden?: boolean
  options?: { value: string; label: string }[]
  /** When set, options are loaded from another resource's id + titleKey */
  optionsFrom?: ResourceId
  optionsLabelKey?: string
  hint?: string
  /** Generate id/slug from this field when creating/duplicating */
  generatesIdentity?: boolean
}

export type ResourceSchema = {
  id: ResourceId
  uploadFolder: string
  imageField: 'image' | 'avatar' | null
  identityFrom: string // field used to derive id + slug
  fields: FieldDef[]
}

/** Max length for auto-generated ids and slugs (DB TEXT, keep URLs short). */
export const MAX_IDENTITY_LEN = 48

export function slugify(input: string): string {
  const slug = input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
  const trimmed = slug.slice(0, MAX_IDENTITY_LEN).replace(/-+$/g, '')
  return trimmed || 'item'
}

export function uniqueSlug(base: string, existingIds: string[], existingSlugs: string[] = []): string {
  const root = slugify(base || 'item')
  let candidate = root
  let n = 2
  while (existingIds.includes(candidate) || existingSlugs.includes(candidate)) {
    const suffix = `-${n}`
    candidate = root.slice(0, Math.max(1, MAX_IDENTITY_LEN - suffix.length)) + suffix
    n += 1
  }
  return candidate
}

export const RESOURCE_SCHEMAS: Record<ResourceId, ResourceSchema> = {
  cities: {
    id: 'cities',
    uploadFolder: 'cities',
    imageField: 'image',
    identityFrom: 'name',
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true, hidden: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true, hidden: true },
      { key: 'name', label: 'Name', type: 'text', required: true, generatesIdentity: true },
      { key: 'country', label: 'Country', type: 'text', required: true },
      { key: 'countryFlag', label: 'Flag emoji', type: 'text', required: true },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: [
          { value: 'live', label: 'Live' },
          { value: 'planned', label: 'Planned' },
        ],
      },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      { key: 'timezone', label: 'Timezone', type: 'text' },
      { key: 'memberCount', label: 'Member count', type: 'number' },
      { key: 'image', label: 'Image path', type: 'image' },
      { key: 'gallery', label: 'Gallery paths', type: 'lines', hint: 'One path per line' },
      { key: 'social', label: 'Social links (JSON)', type: 'json' },
    ],
  },
  venues: {
    id: 'venues',
    uploadFolder: 'venues',
    imageField: 'image',
    identityFrom: 'name',
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true, hidden: true },
      { key: 'name', label: 'Name', type: 'text', required: true, generatesIdentity: true },
      {
        key: 'cityId',
        label: 'City',
        type: 'select',
        required: true,
        optionsFrom: 'cities',
        optionsLabelKey: 'name',
      },
      { key: 'address', label: 'Address', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'capacity', label: 'Capacity', type: 'number' },
      { key: 'image', label: 'Image path', type: 'image' },
      { key: 'social', label: 'Social links (JSON)', type: 'json' },
    ],
  },
  events: {
    id: 'events',
    uploadFolder: 'events',
    imageField: 'image',
    identityFrom: 'title',
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true, hidden: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true, hidden: true },
      { key: 'title', label: 'Title', type: 'text', required: true, generatesIdentity: true },
      {
        key: 'cityId',
        label: 'City',
        type: 'select',
        required: true,
        optionsFrom: 'cities',
        optionsLabelKey: 'name',
      },
      {
        key: 'venueId',
        label: 'Venue',
        type: 'select',
        required: true,
        optionsFrom: 'venues',
        optionsLabelKey: 'name',
      },
      {
        key: 'topicId',
        label: 'Topic',
        type: 'select',
        required: true,
        optionsFrom: 'topics',
        optionsLabelKey: 'name',
      },
      { key: 'date', label: 'Date', type: 'date', required: true },
      { key: 'time', label: 'Time', type: 'time', required: true },
      { key: 'recurring', label: 'Recurring', type: 'text', hint: 'e.g. Wednesday' },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      { key: 'capacity', label: 'Capacity', type: 'number' },
      { key: 'going', label: 'Going', type: 'number' },
      { key: 'price', label: 'Price', type: 'text' },
      { key: 'image', label: 'Image path', type: 'image' },
      {
        key: 'languages',
        label: 'Languages',
        type: 'lines',
        hint: 'One per line: en|English',
      },
      { key: 'social', label: 'Social links (JSON)', type: 'json' },
    ],
  },
  organisers: {
    id: 'organisers',
    uploadFolder: 'people',
    imageField: 'avatar',
    identityFrom: 'name',
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true, hidden: true },
      { key: 'name', label: 'Name', type: 'text', required: true, generatesIdentity: true },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'bio', label: 'Bio', type: 'textarea' },
      { key: 'avatar', label: 'Avatar path', type: 'image' },
      { key: 'social', label: 'Social links (JSON)', type: 'json' },
    ],
  },
  topics: {
    id: 'topics',
    uploadFolder: 'misc',
    imageField: null,
    identityFrom: 'name',
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true, hidden: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true, hidden: true },
      { key: 'name', label: 'Name', type: 'text', required: true, generatesIdentity: true },
      { key: 'tagline', label: 'Tagline', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      { key: 'icon', label: 'Icon (lucide name)', type: 'text', required: true },
      { key: 'color', label: 'Color', type: 'text', required: true },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: [
          { value: 'live', label: 'Live' },
          { value: 'soon', label: 'Coming soon' },
        ],
      },
    ],
  },
  faqs: {
    id: 'faqs',
    uploadFolder: 'misc',
    imageField: null,
    identityFrom: 'question',
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true, hidden: true },
      { key: 'question', label: 'Question', type: 'text', required: true, generatesIdentity: true },
      { key: 'answer', label: 'Answer', type: 'textarea', required: true },
      { key: 'sortOrder', label: 'Sort order', type: 'number' },
    ],
  },
  testimonials: {
    id: 'testimonials',
    uploadFolder: 'people',
    imageField: 'avatar',
    identityFrom: 'name',
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true, hidden: true },
      { key: 'name', label: 'Name', type: 'text', required: true, generatesIdentity: true },
      { key: 'role', label: 'Role', type: 'text', required: true },
      { key: 'quote', label: 'Quote', type: 'textarea', required: true },
      {
        key: 'cityId',
        label: 'City',
        type: 'select',
        optionsFrom: 'cities',
        optionsLabelKey: 'name',
      },
      { key: 'avatar', label: 'Avatar path', type: 'image' },
    ],
  },
  press: {
    id: 'press',
    uploadFolder: 'misc',
    imageField: null,
    identityFrom: 'title',
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true, hidden: true },
      { key: 'title', label: 'Title', type: 'text', required: true, generatesIdentity: true },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
      { key: 'url', label: 'URL', type: 'text', required: true },
      { key: 'outlet', label: 'Outlet', type: 'text', required: true },
      { key: 'author', label: 'Author', type: 'text' },
      { key: 'date', label: 'Date', type: 'date' },
      {
        key: 'cityId',
        label: 'City',
        type: 'select',
        optionsFrom: 'cities',
        optionsLabelKey: 'name',
      },
    ],
  },
}

export function emptyRecord(resource: ResourceId): Record<string, unknown> {
  const schema = RESOURCE_SCHEMAS[resource]
  const record: Record<string, unknown> = {}
  for (const field of schema.fields) {
    if (field.type === 'lines') record[field.key] = []
    else if (field.type === 'json') record[field.key] = field.key === 'social' ? [] : null
    else if (field.type === 'number') record[field.key] = null
    else if (field.key === 'status' && field.options?.[0]) record[field.key] = field.options[0].value
    else if (field.key === 'time') record[field.key] = '18:30'
    else if (field.key === 'timezone') record[field.key] = 'CET'
    else if (field.key === 'price') record[field.key] = 'Free'
    else if (field.key === 'icon') record[field.key] = 'MessagesSquare'
    else if (field.key === 'color') record[field.key] = 'var(--chart-1)'
    else record[field.key] = ''
  }
  return record
}

export function linesToValue(key: string, text: string): unknown {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  if (key === 'languages') {
    return lines.map((line) => {
      const [code, ...rest] = line.split('|')
      return { code: code.trim(), label: rest.join('|').trim() || code.trim() }
    })
  }
  return lines
}

export function valueToLines(key: string, value: unknown): string {
  if (!value) return ''
  if (key === 'languages' && Array.isArray(value)) {
    return value
      .map((item) => {
        if (item && typeof item === 'object' && 'code' in item) {
          const row = item as { code: string; label?: string }
          return `${row.code}|${row.label ?? row.code}`
        }
        return String(item)
      })
      .join('\n')
  }
  if (Array.isArray(value)) return value.map(String).join('\n')
  return String(value)
}

export function valueToJsonText(value: unknown): string {
  if (value == null || value === '') return ''
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return ''
  }
}

export function parseJsonText(text: string): unknown {
  const trimmed = text.trim()
  if (!trimmed) return null
  return JSON.parse(trimmed)
}
