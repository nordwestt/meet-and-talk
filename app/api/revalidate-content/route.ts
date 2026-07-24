import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

/**
 * POST /api/revalidate-content
 * Header: Authorization: Bearer <CONTENT_REVALIDATE_SECRET>
 *
 * Busts the content cache so the next page request loads fresh Turso data.
 */
export async function POST(request: Request) {
  const secret = process.env.CONTENT_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'CONTENT_REVALIDATE_SECRET is not configured' },
      { status: 503 },
    )
  }

  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidateTag('content', 'max')
  revalidatePath('/', 'layout')

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
