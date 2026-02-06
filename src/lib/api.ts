const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''

export type HabitFrequencyType = 'DAILY' | 'WEEKLY' | 'CUSTOM'

export type Habit = {
  id: string
  title: string
  description: string | null
  frequencyType: HabitFrequencyType
  frequencySpec: unknown
  goal: number
}

export type Heatmap = Record<string, number>

function toUrl(path: string): string {
  return `${API_BASE}${path}`
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed (${res.status})`)
  }
  return res.json() as Promise<T>
}

export async function getHabits(userId: string): Promise<Habit[]> {
  return json(await fetch(toUrl(`/users/${userId}/habits`), { cache: 'no-store' }))
}

export async function getHeatmap(userId: string, start: string, end: string): Promise<Heatmap> {
  // If no API base is configured, avoid calling a backend and return empty map
  if (!API_BASE) return {}

  const path = toUrl(`/users/${userId}/habits/dashboard/heatmap`)
  const url =
    path.startsWith('http://') || path.startsWith('https://')
      ? new URL(path)
      : new URL(path, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
  url.searchParams.set('start', start)
  url.searchParams.set('end', end)
  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) return {}
  return (await res.json()) as Heatmap
}

export async function createHabit(
  userId: string,
  body: Pick<Habit, 'title' | 'frequencyType' | 'frequencySpec' | 'goal'> & { description?: string | null },
): Promise<Habit> {
  return json(
    await fetch(toUrl(`/users/${userId}/habits`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  )
}

export async function completeHabit(userId: string, habitId: string, opts?: { date?: string; count?: number }) {
  return json(
    await fetch(toUrl(`/users/${userId}/habits/${habitId}/complete`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: opts?.date, count: opts?.count ?? 1 }),
    }),
  )
}

export async function uncompleteHabit(userId: string, habitId: string, opts?: { date?: string }) {
  return json(
    await fetch(toUrl(`/users/${userId}/habits/${habitId}/uncomplete`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: opts?.date }),
    }),
  )
}
