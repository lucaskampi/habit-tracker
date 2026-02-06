"use client";

import React, { useEffect, useState, useRef } from "react";

type Props = {
  onNewHabit?: () => void;
  onDateSelect?: (isoDate: string) => void;
};

type Habit = { id: number; title: string; completed: boolean };

export default function Header({ onNewHabit, onDateSelect }: Props) {
  const now = new Date();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth0, setViewMonth0] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const dateKey = (year: number, month0: number, d: number) => `${year}-${month0 + 1}-${d}`;

  const [habitsByDate, setHabitsByDate] = useState<Record<string, Habit[]>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('habitsByDate') : null;
      const parsed = raw ? JSON.parse(raw) : {};
      setHabitsByDate(parsed);
    } catch (e) {
      setHabitsByDate({});
    }
  }, []);

  function refreshFromStorage() {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('habitsByDate') : null;
      const parsed = raw ? JSON.parse(raw) : {};
      setHabitsByDate(parsed);
    } catch (e) {
      // ignore
    }
  }

  function daysInMonth(year: number, month0: number) {
    return new Date(year, month0 + 1, 0).getDate();
  }

  // fallback mock completion data for days without habits
  function mockCompletion(day: number): number {
    const mockData: Record<number, number> = { 1: 100, 2: 100, 5: 100, 8: 100, 9: 100, 10: 100, 13: 100, 16: 100, 17: 100, 20: 100, 22: 100, 28: 100, 30: 100, 11: 25, 21: 60 };
    return mockData[day] || 0;
  }

  const monthLabel = new Date(viewYear, viewMonth0, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const firstWeekday = new Date(viewYear, viewMonth0, 1).getDay(); // 0..6 Sun..Sat
  const leadingEmpty = (firstWeekday + 6) % 7; // Monday=0
  const blanks = Array.from({ length: leadingEmpty });
  const days = Array.from({ length: daysInMonth(viewYear, viewMonth0) }, (_, i) => i + 1);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <header className="relative flex items-center justify-between px-6 py-3 bg-transparent">
      <div className="flex items-center gap-4" />

      <div className="flex-1 flex items-center justify-center">
        <div className="relative" ref={containerRef}>
          <button
            onClick={() => setOpen((s) => !s)}
            className="px-4 py-2 rounded-md hover:bg-zinc-800 text-zinc-100"
          >
            <div className="text-sm font-medium" suppressHydrationWarning>
              {now.toLocaleDateString(undefined, { weekday: "long" })}
            </div>
            <div className="text-xs text-zinc-400" suppressHydrationWarning>
              {now.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}
            </div>
          </button>

          {open && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-3 bg-zinc-900 rounded-2xl p-4 border border-zinc-700 shadow-lg z-50 w-[320px]">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-sm">{monthLabel}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (viewMonth0 === 0) { setViewMonth0(11); setViewYear((y) => y - 1); } else setViewMonth0((m) => m - 1);
                    }}
                    className="h-8 w-8 rounded-full border border-zinc-700"
                  >‹</button>
                  <button
                    onClick={() => {
                      if (viewMonth0 === 11) { setViewMonth0(0); setViewYear((y) => y + 1); } else setViewMonth0((m) => m + 1);
                    }}
                    className="h-8 w-8 rounded-full border border-zinc-700"
                  >›</button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {blanks.map((_, i) => (
                  <div key={`b-${i}`} className="aspect-square rounded-full" />
                ))}

                {days.map((d) => {
                  const key = dateKey(viewYear, viewMonth0, d);
                  const items = (habitsByDate[key] || []) as Habit[];
                  const computed = mounted
                    ? items.length > 0
                      ? Math.round((items.filter((h) => h.completed).length / items.length) * 100)
                      : mockCompletion(d)
                    : 0;
                  const isComplete = computed === 100;
                  const isToday = d === now.getDate() && viewMonth0 === now.getMonth() && viewYear === now.getFullYear();
                  const isSelected = selectedDay === d && viewMonth0 === now.getMonth() && viewYear === now.getFullYear();

                  return (
                    <button
                      key={`hd-${d}`}
                      type="button"
                      onClick={() => {
                        setSelectedDay(d);
                        const iso = new Date(viewYear, viewMonth0, d).toISOString().slice(0, 10);
                        if (onDateSelect) onDateSelect(iso);
                        setOpen(false);
                      }}
                      className="aspect-square rounded-full text-sm flex items-center justify-center text-zinc-100 relative cursor-pointer"
                    >
                      {isComplete ? (
                        <div className={`absolute inset-0 rounded-full bg-orange-500 flex items-center justify-center ${isSelected ? 'ring-2 ring-white' : ''}`}>
                          <span className={`${isToday ? 'font-bold' : ''}`}>{d}</span>
                        </div>
                      ) : computed > 0 ? (
                        <div
                          className={`absolute inset-0 rounded-full flex items-center justify-center ${isSelected ? 'ring-2 ring-white' : ''}`}
                          style={{ background: `conic-gradient(#f97316 0deg, #f97316 ${computed * 3.6}deg, #374151 ${computed * 3.6}deg)` }}
                        >
                          <div className="m-[4px] rounded-full bg-zinc-900 w-[calc(100%-8px)] h-[calc(100%-8px)] flex items-center justify-center">
                            <span className={`${isToday ? 'font-bold' : ''}`}>{d}</span>
                          </div>
                        </div>
                      ) : (
                        <div className={`absolute inset-0 rounded-full border-2 border-zinc-700 bg-transparent flex items-center justify-center ${isSelected ? 'ring-2 ring-white' : ''}`}>
                          <span className={`${isToday ? 'font-bold' : ''}`}>{d}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onNewHabit}
          className="h-9 px-4 rounded-lg bg-teal-400 text-black font-medium hover:brightness-95"
        >
          New Habit
        </button>
      </div>
    </header>
  );
}
