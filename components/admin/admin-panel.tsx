'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CheckCircle2,
  Copy,
  ImagePlus,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Unplug,
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
  uniqueSlug,
  valueToJsonText,
  valueToLines,
  type FieldDef,
} from '@/lib/admin/schema'

type ListResponse = { data: Record<string, unknown>[] }

function itemTitle(item: Record<string, unknown>, titleKey: string) {
  const v = item[titleKey] ?? item.id ?? 'Untitled'
  return String(v)
}

export function AdminPanel() {
  const [settings, setSettings] = useState<AdminSettings>({ baseUrl: '', token: '' })
  const [hydrated, setHydrated] = useState(false)
  const [connected, setConnected] = useState(false)
  const [busy, setBusy] = useState(false)
  const [resource, setResource] = useState<ResourceId>('cities')
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [related, setRelated] = useState<Partial<Record<ResourceId, Record<string, unknown>[]>>>({})
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [idLocked, setIdLocked] = useState(true)
  const [slugLocked, setSlugLocked] = useState(true)

  const resourceMeta = useMemo(
    () => RESOURCES.find((r) => r.id === resource)!,
    [resource],
  )
  const schema = RESOURCE_SCHEMAS[resource]
  const hasSlug = schema.fields.some((f) => f.key === 'slug')

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
      setSelectedId(null)
      setIsNew(false)
      setDraft(null)
      toast.success('Connected')
    } catch (err) {
      setConnected(false)
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
    setIdLocked(true)
    setSlugLocked(true)
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

  const applyIdentity = (
    prev: Record<string, unknown>,
    sourceValue: string,
    lockId: boolean,
    lockSlug: boolean,
  ) => {
    const next = { ...prev }
    const base = slugify(sourceValue)
    if (!lockId) {
      next.id = uniqueSlug(
        base || 'item',
        existingIds.filter((id) => id !== String(prev.id ?? '')),
      )
    }
    if (hasSlug && !lockSlug) {
      next.slug = uniqueSlug(
        base || 'item',
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
    setIdLocked(true)
    setSlugLocked(true)
  }

  const startNew = () => {
    setIsNew(true)
    setSelectedId(null)
    setIdLocked(false)
    setSlugLocked(false)
    const stub = emptyRecord(resource)
    setDraft(stub)
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
    setIdLocked(false)
    setSlugLocked(false)
    setDraft(copy)
    toast.message('Duplicated — edit and save as a new record')
  }

  const setField = (key: string, value: unknown) => {
    setDraft((prev) => {
      if (!prev) return prev
      let next = { ...prev, [key]: value }
      const field = schema.fields.find((f) => f.key === key)
      if (field?.generatesIdentity && typeof value === 'string') {
        next = applyIdentity(next, value, idLocked, slugLocked)
      }
      return next
    })
    if (key === 'id') setIdLocked(true)
    if (key === 'slug') setSlugLocked(true)
  }

  const saveDraft = async () => {
    if (!draft) return
    const body = { ...draft }
    if (!body.id || typeof body.id !== 'string' || !body.id.trim()) {
      toast.error('ID is required')
      return
    }
    // Drop empty optional strings / nulls that confuse required checks loosely
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
      setIdLocked(true)
      setSlugLocked(true)
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
      await refreshList(settings, resource)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  const onUpload = async (file: File | null) => {
    if (!file || !draft) return
    const imageField = schema.imageField
    if (!imageField) {
      toast.error('This resource has no image field')
      return
    }
    setBusy(true)
    try {
      const dataUrl = await readAsDataUrl(file)
      const result = await adminFetch<{ path: string }>(settings, '/v1/uploads', {
        method: 'POST',
        body: JSON.stringify({
          folder: schema.uploadFolder,
          filename: file.name.replace(/\.[^.]+$/, ''),
          data: dataUrl,
        }),
      })
      setField(imageField, result.path)
      toast.success(`Uploaded ${result.path}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="mb-8 flex flex-col gap-2 border-b border-border pb-6">
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

      <section className="mb-8 rounded-2xl border-2 border-border bg-card p-5 shadow-sm">
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
            {busy ? <Loader2 className="animate-spin" /> : connected ? <RefreshCw /> : <Unplug />}
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
      </section>

      {!connected ? null : (
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
            {RESOURCES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => loadResource(r.id)}
                className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  resource === r.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                {r.label}
              </button>
            ))}
          </nav>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div className="rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
                <h2 className="font-display text-lg font-bold">{resourceMeta.label}</h2>
                <Button size="sm" variant="secondary" onClick={startNew} disabled={busy}>
                  <Plus />
                  New
                </Button>
              </div>
              <ul className="max-h-[32rem] divide-y divide-border overflow-y-auto">
                {items.length === 0 ? (
                  <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No rows yet
                  </li>
                ) : (
                  items.map((item) => {
                    const id = String(item.id)
                    const active = !isNew && selectedId === id
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => selectItem(item)}
                          className={`flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors ${
                            active ? 'bg-muted' : 'hover:bg-muted/60'
                          }`}
                        >
                          <span className="font-medium leading-tight">
                            {itemTitle(item, resourceMeta.titleKey)}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">{id}</span>
                        </button>
                      </li>
                    )
                  })
                )}
              </ul>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-lg font-bold">
                  {isNew ? 'New record' : selectedId ? `Edit · ${selectedId}` : 'Editor'}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={duplicateSelected}
                    disabled={busy || (!draft && !selectedId)}
                  >
                    <Copy />
                    Duplicate
                  </Button>
                  <Button size="sm" onClick={saveDraft} disabled={busy || !draft}>
                    {busy ? <Loader2 className="animate-spin" /> : <Save />}
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={removeSelected}
                    disabled={busy || isNew || !selectedId}
                  >
                    <Trash2 />
                    Delete
                  </Button>
                </div>
              </div>

              {!draft ? (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  Select a row or create a new one
                </p>
              ) : (
                <div className="flex max-h-[36rem] flex-col gap-4 overflow-y-auto pr-1">
                  {schema.fields.map((field) => (
                    <FieldControl
                      key={field.key}
                      field={field}
                      value={draft[field.key]}
                      related={related}
                      onChange={(value) => setField(field.key, value)}
                    />
                  ))}

                  {schema.imageField ? (
                    <div className="rounded-xl border border-dashed border-border bg-muted/40 p-3">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <span className="text-xs font-medium text-muted-foreground">
                          Upload folder: <code>{schema.uploadFolder}</code>
                        </span>
                        <label className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-[0.8rem] font-medium hover:bg-muted">
                          <ImagePlus className="size-3.5" />
                          Upload image
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="sr-only"
                            disabled={busy}
                            onChange={(e) => {
                              void onUpload(e.target.files?.[0] ?? null)
                              e.target.value = ''
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Fills the <code>{schema.imageField}</code> field after upload.
                      </p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FieldControl({
  field,
  value,
  related,
  onChange,
}: {
  field: FieldDef
  value: unknown
  related: Partial<Record<ResourceId, Record<string, unknown>[]>>
  onChange: (value: unknown) => void
}) {
  const id = `field-${field.key}`

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

  // text + image path
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
