"use client";

import React, { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DailyTasks from "./components/DailyTasks";
import type { Heatmap as HeatmapMap } from "../lib/api";
import { getHeatmap } from "../lib/api";

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

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<string>(isoDate(new Date()));
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
      <Header onDateSelect={(iso) => setSelectedDate(iso)} onNewHabit={() => {
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('openNewHabits'));
      }} />
      <div className="mx-auto max-w-6xl grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <Sidebar />
        </div>

        <div className="col-span-12 lg:col-span-6">
          <DailyTasks dateIso={selectedDate} />
        </div>
      </div>
    </div>
  );
}


