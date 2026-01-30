import React from "react";

type Props = {
  data: Record<string, number>;
};

function startOfWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0..6 (Sun..Sat)
  const diff = (day + 6) % 7; // Monday=0
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(d: Date, days: number): Date {
  const n = new Date(d);
  n.setDate(n.getDate() + days);
  return n;
}

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function Heatmap({ data }: Props) {
  const keys = Object.keys(data);
  if (!keys.length) return null;

  const min = new Date(keys.slice().sort()[0]);
  const max = new Date(keys.slice().sort()[keys.length - 1]);
  const start = startOfWeekMonday(min);

  // Build weeks x 7 days grid (Mon..Sun)
  const weeks: string[][] = [];
  let cursor = new Date(start);
  while (cursor <= max) {
    const week: string[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(fmt(addDays(cursor, i)));
    }
    weeks.push(week);
    cursor = addDays(cursor, 7);
  }

  const maxVal = Math.max(1, ...Object.values(data));
  const color = (v: number) => {
    const t = Math.round((v / maxVal) * 4);
    return [
      "bg-slate-100",
      "bg-emerald-100",
      "bg-emerald-200",
      "bg-emerald-400",
      "bg-emerald-600",
    ][t];
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-rows-7 gap-2">
            {week.map((d) => {
              const v = data[d] ?? 0;
              return (
                <div
                  key={d}
                  title={`${d}: ${v}`}
                  className={`${color(v)} h-4 w-4 rounded-[5px] border border-slate-200`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`${color((maxVal * i) / 4)} h-3 w-3 rounded border border-slate-200`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
