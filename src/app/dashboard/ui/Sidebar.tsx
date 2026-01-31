"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CalendarPopup from "./CalendarPopup";
import NewHabits from "./NewHabits";

function daysInMonth(year: number, month0: number) {
  return new Date(year, month0 + 1, 0).getDate();
}

// Mock function to get completion percentage for a day
// TODO: Replace with actual API call
function getDayCompletion(day: number): number {
  // Mock fallback data for days that don't yet have stored habits
  const mockData: Record<number, number> = {
    1: 100, 2: 100, 5: 100, 8: 100, 9: 100, 10: 100, 13: 100,
    16: 100, 17: 100, 20: 100, 22: 100, 28: 100, 30: 100,
    11: 25, 21: 60
  };
  return mockData[day] || 0;
}

type Habit = { id: number; title: string; completed: boolean };

export default function Sidebar() {
  const now = new Date();
  const year = now.getFullYear();
  const month0 = now.getMonth();
  const days = Array.from({ length: daysInMonth(year, month0) }, (_, i) => i + 1);
  const firstWeekday = new Date(year, month0, 1).getDay(); // 0..6 (Sun..Sat)
  const leadingEmpty = (firstWeekday + 6) % 7; // convert to Monday=0
  const blanks = Array.from({ length: leadingEmpty });

  // UI state for date modal and stored habits
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [newHabitsOpen, setNewHabitsOpen] = useState(false);
  const [habitsByDate, setHabitsByDate] = useState<Record<string, Habit[]>>(() => {
    try {
      if (typeof window === "undefined") return {};
      const raw = localStorage.getItem("habitsByDate");
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("habitsByDate", JSON.stringify(habitsByDate));
    } catch (e) {
      // ignore
    }
  }, [habitsByDate]);

  const dateKey = (d: number) => `${year}-${month0 + 1}-${d}`;

  function openDateModal(d: number) {
    console.log('openDateModal', d);
    setSelectedDate(d);
  }

  function openNewHabits() {
    setNewHabitsOpen(true);
  }

  function closeNewHabits() {
    setNewHabitsOpen(false);
  }

  function closeDateModal() {
    setSelectedDate(null);
  }

  function addHabitForSelected(title: string) {
    if (!selectedDate) return;
    const key = dateKey(selectedDate);
    const next: Habit = { id: Date.now(), title, completed: false };
    setHabitsByDate((s) => ({ ...s, [key]: [...(s[key] || []), next] }));
  }

  function toggleHabitCompleted(d: number, id: number) {
    const key = dateKey(d);
    setHabitsByDate((s) => ({
      ...s,
      [key]: (s[key] || []).map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)),
    }));
  }

  function deleteHabit(d: number, id: number) {
    const key = dateKey(d);
    setHabitsByDate((s) => ({ ...s, [key]: (s[key] || []).filter((h) => h.id !== id) }));
  }

  function editHabit(d: number, id: number, title: string) {
    const key = dateKey(d);
    setHabitsByDate((s) => ({
      ...s,
      [key]: (s[key] || []).map((h) => (h.id === id ? { ...h, title } : h)),
    }));
  }

  const [newHabitTitle, setNewHabitTitle] = useState("");

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

      <button onClick={openNewHabits} className="mt-5 w-full h-11 rounded-xl bg-orange-500 text-white font-medium shadow-sm">
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
            const key = dateKey(d);
            const items = (habitsByDate[key] || []) as Habit[];
            const computedCompletion = items.length > 0
              ? Math.round((items.filter((h) => h.completed).length / items.length) * 100)
              : getDayCompletion(d);
            const isComplete = computedCompletion === 100;
            const isToday = d === now.getDate();

            // Clickable day button
            return (
              <button
                key={`day-${d}`}
                type="button"
                onClick={() => openDateModal(d)}
                className="aspect-square rounded-full text-sm flex items-center justify-center text-zinc-100 relative cursor-pointer"
              >
                {/* 100% - solid orange */}
                {isComplete ? (
                  <div className="absolute inset-0 rounded-full bg-orange-500 flex items-center justify-center">
                    <span className={`${isToday ? 'font-bold' : ''}`}>
                      {d}
                    </span>
                  </div>
                ) : computedCompletion > 0 ? (
                  // partial: show ring via conic-gradient on background and inner dark circle
                  <div
                    className="absolute inset-0 rounded-full flex items-center justify-center"
                    style={{
                      background: `conic-gradient(#f97316 0deg, #f97316 ${computedCompletion * 3.6}deg, #374151 ${computedCompletion * 3.6}deg)`,
                    }}
                  >
                    <div className="m-[4px] rounded-full bg-zinc-900 w-[calc(100%-8px)] h-[calc(100%-8px)] flex items-center justify-center">
                      <span className={`${isToday ? 'font-bold' : ''}`}>{d}</span>
                    </div>
                  </div>
                ) : (
                  // 0%: empty circle with border
                  <div className="absolute inset-0 rounded-full border-2 border-zinc-700 bg-transparent flex items-center justify-center">
                    <span className={`${isToday ? 'font-bold' : ''}`}>{d}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {selectedDate !== null && (
          <CalendarPopup
            year={year}
            month0={month0}
            day={selectedDate}
            habits={(habitsByDate[dateKey(selectedDate)] || []) as Habit[]}
            onClose={closeDateModal}
            onAdd={(title) => addHabitForSelected(title)}
            onToggle={(id) => toggleHabitCompleted(selectedDate, id)}
            onEdit={(id, title) => editHabit(selectedDate, id, title)}
            onDelete={(id) => deleteHabit(selectedDate, id)}
          />
        )}

        {newHabitsOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeNewHabits}>
            <div className="bg-zinc-900 rounded-2xl p-4 w-[420px] border border-zinc-700" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">Create Habit</div>
                <button onClick={closeNewHabits} className="text-zinc-400">✕</button>
              </div>
              <NewHabits onAdd={() => { closeNewHabits(); }} />
            </div>
          </div>,
          document.body
        )}

        <div className="mt-5 text-sm text-orange-500 font-medium">+3.2% from last month</div>
      </div>
    </aside>
  );
}
