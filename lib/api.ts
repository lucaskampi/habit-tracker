const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''

export type Habit = {
  id: string
  title: string
  description?: string | null
  frequencyType: 'DAILY' | 'WEEKLY' | 'CUSTOM'
  frequencySpec: any
  goal: number
}

export async function getHabits(userId: string): Promise<Habit[]> {
  const res = await fetch(`${API_BASE}/users/${userId}/habits`)
  if (!res.ok) throw new Error('Failed to fetch habits')
  return res.json()
}

export async function createHabit(userId: string, body: Partial<Habit>) {
  const res = await fetch(`${API_BASE}/users/${userId}/habits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Failed to create habit')
  return res.json()
}

export async function completeHabit(userId: string, habitId: string, date?: string, count = 1) {
  const res = await fetch(`${API_BASE}/users/${userId}/habits/${habitId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, count }),
  })
  if (!res.ok) throw new Error('Failed to complete habit')
  return res.json()
}

export async function uncompleteHabit(userId: string, habitId: string, date?: string) {
  const res = await fetch(`${API_BASE}/users/${userId}/habits/${habitId}/uncomplete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date }),
  })
  if (!res.ok) throw new Error('Failed to uncomplete habit')
  return res.json()
}

export async function getHeatmap(userId: string, start: string, end: string): Promise<Record<string, number>> {
  const q = new URL(`${API_BASE}/users/${userId}/habits/dashboard/heatmap`)
  q.searchParams.set('start', start)
  q.searchParams.set('end', end)
  const res = await fetch(q.toString())
  if (!res.ok) return {}
  return res.json()
}
