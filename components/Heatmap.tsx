import React from 'react'

type Props = {
  data: Record<string, number>
}

function toWeekArray(dates: string[]) {
  // Group into rows of 7 starting from the earliest date
  const sorted = dates.slice().sort()
  const rows: string[][] = []
  let row: string[] = []
  for (const d of sorted) {
    row.push(d)
    if (row.length === 7) {
      rows.push(row)
      row = []
    }
  }
  if (row.length) rows.push(row)
  return rows
}

export default function Heatmap({data}: Props) {
  const dates = Object.keys(data)
  const max = Math.max(...Object.values(data), 1)
  const rows = toWeekArray(dates)

  return (
    <div className="grid gap-2">
      {rows.map((row, i) => (
        <div key={i} className="flex space-x-2">
          {row.map((d) => {
            const v = data[d] ?? 0
            const intensity = Math.round((v / max) * 4) // 0..4
            const bg = ['bg-gray-100','bg-green-100','bg-green-300','bg-green-500','bg-green-700'][intensity]
            return (
              <div key={d} title={`${d}: ${v}`} className={`${bg} w-8 h-8 rounded-sm border`}></div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
