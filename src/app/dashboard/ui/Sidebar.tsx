"use client";

import React from "react";

function daysInMonth(year: number, month0: number) {
  return new Date(year, month0 + 1, 0).getDate();
}

export default function Sidebar() {
  const now = new Date();
  const year = now.getFullYear();
  const month0 = now.getMonth();
  const days = Array.from({ length: daysInMonth(year, month0) }, (_, i) => i + 1);

  return (
    <aside className="bg-zinc-400 rounded-2xl p-5 shadow-sm border border-zinc-300 text-zinc-900">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl font-semibold leading-tight">
            Happy<br />
            <span suppressHydrationWarning>
              {now.toLocaleDateString(undefined, { weekday: "long" })}
            </span>
          </div>
          <div className="text-sm text-gray-400 mt-2">
            <span suppressHydrationWarning>
              {now.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>
        <div className="h-10 w-10 rounded-full bg-zinc-300" />
      </div>

      <button className="mt-5 w-full h-11 rounded-xl bg-orange-500 text-white font-medium shadow-sm">
        + New Habits
      </button>

      <button className="mt-3 w-full h-11 rounded-xl bg-zinc-300 border border-zinc-300 text-zinc-900 font-medium">
        Browse Popular Habits
      </button>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">
            <span suppressHydrationWarning>
              {now.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-8 w-8 rounded-full border border-zinc-300">‹</button>
            <button className="h-8 w-8 rounded-full border border-zinc-300">›</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => (
            <div
              key={d}
              className="h-9 w-9 rounded-full border border-zinc-300 text-sm flex items-center justify-center text-zinc-900 bg-zinc-400"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="mt-5 text-sm text-orange-600 font-medium">+3.2% from last month</div>
      </div>
    </aside>
  );
}
