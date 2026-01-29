import {useEffect, useState} from 'react'
import {getHeatmap} from '../lib/api'
import Heatmap from '../components/Heatmap'

export default function Home() {
  const [heatmap, setHeatmap] = useState<Record<string, number> | null>(null)
  const userId = 'demo-user' // replace with real user id or auth

  useEffect(() => {
    const end = new Date().toISOString().slice(0, 10)
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 3)
    const start = startDate.toISOString().slice(0, 10)

    getHeatmap(userId, start, end).then((data) => setHeatmap(data)).catch(() => setHeatmap({}))
  }, [])

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">Dashboard — Heatmap</h1>
      {heatmap ? (
        <Heatmap data={heatmap} />
      ) : (
        <div>Loading...</div>
      )}
    </main>
  )
}
