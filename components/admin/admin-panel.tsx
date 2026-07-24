'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CheckCircle2,
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

type ListResponse = { data: Record<string, unknown>[] }

function itemTitle(item: Record<string, unknown>, titleKey: string) {
  const v = item[titleKey] ?? item.id ?? 'Untitled'
  return String(v)
}

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2)
}

export function AdminPanel() {
  const [settings, setSettings] = useState<AdminSettings>({ baseUrl: '', token: '' })
  const [hydrated, setHydrated] = useState(false)
  const [connected, setConnected] = useState(false)
  const [busy, setBusy] = useState(false)
  const [resource, setResource] = useState<ResourceId>('cities')
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState('{\n  \n}')
  const [isNew, setIsNew] = useState(false)
  const [uploadFolder, setUploadFolder] = useState('cities')

  const resourceMeta = useMemo(
    () => RESOURCES.find((r) => r.id === resource)!,
    [resource],
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

  const connect = async () => {
    setBusy(true)
    try {
      saveSettings(settings)
      await adminFetch(settings, '/v1/health')
      // health is public; verify token with a real resource list
      await refreshList(settings, resource)
      setConnected(true)
      setSelectedId(null)
      setIsNew(false)
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
    setDraft('{\n  \n}')
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

  const selectItem = (item: Record<string, unknown>) => {
    setIsNew(false)
    setSelectedId(String(item.id))
    setDraft(pretty(item))
  }

  const startNew = () => {
    setIsNew(true)
    setSelectedId(null)
    const stub: Record<string, unknown> = { id: '' }
    if (resource === 'cities') {
      Object.assign(stub, {
        slug: '',
        name: '',
        country: '',
        countryFlag: '',
        description: '',
        status: 'planned',
        social: [],
        timezone: 'CET',
      })
    } else if (resource === 'events') {
      Object.assign(stub, {
        slug: '',
        title: '',
        cityId: '',
        venueId: '',
        topicId: '',
        date: '',
        time: '18:30',
        description: '',
      })
    } else if (resource === 'venues') {
      Object.assign(stub, {
        name: '',
        cityId: '',
        address: '',
      })
    } else if (resource === 'topics') {
      Object.assign(stub, {
        slug: '',
        name: '',
        tagline: '',
        description: '',
        icon: 'MessagesSquare',
        color: 'var(--chart-1)',
        status: 'soon',
      })
    } else if (resource === 'organisers') {
      Object.assign(stub, { name: '', role: '', bio: '', social: [] })
    } else if (resource === 'faqs') {
      Object.assign(stub, { question: '', answer: '', sortOrder: 0 })
    } else if (resource === 'testimonials') {
      Object.assign(stub, { quote: '', name: '', role: '' })
    } else if (resource === 'press') {
      Object.assign(stub, { title: '', excerpt: '', url: '', outlet: '' })
    }
    setDraft(pretty(stub))
  }

  const saveDraft = async () => {
    let body: Record<string, unknown>
    try {
      body = JSON.parse(draft) as Record<string, unknown>
    } catch {
      toast.error('Draft is not valid JSON')
      return
    }
    if (!body.id || typeof body.id !== 'string') {
      toast.error('Each record needs a string "id"')
      return
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
      setDraft(pretty(body))
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
      setDraft('{\n  \n}')
      await refreshList(settings, resource)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  const onUpload = async (file: File | null) => {
    if (!file) return
    setBusy(true)
    try {
      const dataUrl = await readAsDataUrl(file)
      const result = await adminFetch<{ path: string }>(settings, '/v1/uploads', {
        method: 'POST',
        body: JSON.stringify({
          folder: uploadFolder,
          filename: file.name.replace(/\.[^.]+$/, ''),
          data: dataUrl,
        }),
      })
      try {
        const parsed = JSON.parse(draft) as Record<string, unknown>
        if ('image' in parsed || resource === 'cities' || resource === 'venues' || resource === 'events') {
          parsed.image = result.path
        } else if (resource === 'organisers' || resource === 'testimonials') {
          parsed.avatar = result.path
        } else {
          parsed.image = result.path
        }
        setDraft(pretty(parsed))
      } catch {
        /* leave draft */
      }
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

          <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
                <h2 className="font-display text-lg font-bold">{resourceMeta.label}</h2>
                <Button size="sm" variant="secondary" onClick={startNew} disabled={busy}>
                  <Plus />
                  New
                </Button>
              </div>
              <ul className="max-h-[28rem] divide-y divide-border overflow-y-auto">
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
                    onClick={saveDraft}
                    disabled={busy || (!isNew && !selectedId)}
                  >
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

              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="min-h-[22rem] font-mono text-xs leading-relaxed"
                spellCheck={false}
                placeholder="Select a row or create a new one"
              />

              <div className="rounded-xl border border-dashed border-border bg-muted/40 p-3">
                <div className="mb-2 flex flex-wrap items-end gap-3">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="upload-folder" className="text-xs">
                      Upload folder
                    </Label>
                    <select
                      id="upload-folder"
                      className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
                      value={uploadFolder}
                      onChange={(e) => setUploadFolder(e.target.value)}
                    >
                      {['cities', 'venues', 'people', 'community', 'misc'].map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
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
                  Uploads via the API, then sets <code>image</code> or <code>avatar</code> on the
                  draft JSON when possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
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
