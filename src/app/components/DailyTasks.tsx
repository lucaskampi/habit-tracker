"use client";

import React, { useEffect, useState } from "react";

type Habit = { id: number; title: string; completed: boolean };

type Props = { dateIso: string };

function isoToKeyVariants(iso: string) {
  // iso is YYYY-MM-DD
  const [y, m, d] = iso.split("-").map((s) => parseInt(s, 10));
  const withoutPadding = `${y}-${m}-${d}`;
  return [iso, withoutPadding];
}

export default function DailyTasks({ dateIso }: Props) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [byDate, setByDate] = useState<Record<string, Habit[]>>({});

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('habitsByDate') : null;
      const parsed = raw ? JSON.parse(raw) : {};
      setByDate(parsed);
    } catch (e) {
      setByDate({});
    }
  }, []);

  useEffect(() => {
    const variants = isoToKeyVariants(dateIso);
    const list = (byDate[variants[0]] || byDate[variants[1]] || []) as Habit[];
    setHabits(list);
  }, [dateIso, byDate]);

  function persist(next: Record<string, Habit[]>) {
    try {
      if (typeof window !== 'undefined') localStorage.setItem('habitsByDate', JSON.stringify(next));
      setByDate(next);
    } catch (e) {
      // ignore
    }
  }

  function toggle(id: number) {
    const variants = isoToKeyVariants(dateIso);
    const key = variants[0] in byDate ? variants[0] : variants[1];
    const next = { ...byDate, [key]: (byDate[key] || []).map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)) };
    persist(next);
  }

  // small helper to compute completion percent for a given date key
  function completionForKey(key: string) {
    const items = (byDate[key] || []) as Habit[];
    if (!items.length) return 0;
    return Math.round((items.filter((h) => h.completed).length / items.length) * 100);
  }

  // build last 14 days small heatmap data
  function lastNDates(n: number) {
    const res: { key: string; iso: string }[] = [];
    const base = new Date(dateIso + "T00:00:00Z");
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(base.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const [y, m, day] = iso.split('-').map(s => parseInt(s, 10));
      const key = `${y}-${m}-${day}`;
      res.push({ key, iso });
    }
    return res;
  }

  const recent = lastNDates(14);

  if (!habits.length) {
    return (
      <div className="col-span-12 lg:col-span-9">
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-700 text-zinc-100">
            <div className="text-sm text-zinc-400">No tasks for {dateIso}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-12 lg:col-span-9">
      <div className="grid grid-cols-3 gap-6">
        {habits.map((h) => (
          <div key={h.id} className="bg-white/3 rounded-2xl p-5 border border-zinc-700 text-zinc-100">
            <div className="flex items-start justify-between">
              <div className="font-semibold">{h.title}</div>
              <div className="text-xs text-zinc-400">{h.completed ? 'Done' : 'Open'}</div>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <button onClick={() => toggle(h.id)} className={`h-8 w-8 rounded-full ${h.completed ? 'bg-green-500' : 'bg-transparent border border-zinc-600'}`}></button>

              <div className="flex-1">
                <div className="text-xs text-zinc-400">Progress</div>
                <div className="w-full bg-zinc-800 rounded-full h-2 mt-2 overflow-hidden">
                  <div style={{ width: h.completed ? '100%' : '0%' }} className="h-2 bg-teal-400" />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-zinc-400 mb-2">Recent</div>
              <div className="flex gap-1">
                {recent.map((r) => {
                  const pct = completionForKey(r.key);
                  const bg = pct === 100 ? 'bg-orange-500' : pct >= 50 ? 'bg-orange-400' : pct > 0 ? 'bg-zinc-700' : 'bg-transparent border border-zinc-700';
                  return <div key={r.iso} className={`h-3 w-3 rounded-sm ${bg}`} title={`${r.iso}: ${pct}%`} />;
                })}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button className="text-sm text-zinc-400">View details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
