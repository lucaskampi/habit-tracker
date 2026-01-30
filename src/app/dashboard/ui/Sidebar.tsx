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
    <aside className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl font-semibold leading-tight">
            Happy<br />{now.toLocaleDateString(undefined, { weekday: "long" })}
          </div>
          <div className="text-sm text-slate-500 mt-2">
            {now.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}
          </div>
        </div>
        <div className="h-10 w-10 rounded-full bg-slate-200" />
      </div>

      <button className="mt-5 w-full h-11 rounded-xl bg-orange-500 text-white font-medium shadow-sm">
        + New Habits
      </button>

      <button className="mt-3 w-full h-11 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium">
        Browse Popular Habits
      </button>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">
            {now.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          </div>
          <div className="flex items-center gap-2">
            <button className="h-8 w-8 rounded-full border border-slate-200">‹</button>
            <button className="h-8 w-8 rounded-full border border-slate-200">›</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => (
            <div
              key={d}
              className="h-9 w-9 rounded-full border border-slate-200 text-sm flex items-center justify-center text-slate-700"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="mt-5 text-sm text-emerald-600 font-medium">+3.2% from last month</div>
      </div>
    </aside>
  );
}
