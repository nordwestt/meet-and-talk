import type { Metadata } from 'next'
import { AdminPanel } from '@/components/admin/admin-panel'

export const metadata: Metadata = {
  title: 'Admin panel',
  robots: { index: false, follow: false },
}

export default function AdminPanelPage() {
  return <AdminPanel />
}
