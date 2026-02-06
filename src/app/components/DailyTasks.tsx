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

  // Ensure there's a preset task for "today" whenever the user opens the app
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const todayIso = new Date().toISOString().slice(0, 10);
      // Only add when viewing today's date
      if (dateIso !== todayIso) return;

      const variants = isoToKeyVariants(todayIso);
      const existing = (byDate[variants[0]] || byDate[variants[1]] || []);
      if (existing.length > 0) return; // already has tasks for today

      const defaultHabit: Habit = { id: Date.now(), title: "Today's Task", completed: false };
      const key = variants[0];
      const next = { ...byDate, [key]: [...(byDate[key] || []), defaultHabit] };
      persist(next);
    } catch (e) {
      // ignore
    }
  }, [byDate, dateIso]);

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
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-700 text-zinc-100 h-60 flex items-center">
            <div className="text-sm text-zinc-400">No tasks for {dateIso}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => {
          const h = habits[idx];
          if (h) {
            return (
              <div key={h.id} className="bg-white/3 rounded-2xl p-6 border border-zinc-700 text-zinc-100 h-60 flex flex-col justify-between">
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
            );
          }

          return (
            <div key={`ph-${idx}`} className="bg-zinc-900 rounded-2xl p-6 border border-zinc-700 text-zinc-100 h-60 flex flex-col justify-between opacity-60">
              <div className="flex items-start justify-between">
                <div className="font-semibold">Placeholder</div>
                <div className="text-xs text-zinc-400">--</div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full border border-zinc-600 bg-transparent" />
                <div className="flex-1">
                  <div className="text-xs text-zinc-400">Progress</div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 mt-2 overflow-hidden">
                    <div style={{ width: '0%' }} className="h-2 bg-teal-400" />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-zinc-400 mb-2">Recent</div>
                <div className="flex gap-1">
                  {Array.from({ length: 14 }).map((__, j) => (
                    <div key={j} className={`h-3 w-3 rounded-sm bg-transparent border border-zinc-700`} />
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button className="text-sm text-zinc-400">View details</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
