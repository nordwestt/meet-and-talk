'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Copy,
  ArrowLeft,
  ImagePlus,
  Loader2,
  MapPin,
  MessagesSquare,
  Newspaper,
  Plus,
  Quote,
  RefreshCw,
  Save,
  Store,
  Trash2,
  Unplug,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  AdminApiError,
  adminFetch,
  loadSettings,
  RESOURCES,
  saveSettings,
  type AdminSettings,
  type ResourceId,
} from '@/lib/admin/client'
import {
  emptyRecord,
  linesToValue,
  parseJsonText,
  RESOURCE_SCHEMAS,
  slugify,
  LANGUAGE_OPTIONS,
  SOCIAL_PLATFORMS,
  uniqueSlug,
  valueToJsonText,
  valueToLines,
  type FieldDef,
} from '@/lib/admin/schema'

type ListResponse = { data: Record<string, unknown>[] }
type MobileScreen = 'categories' | 'list' | 'editor'

const RESOURCE_ICONS: Record<string, LucideIcon> = {
  CalendarDays,
  Store,
  Users,
  MapPin,
  MessagesSquare,
  CircleHelp,
  Quote,
  Newspaper,
}

function itemTitle(item: Record<string, unknown>, titleKey: string) {
  const v = item[titleKey] ?? item.id ?? 'Untitled'
  return String(v)
}

export function AdminPanel() {
  const [settings, setSettings] = useState<AdminSettings>({ baseUrl: '', token: '' })
  const [hydrated, setHydrated] = useState(false)
  const [connected, setConnected] = useState(false)
  const [showConnectionDetails, setShowConnectionDetails] = useState(true)
  const [mobileScreen, setMobileScreen] = useState<MobileScreen>('categories')
  const [busy, setBusy] = useState(false)
  const [resource, setResource] = useState<ResourceId>('events')
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [related, setRelated] = useState<Partial<Record<ResourceId, Record<string, unknown>[]>>>({})
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null)
  const [isNew, setIsNew] = useState(false)

  const resourceMeta = useMemo(
    () => RESOURCES.find((r) => r.id === resource)!,
    [resource],
  )
  const schema = RESOURCE_SCHEMAS[resource]
  const hasSlug = schema.fields.some((f) => f.key === 'slug')
  const visibleFields = useMemo(
    () => schema.fields.filter((f) => !f.hidden),
    [schema.fields],
  )
  useEffect(() => {
    setSettings(loadSettings())
    setHydrated(true)
  }, [])

  const persist = (next: AdminSettings) => {
    setSettings(next)
    saveSettings(next)
  }

  const refreshList = useCallback(async (s: AdminSettings, res: ResourceId) => {
    const result = await adminFetch<ListResponse>(s, `/v1/${res}`)
    setItems(result.data ?? [])
  }, [])

  const loadRelated = useCallback(async (s: AdminSettings) => {
    const needed: ResourceId[] = ['cities', 'venues', 'topics']
    const entries = await Promise.all(
      needed.map(async (id) => {
        try {
          const result = await adminFetch<ListResponse>(s, `/v1/${id}`)
          return [id, result.data ?? []] as const
        } catch {
          return [id, []] as const
        }
      }),
    )
    setRelated(Object.fromEntries(entries))
  }, [])

  const connect = async () => {
    setBusy(true)
    try {
      saveSettings(settings)
      await adminFetch(settings, '/v1/health')
      await refreshList(settings, resource)
      await loadRelated(settings)
      setConnected(true)
      setShowConnectionDetails(false)
      setMobileScreen('categories')
      setSelectedId(null)
      setIsNew(false)
      setDraft(null)
      toast.success('Connected')
    } catch (err) {
      setConnected(false)
      setShowConnectionDetails(true)
      toast.error(err instanceof Error ? err.message : 'Connection failed')
    } finally {
      setBusy(false)
    }
  }

  const loadResource = async (res: ResourceId) => {
    setResource(res)
    setSelectedId(null)
    setIsNew(false)
    setDraft(null)
    setMobileScreen('list')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    if (!connected) return
    setBusy(true)
    try {
      await refreshList(settings, res)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setBusy(false)
    }
  }

  const existingIds = useMemo(() => items.map((i) => String(i.id)), [items])
  const existingSlugs = useMemo(
    () => items.map((i) => String(i.slug ?? '')).filter(Boolean),
    [items],
  )

  const withIdentity = (
    prev: Record<string, unknown>,
    sourceValue: string,
    { refreshId, refreshSlug }: { refreshId: boolean; refreshSlug: boolean },
  ) => {
    const next = { ...prev }
    const base = slugify(sourceValue)
    if (refreshId) {
      next.id = uniqueSlug(
        base,
        existingIds.filter((id) => id !== String(prev.id ?? '')),
      )
    }
    if (hasSlug && refreshSlug) {
      next.slug = uniqueSlug(
        base,
        [],
        existingSlugs.filter((s) => s !== String(prev.slug ?? '')),
      )
    }
    return next
  }

  const selectItem = (item: Record<string, unknown>) => {
    setIsNew(false)
    setSelectedId(String(item.id))
    setDraft({ ...item })
    setMobileScreen('editor')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startNew = () => {
    setIsNew(true)
    setSelectedId(null)
    setDraft(emptyRecord(resource))
    setMobileScreen('editor')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const duplicateSelected = () => {
    const fromList = items.find((i) => String(i.id) === selectedId)
    const baseSource = fromList ?? draft
    if (!baseSource) return

    const copy: Record<string, unknown> = { ...baseSource }
    const identitySource = String(copy[schema.identityFrom] ?? copy.id ?? 'item')
    const base = `${slugify(identitySource)}-copy`
    copy.id = uniqueSlug(base, existingIds)
    if (hasSlug) {
      copy.slug = uniqueSlug(base, [], existingSlugs)
    }
    setIsNew(true)
    setSelectedId(null)
    setDraft(copy)
    setMobileScreen('editor')
    toast.message('Duplicated — edit and save as a new record')
  }

  const setField = (key: string, value: unknown) => {
    setDraft((prev) => {
      if (!prev) return prev
      let next = { ...prev, [key]: value }
      const field = schema.fields.find((f) => f.key === key)
      // Only refresh id/slug while creating; never rewrite identity on existing rows
      if (isNew && field?.generatesIdentity && typeof value === 'string') {
        next = withIdentity(next, value, { refreshId: true, refreshSlug: true })
      }
      return next
    })
  }

  const saveDraft = async () => {
    if (!draft) return
    let body = { ...draft }

    // Ensure hidden identity fields exist before create
    if (isNew) {
      const source = String(body[schema.identityFrom] ?? '')
      if (!source.trim()) {
        toast.error(`Please fill in ${schema.identityFrom}`)
        return
      }
      body = withIdentity(body, source, { refreshId: true, refreshSlug: hasSlug })
    }

    if (!body.id || typeof body.id !== 'string' || !body.id.trim()) {
      toast.error('Could not generate an ID')
      return
    }
    if (hasSlug && (!body.slug || typeof body.slug !== 'string')) {
      body.slug = body.id
    }

    for (const [k, v] of Object.entries(body)) {
      if (v === '') {
        const field = schema.fields.find((f) => f.key === k)
        if (!field?.required) delete body[k]
      }
    }
    setBusy(true)
    try {
      if (isNew) {
        await adminFetch(settings, `/v1/${resource}`, {
          method: 'POST',
          body: JSON.stringify(body),
        })
        toast.success('Created')
      } else {
        const id = String(body.id)
        await adminFetch(settings, `/v1/${resource}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        })
        toast.success('Saved')
      }
      await refreshList(settings, resource)
      setIsNew(false)
      setSelectedId(String(body.id))
      setDraft(body)
      setMobileScreen('editor')
    } catch (err) {
      toast.error(err instanceof AdminApiError ? err.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const removeSelected = async () => {
    if (!selectedId || isNew) return
    if (!window.confirm(`Delete ${resource}/${selectedId}?`)) return
    setBusy(true)
    try {
      await adminFetch(settings, `/v1/${resource}/${selectedId}`, { method: 'DELETE' })
      toast.success('Deleted')
      setSelectedId(null)
      setDraft(null)
      setMobileScreen('list')
      await refreshList(settings, resource)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  const backFromEditor = () => {
    setDraft(null)
    setSelectedId(null)
    setIsNew(false)
    setMobileScreen('list')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const backFromList = () => {
    setMobileScreen('categories')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  const hideChromeOnMobile =
    connected && mobileScreen !== 'categories'

  return (
    <div className="mx-auto max-w-6xl px-2 py-4 sm:px-4 sm:py-14">
      <header
        className={`mb-4 flex flex-col gap-2 border-b border-border pb-4 sm:mb-8 sm:pb-6 ${
          hideChromeOnMobile ? 'max-lg:hidden' : ''
        }`}
      >
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Internal
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Admin panel
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Paste your API token, connect to the Go admin API, then edit content. Token stays in
          this browser only (localStorage).
        </p>
      </header>

      <section
        className={`mb-4 rounded-2xl border-2 border-border bg-card shadow-sm sm:mb-6 ${
          hideChromeOnMobile ? 'max-lg:hidden' : ''
        }`}
      >
        {connected && !showConnectionDetails ? (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2 text-sm">
              <CheckCircle2 className="size-4 shrink-0 text-primary" />
              <span className="font-medium text-primary">Connected</span>
              <span className="truncate text-muted-foreground">{settings.baseUrl}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={connect} disabled={busy}>
                {busy ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                Reconnect
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowConnectionDetails(true)}
              >
                <ChevronDown />
                Settings
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-5">
            {connected ? (
              <button
                type="button"
                className="mb-4 flex w-full items-center justify-between text-left text-sm font-medium"
                onClick={() => setShowConnectionDetails(false)}
              >
                <span className="inline-flex items-center gap-1.5 text-primary">
                  <CheckCircle2 className="size-4" />
                  Connection settings
                </span>
                <ChevronUp className="size-4 text-muted-foreground" />
              </button>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="admin-base">API base URL</Label>
                <Input
                  id="admin-base"
                  value={settings.baseUrl}
                  onChange={(e) => persist({ ...settings, baseUrl: e.target.value })}
                  placeholder="http://127.0.0.1:3080 or /admin-api"
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="admin-token">Admin API token</Label>
                <Input
                  id="admin-token"
                  type="password"
                  value={settings.token}
                  onChange={(e) => persist({ ...settings, token: e.target.value })}
                  placeholder="Bearer token value"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button onClick={connect} disabled={busy || !settings.token}>
                {busy ? (
                  <Loader2 className="animate-spin" />
                ) : connected ? (
                  <RefreshCw />
                ) : (
                  <Unplug />
                )}
                {connected ? 'Reconnect' : 'Connect'}
              </Button>
              {connected ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  <CheckCircle2 className="size-4" />
                  Connected
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">Not connected</span>
              )}
            </div>
          </div>
        )}
      </section>

      {!connected ? null : (
        <div className="grid gap-3 sm:gap-6 lg:grid-cols-[240px_1fr]">
          <nav
            className={`flex flex-col gap-1.5 ${
              mobileScreen !== 'categories' ? 'max-lg:hidden' : ''
            }`}
          >
            <p className="mb-1 px-1 text-sm font-medium text-muted-foreground lg:hidden">
              Choose a category
            </p>
            {RESOURCES.map((r) => {
              const Icon = RESOURCE_ICONS[r.icon] ?? CalendarDays
              const active = resource === r.id
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => loadResource(r.id)}
                  className={`inline-flex min-h-12 items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left text-base font-medium transition-colors max-lg:active:bg-primary max-lg:active:text-primary-foreground lg:min-h-0 lg:gap-2 lg:rounded-lg lg:border-transparent lg:px-3 lg:py-2 lg:text-sm ${
                    active
                      ? 'lg:bg-primary lg:text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <Icon className="size-5 shrink-0 opacity-90 lg:size-4" />
                  <span className="min-w-0 truncate">{r.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="grid min-w-0 gap-3 sm:gap-4 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div
              className={`min-w-0 overflow-hidden rounded-2xl border border-border bg-card ${
                mobileScreen !== 'list' ? 'max-lg:hidden' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-2 border-b border-border px-2 py-2.5 sm:px-4 sm:py-3">
                <div className="flex min-w-0 items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="shrink-0 lg:hidden"
                    onClick={backFromList}
                    aria-label="Back to categories"
                  >
                    <ArrowLeft />
                  </Button>
                  <h2 className="truncate font-display text-lg font-bold">
                    {resourceMeta.label}
                  </h2>
                </div>
                <Button size="sm" variant="secondary" onClick={startNew} disabled={busy}>
                  <Plus />
                  New
                </Button>
              </div>
              <ul className="max-h-[min(70vh,32rem)] divide-y divide-border overflow-y-auto lg:max-h-[32rem]">
                {items.length === 0 ? (
                  <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No rows yet
                  </li>
                ) : (
                  items.map((item) => {
                    const id = String(item.id)
                    const active = !isNew && selectedId === id
                    return (
                      <li key={id} className="min-w-0">
                        <button
                          type="button"
                          onClick={() => selectItem(item)}
                          className={`flex w-full min-w-0 flex-col justify-center gap-0.5 px-3 py-3 text-left transition-colors sm:min-h-14 sm:px-4 ${
                            active ? 'bg-muted' : 'hover:bg-muted/60'
                          }`}
                        >
                          <span className="truncate font-medium leading-tight">
                            {itemTitle(item, resourceMeta.titleKey)}
                          </span>
                          <span className="truncate font-mono text-xs text-muted-foreground">
                            {id}
                          </span>
                        </button>
                      </li>
                    )
                  })
                )}
              </ul>
            </div>

            <div
              className={`flex min-w-0 flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card p-3 sm:p-4 ${
                mobileScreen !== 'editor' ? 'max-lg:hidden' : ''
              }`}
            >
              <div className="flex min-w-0 items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="shrink-0 lg:hidden"
                    onClick={backFromEditor}
                    aria-label="Back to list"
                  >
                    <ArrowLeft />
                  </Button>
                  <h2 className="min-w-0 truncate font-display text-lg font-bold">
                    {isNew
                      ? 'New record'
                      : draft
                        ? `Edit · ${itemTitle(draft, resourceMeta.titleKey)}`
                        : 'Editor'}
                  </h2>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                  onClick={duplicateSelected}
                  disabled={busy || (!draft && !selectedId)}
                >
                  <Copy />
                  <span className="max-sm:hidden">Duplicate</span>
                </Button>
              </div>

              {!draft ? (
                <p className="hidden py-16 text-center text-sm text-muted-foreground lg:block">
                  Select a row or create a new one
                </p>
              ) : (
                <>
                  <div className="flex max-h-[min(70vh,36rem)] flex-col gap-4 overflow-y-auto pr-1 lg:max-h-[36rem]">
                    {visibleFields.map((field) => (
                      <FieldControl
                        key={field.key}
                        field={field}
                        value={draft[field.key]}
                        related={related}
                        busy={busy}
                        uploadFolder={schema.uploadFolder}
                        onUpload={
                          field.type === 'image'
                            ? async (file) => {
                                if (!file) return
                                setBusy(true)
                                try {
                                  const dataUrl = await readAsDataUrl(file)
                                  const result = await adminFetch<{ path: string }>(
                                    settings,
                                    '/v1/uploads',
                                    {
                                      method: 'POST',
                                      body: JSON.stringify({
                                        folder: schema.uploadFolder,
                                        filename: file.name.replace(/\.[^.]+$/, ''),
                                        data: dataUrl,
                                      }),
                                    },
                                  )
                                  setField(field.key, result.path)
                                  toast.success('Photo uploaded')
                                } catch (err) {
                                  toast.error(
                                    err instanceof Error ? err.message : 'Upload failed',
                                  )
                                } finally {
                                  setBusy(false)
                                }
                              }
                            : undefined
                        }
                        onChange={(value) => setField(field.key, value)}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                    <Button
                      className="flex-1 sm:flex-none"
                      onClick={saveDraft}
                      disabled={busy || !draft}
                    >
                      {busy ? <Loader2 className="animate-spin" /> : <Save />}
                      Save
                    </Button>
                    <Button
                      className="flex-1 sm:flex-none"
                      variant="destructive"
                      onClick={removeSelected}
                      disabled={busy || isNew || !selectedId}
                    >
                      <Trash2 />
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type SocialRow = {
  platform: string
  url: string
  handle?: string
}

type LangRow = { code: string; label: string }

function asLanguageRows(value: unknown): LangRow[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .map((item) => ({
      code: String(item.code ?? ''),
      label: String(item.label ?? item.code ?? ''),
    }))
    .filter((item) => item.code)
}

function LanguagePicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: unknown
  onChange: (value: unknown) => void
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const selected = asLanguageRows(value)
  const selectedCodes = new Set(selected.map((l) => l.code))

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LANGUAGE_OPTIONS.filter((opt) => {
      if (selectedCodes.has(opt.code)) return false
      if (!q) return true
      return (
        opt.label.toLowerCase().includes(q) ||
        opt.code.toLowerCase().includes(q)
      )
    }).slice(0, 12)
  }, [query, selectedCodes])

  const add = (opt: { code: string; label: string }) => {
    if (selectedCodes.has(opt.code)) return
    onChange([...selected, { code: opt.code, label: opt.label }])
    setQuery('')
    setOpen(false)
  }

  const remove = (code: string) => {
    onChange(selected.filter((l) => l.code !== code))
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selected.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => remove(lang.code)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-sm hover:bg-muted"
              title="Remove"
            >
              <span>{lang.label}</span>
              <span className="text-xs text-muted-foreground">{lang.code}</span>
              <span className="text-muted-foreground" aria-hidden>
                ×
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No languages selected yet.</p>
      )}

      <div className="relative">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            // Allow click on option before closing
            window.setTimeout(() => setOpen(false), 150)
          }}
          placeholder="Search languages to add…"
          autoComplete="off"
        />
        {open ? (
          <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-border bg-card py-1 shadow-lg">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">No matches</li>
            ) : (
              filtered.map((opt) => (
                <li key={opt.code}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => add(opt)}
                  >
                    <span>{opt.label}</span>
                    <span className="font-mono text-xs text-muted-foreground">{opt.code}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

function asSocialRows(value: unknown): SocialRow[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .map((item) => ({
      platform: String(item.platform ?? 'website'),
      url: String(item.url ?? ''),
      handle: item.handle != null ? String(item.handle) : '',
    }))
}

function FieldControl({
  field,
  value,
  related,
  busy,
  uploadFolder,
  onUpload,
  onChange,
}: {
  field: FieldDef
  value: unknown
  related: Partial<Record<ResourceId, Record<string, unknown>[]>>
  busy?: boolean
  uploadFolder?: string
  onUpload?: (file: File | null) => void | Promise<void>
  onChange: (value: unknown) => void
}) {
  const id = `field-${field.key}`

  if (field.type === 'social') {
    const rows = asSocialRows(value)
    const update = (next: SocialRow[]) => {
      onChange(
        next.map((row) => {
          const out: Record<string, string> = {
            platform: row.platform,
            url: row.url,
          }
          if (row.handle?.trim()) out.handle = row.handle.trim()
          return out
        }),
      )
    }
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Label>{field.label}</Label>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() =>
              update([...rows, { platform: 'instagram', url: '', handle: '' }])
            }
          >
            <Plus className="size-3.5" />
            Add link
          </Button>
        </div>
        {rows.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
            No social links yet. Add WhatsApp, Instagram, etc.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {rows.map((row, index) => (
              <li
                key={`${row.platform}-${index}`}
                className="grid gap-2 rounded-xl border border-border bg-muted/30 p-3 sm:grid-cols-[140px_1fr_auto]"
              >
                <select
                  className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
                  value={row.platform}
                  onChange={(e) => {
                    const next = [...rows]
                    next[index] = { ...row, platform: e.target.value }
                    update(next)
                  }}
                  aria-label="Platform"
                >
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <div className="grid gap-2">
                  <Input
                    placeholder={
                      row.platform === 'email'
                        ? 'mailto:hello@example.com'
                        : 'https://…'
                    }
                    value={row.url}
                    onChange={(e) => {
                      const next = [...rows]
                      next[index] = { ...row, url: e.target.value }
                      update(next)
                    }}
                    aria-label="URL"
                  />
                  <Input
                    placeholder="Display label (optional), e.g. @meetandtalk"
                    value={row.handle ?? ''}
                    onChange={(e) => {
                      const next = [...rows]
                      next[index] = { ...row, handle: e.target.value }
                      update(next)
                    }}
                    aria-label="Handle"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="justify-self-end"
                  onClick={() => update(rows.filter((_, i) => i !== index))}
                >
                  <Trash2 className="size-3.5" />
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  if (field.type === 'image') {
    const path = String(value ?? '')
    const previewSrc = path
      ? path.startsWith('http') || path.startsWith('/')
        ? path
        : `/${path}`
      : ''
    return (
      <div className="flex flex-col gap-2">
        <Label>{field.label}</Label>
        <div className="flex flex-wrap items-start gap-4 rounded-xl border border-border bg-muted/30 p-3">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-lg border border-border bg-background">
            {previewSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewSrc} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                No photo
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Upload a photo — it will be stored and linked automatically.
              {uploadFolder ? (
                <>
                  {' '}
                  Saved under <code>{uploadFolder}</code>.
                </>
              ) : null}
            </p>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-muted">
                <ImagePlus className="size-3.5" />
                {path ? 'Replace photo' : 'Choose photo'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  disabled={busy || !onUpload}
                  onChange={(e) => {
                    void onUpload?.(e.target.files?.[0] ?? null)
                    e.target.value = ''
                  }}
                />
              </label>
              {path ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={busy}
                  onClick={() => onChange('')}
                >
                  <Trash2 className="size-3.5" />
                  Remove
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={id}>{field.label}</Label>
        <Textarea
          id={id}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-24"
        />
        {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
      </div>
    )
  }

  if (field.type === 'number') {
    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={id}>{field.label}</Label>
        <Input
          id={id}
          type="number"
          value={value == null || value === '' ? '' : String(value)}
          onChange={(e) => {
            const raw = e.target.value
            onChange(raw === '' ? null : Number(raw))
          }}
        />
      </div>
    )
  }

  if (field.type === 'date' || field.type === 'time') {
    const raw = String(value ?? '')
    const normalized =
      field.type === 'time' && /^\d{2}:\d{2}:\d{2}$/.test(raw) ? raw.slice(0, 5) : raw
    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={id}>{field.label}</Label>
        <Input
          id={id}
          type={field.type}
          value={normalized}
          onChange={(e) => onChange(e.target.value)}
        />
        {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
      </div>
    )
  }

  if (field.type === 'select') {
    const options =
      field.options ??
      (field.optionsFrom
        ? (related[field.optionsFrom] ?? []).map((row) => ({
            value: String(row.id),
            label: String(row[field.optionsLabelKey ?? 'name'] ?? row.id),
          }))
        : [])
    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={id}>{field.label}</Label>
        <select
          id={id}
          className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select…</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (field.type === 'languages') {
    return (
      <LanguagePicker
        label={field.label}
        value={value}
        onChange={onChange}
      />
    )
  }

  if (field.type === 'lines') {
    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={id}>{field.label}</Label>
        <Textarea
          id={id}
          value={valueToLines(field.key, value)}
          onChange={(e) => onChange(linesToValue(field.key, e.target.value))}
          className="min-h-20 font-mono text-xs"
        />
        {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
      </div>
    )
  }

  if (field.type === 'json') {
    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={id}>{field.label}</Label>
        <Textarea
          id={id}
          defaultValue={valueToJsonText(value)}
          key={`${id}-${valueToJsonText(value).slice(0, 40)}`}
          onBlur={(e) => {
            try {
              onChange(parseJsonText(e.target.value))
            } catch {
              toast.error(`Invalid JSON in ${field.label}`)
            }
          }}
          className="min-h-24 font-mono text-xs"
        />
        {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{field.label}</Label>
      <Input
        id={id}
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
      />
      {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
    </div>
  )
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.onload = () => resolve(String(reader.result))
    reader.readAsDataURL(file)
  })
}
