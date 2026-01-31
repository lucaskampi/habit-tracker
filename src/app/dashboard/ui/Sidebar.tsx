"use client";

import React from "react";

function daysInMonth(year: number, month0: number) {
  return new Date(year, month0 + 1, 0).getDate();
}

// Mock function to get completion percentage for a day
// TODO: Replace with actual API call
function getDayCompletion(day: number): number {
  // Mock data - some days with different completion levels
  const mockData: Record<number, number> = {
    1: 100, 2: 100, 5: 100, 8: 100, 9: 100, 10: 100, 13: 100, 
    16: 100, 17: 100, 20: 100, 22: 100, 28: 100, 30: 100,
    // Partial completion examples
    11: 25, 21: 60
  };
  return mockData[day] || 0;
}

export default function Sidebar() {
  const now = new Date();
  const year = now.getFullYear();
  const month0 = now.getMonth();
  const days = Array.from({ length: daysInMonth(year, month0) }, (_, i) => i + 1);
  const firstWeekday = new Date(year, month0, 1).getDay(); // 0..6 (Sun..Sat)
  const leadingEmpty = (firstWeekday + 6) % 7; // convert to Monday=0
  const blanks = Array.from({ length: leadingEmpty });

  return (
    <aside className="bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-600 text-zinc-100">
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
        <div className="h-10 w-10 rounded-full bg-zinc-700" />
      </div>

      <button className="mt-5 w-full h-11 rounded-xl bg-orange-500 text-white font-medium shadow-sm">
        + New Habits
      </button>

      <button className="mt-3 w-full h-11 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 font-medium">
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
            <button className="h-8 w-8 rounded-full border border-zinc-700">‹</button>
            <button className="h-8 w-8 rounded-full border border-zinc-700">›</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3">
          {blanks.map((_, i) => (
            <div
              key={`blank-${i}`}
              className="aspect-square rounded-full border border-transparent bg-transparent"
            />
          ))}

          {days.map((d) => {
            const completion = getDayCompletion(d);
            const isToday = d === now.getDate();
            const isComplete = completion === 100;
            
            return (
              <div
                key={`day-${d}`}
                className="aspect-square rounded-full text-sm flex items-center justify-center text-zinc-100 relative"
                style={{
                  background: isComplete 
                    ? '#f97316'
                    : completion > 0
                    ? `conic-gradient(#f97316 0deg, #f97316 ${completion * 3.6}deg, #3f3f46 ${completion * 3.6}deg, #3f3f46 360deg)`
                    : '#3f3f46',
                }}
              >
                {!isComplete && (
                  <div className="absolute inset-[2px] rounded-full bg-zinc-900 flex items-center justify-center">
                    <span className={`${isToday ? 'font-bold' : ''}`}>
                      {d}
                    </span>
                  </div>
                )}
                {isComplete && (
                  <span className={`relative z-10 ${isToday ? 'font-bold' : ''}`}>
                    {d}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 text-sm text-orange-500 font-medium">+3.2% from last month</div>
      </div>
    </aside>
  );
}
