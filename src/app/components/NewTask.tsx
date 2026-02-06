"use client";

import React, { useEffect, useState } from "react";

export type RecurringHabit = {
  id: number;
  title: string;
  recurringDays: number[]; // 0 = Monday .. 6 = Sunday
  createdAt: string;
};

type Props = {
  onAdd?: (h: RecurringHabit) => void;
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function loadHabits(): RecurringHabit[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("globalHabits");
    console.log('loadHabits raw:', raw);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('loadHabits error', e);
    return [];
  }
}

function saveHabits(habits: RecurringHabit[]) {
  try {
    if (typeof window === "undefined") return;
    console.log('saveHabits saving:', habits);
    localStorage.setItem("globalHabits", JSON.stringify(habits));
  } catch (e) {
    console.error('saveHabits error', e);
    // ignore
  }
}

export default function NewTask({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [habits, setHabits] = useState<RecurringHabit[]>(() => loadHabits());

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  function toggleDay(idx: number) {
    setSelectedDays((s) => {
      if (s.includes(idx)) return s.filter((d) => d !== idx);
      return [...s, idx].sort((a, b) => a - b);
    });
  }

  function handleAdd() {
    const trimmed = title.trim();
    if (!trimmed) return;

    const recurringDays = selectedDays.slice();
    const habit: RecurringHabit = {
      id: Date.now(),
      title: trimmed,
      recurringDays,
      createdAt: new Date().toISOString(),
    };

    const next = [...habits, habit];
    setHabits(next);
    saveHabits(next);
    console.log('handleAdd created habit', habit);
    if (onAdd) onAdd(habit);

    setTitle("");
    setSelectedDays([]);
  }

  const allSelected = selectedDays.length === 7;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-100">New Task</label>
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Drink water"
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-100"
        />
        <button onClick={handleAdd} className="rounded bg-orange-500 px-4 text-white">Add</button>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-zinc-200">Repeat</div>
        <div className="flex gap-1 bg-zinc-800 p-1 rounded">
          {WEEKDAYS.map((d, i) => {
            const active = selectedDays.includes(i);
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDay(i)}
                className={`w-8 h-8 rounded ${active ? 'bg-orange-500 text-white' : 'bg-zinc-700 text-zinc-300'}`}
                title={d}
              >
                <span className="text-xs">{d}</span>
              </button>
            );
          })}
        </div>
        {allSelected && <div className="text-sm text-zinc-300">Daily</div>}
      </div>

      <div className="pt-2 border-t border-zinc-800">
        <div className="text-sm text-zinc-300 mb-2">Existing tasks</div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {habits.map((h) => (
            <div key={h.id} className="flex items-center justify-between gap-2">
              <div>
                <div className="text-sm text-zinc-100">{h.title}</div>
                <div className="text-xs text-zinc-400">{h.recurringDays.length ? `Repeats ${h.recurringDays.length === 7 ? 'daily' : h.recurringDays.map((d) => WEEKDAYS[d]).join(', ')}` : 'One-time'}</div>
              </div>
              <div className="text-xs text-zinc-400">{new Date(h.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
          {habits.length === 0 && <div className="text-sm text-zinc-400">No tasks yet</div>}
        </div>
      </div>
    </div>
  );
}
