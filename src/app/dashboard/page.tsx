"use client";

import React, { useEffect, useMemo, useState } from "react";
import Heatmap from "./ui/Heatmap";
import Sidebar from "./ui/Sidebar";
import TodoCard from "./ui/TodoCard";
import StatCard from "./ui/StatCard";
import IntegrationsCard from "./ui/IntegrationsCard";
import type { Heatmap as HeatmapMap } from "../../lib/api";
import { getHeatmap } from "../../lib/api";

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function rangeDays(endInclusive: Date, days: number) {
  const result: string[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(endInclusive);
    d.setDate(endInclusive.getDate() - i);
    result.push(isoDate(d));
  }
  return result;
}

function mockHeatmap(days = 120): HeatmapMap {
  const end = new Date();
  const dates = rangeDays(end, days);
  const map: HeatmapMap = {};
  for (const dt of dates) map[dt] = Math.floor(Math.random() * 4);
  return map;
}

export default function DashboardPage() {
  const userId = "demo-user";
  const [heatmap, setHeatmap] = useState<HeatmapMap | null>(null);

  const end = useMemo(() => isoDate(new Date()), []);
  const start = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return isoDate(d);
  }, []);

  useEffect(() => {
    let mounted = true;
    getHeatmap(userId, start, end)
      .then((data) => {
        if (!mounted) return;
        setHeatmap(Object.keys(data).length ? data : mockHeatmap());
      })
      .catch(() => {
        if (!mounted) return;
        setHeatmap(mockHeatmap());
      });
    return () => {
      mounted = false;
    };
  }, [end, start]);

  return (
    <div className="min-h-screen px-6 py-8 bg-[#050407] text-zinc-100">
      <div className="mx-auto max-w-6xl grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <Sidebar />
        </div>

        <div className="col-span-12 lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-zinc-400">Dashboard</div>
              <h1 className="text-2xl font-semibold">Schedule</h1>
            </div>

            <div className="flex items-center gap-2">
              <button className="h-9 px-3 rounded-full bg-zinc-700 shadow-sm border border-zinc-700 text-sm text-zinc-100">
                Search
              </button>
              <button className="h-9 w-9 rounded-full bg-zinc-700 shadow-sm border border-zinc-700 text-zinc-100" aria-label="Profile" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-gradient-to-br from-orange-700 to-orange-500 p-5 shadow-sm border border-orange-600 text-white">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Weather</div>
                <a className="text-xs text-zinc-400">View details</a>
              </div>
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <div className="text-4xl font-semibold">12°C</div>
                  <div className="text-xs text-zinc-400 mt-1">Wind 2–4 km/h · Humidity 42%</div>
                </div>
                <div className="h-24 w-24 rounded-2xl bg-white/60" />
              </div>
            </div>

            <TodoCard
              title="Today's Todos"
              items={[
                { id: "1", title: "Study", meta: "10:00 am · K-Cafe", done: false },
                { id: "2", title: "Groceries", meta: "02:00 pm · Market", done: false },
                { id: "3", title: "Drink water", meta: "Goal: 10 glasses", done: true },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Streak" value="7 days" caption="keep it alive" />
            <StatCard title="Habits" value="4" caption="active" />
            <StatCard title="Completion" value="58%" caption="last 30 days" />
          </div>

          <div className="bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-600">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Heatmap</h2>
              <div className="text-xs text-zinc-700" suppressHydrationWarning>
                {start} → {end}
              </div>
            </div>
            {heatmap ? <Heatmap data={heatmap} /> : <div className="text-sm text-zinc-700">Loading…</div>}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-6">
          <IntegrationsCard />
          <div className="bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-600 text-zinc-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Trophies</h3>
              <span className="text-xs text-zinc-700">View</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-zinc-600 p-3 bg-zinc-900">
                <div className="text-xs text-zinc-700">7-day streak</div>
                <div className="mt-2 font-semibold">Unlocked</div>
              </div>
              <div className="rounded-xl border border-zinc-600 p-3 bg-zinc-900">
                <div className="text-xs text-zinc-700">15-day streak</div>
                <div className="mt-2 font-semibold">Locked</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


