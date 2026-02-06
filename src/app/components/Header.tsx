"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

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
  const [dropdownPos, setDropdownPos] = useState<{ left: number; top: number } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

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

  const monthLabel = new Date(viewYear, viewMonth0, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

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

  // compute dropdown position when opening, update on scroll/resize
  useEffect(() => {
    if (!open) { setDropdownPos(null); return; }
    function updatePos() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const left = rect.left + rect.width / 2 - 160 + window.scrollX;
      const top = rect.bottom + 8 + window.scrollY;
      setDropdownPos({ left, top });
    }
    updatePos();
    window.addEventListener('resize', updatePos);
    window.addEventListener('scroll', updatePos, { passive: true });
    return () => {
      window.removeEventListener('resize', updatePos);
      window.removeEventListener('scroll', updatePos);
    };
  }, [open]);

  // close profile dropdown on outside click / Escape
  useEffect(() => {
    if (!profileOpen) return;
    function handleOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [profileOpen]);

  return (
    <header className="relative mx-auto max-w-6xl">
      <div className="px-6 py-3 bg-zinc-800/40 backdrop-blur-lg border border-zinc-700/40 rounded-3xl shadow-md">
        <div className="relative flex items-center">
          {/* Left section */}
          <div className="flex items-center gap-4 z-10">
            <div className="text-lg font-semibold text-zinc-100">SOEZ Habits</div>
            <button
              onClick={onNewHabit}
              className="h-8 px-3 rounded-lg bg-orange-500 text-white font-medium hover:brightness-95"
            >
              New Habit
            </button>
          </div>

          {/* Center section - absolutely positioned */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="relative flex items-center justify-center pointer-events-auto" ref={containerRef}>
              <div className="flex items-center gap-2">
                {/* left icons */}
                <button className="p-2 rounded-md hover:bg-zinc-800/50 text-zinc-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 1.293a1 1 0 00-1.414 0L2 8.586V18a1 1 0 001 1h5v-5h4v5h5a1 1 0 001-1V8.586l-7.293-7.293z" /></svg>
                </button>
                <button className="p-2 rounded-md hover:bg-zinc-800/50 text-zinc-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V5a1 1 0 10-2 0v3a1 1 0 00.293.707l2 2a1 1 0 101.414-1.414L11 7z" clipRule="evenodd" /></svg>
                </button>

                {/* date button center */}
                <button
                  onClick={() => setOpen((s) => !s)}
                  className="px-3 py-1.5 rounded-md hover:bg-zinc-800 text-zinc-100 whitespace-nowrap"
                >
                  <div className="text-sm font-medium" suppressHydrationWarning>
                    {now.toLocaleDateString('en-US', { weekday: "long" })}
                  </div>
                  <div className="text-xs text-zinc-400" suppressHydrationWarning>
                    {now.toLocaleDateString('en-US', { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                </button>

                {/* right icons */}
                <button className="p-2 rounded-md hover:bg-zinc-800/50 text-zinc-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 6h14v2H3V6zM3 11h14v2H3v-2zM3 16h14v2H3v-2z" />
                  </svg>
                </button>
                <button className="p-2 rounded-md hover:bg-zinc-800/50 text-zinc-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"/><path d="M9 18a2 2 0 104 0H9z"/></svg>
                </button>
              </div>

              {open && typeof document !== 'undefined' && dropdownPos && createPortal(
                <div
                  style={{ left: dropdownPos.left, top: dropdownPos.top, width: 320 }}
                  className="absolute bg-zinc-900 rounded-2xl p-4 border border-zinc-700 shadow-lg z-[9999]"
                >
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
                </div>,
                document.body
              )}
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3 ml-auto z-10">
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((s) => !s)}
                className="h-10 w-10 rounded-full overflow-hidden border border-zinc-700 bg-transparent flex items-center justify-center"
                aria-haspopup="true"
                aria-expanded={profileOpen}
              >
                <img
                  src="https://github.com/lucaskampi.png"
                  alt="GitHub avatar"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-zinc-900 rounded-xl p-3 border border-zinc-700 shadow-lg z-50">
                  <div className="text-sm font-medium text-zinc-100">Hello, Kampi</div>
                  <div className="text-xs text-zinc-400 mt-1">mock@mail.com</div>
                  <div className="mt-3 border-t border-zinc-700/50 pt-3">
                    <button
                      onClick={() => { setProfileOpen(false); console.log('mock logout'); }}
                      className="w-full text-left px-3 py-2 rounded-md bg-orange-600 hover:bg-orange-500 text-white font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
