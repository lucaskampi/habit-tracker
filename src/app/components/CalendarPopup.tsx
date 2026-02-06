"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";

type Habit = { id: number; title: string; completed: boolean };

type Props = {
  year: number;
  month0: number;
  day: number;
  habits: Habit[];
  onClose: () => void;
  onAdd: (title: string) => void;
  onToggle: (id: number) => void;
  onEdit: (id: number, title: string) => void;
  onDelete: (id: number) => void;
};

export default function CalendarPopup({ year, month0, day, habits, onClose, onAdd, onToggle, onEdit, onDelete }: Props) {
  const [newTitle, setNewTitle] = useState("");

  const label = new Date(year, month0, day).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-zinc-900 rounded-2xl p-4 w-[340px] border border-zinc-700" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Habits — {label}</div>
          <button onClick={onClose} className="text-zinc-400">✕</button>
        </div>

        <div className="max-h-44 overflow-y-auto mb-3">
          {habits.map((h) => (
            <div key={h.id} className="flex items-center justify-between gap-2 mb-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={h.completed} onChange={() => onToggle(h.id)} className="accent-orange-500" />
                <span className={`${h.completed ? 'line-through text-zinc-400' : ''}`}>{h.title}</span>
              </label>
              <div className="flex items-center gap-2">
                <button onClick={() => { const t = prompt('Edit habit', h.title); if (t) onEdit(h.id, t); }} className="text-zinc-300">Edit</button>
                <button onClick={() => onDelete(h.id)} className="text-red-400">Del</button>
              </div>
            </div>
          ))}
          {habits.length === 0 && (
            <div className="text-sm text-zinc-400">No habits yet for this day.</div>
          )}
        </div>

        <div className="flex gap-2">
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="New habit" className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm" />
          <button onClick={() => { if (newTitle.trim()) { onAdd(newTitle.trim()); setNewTitle(''); } }} className="rounded bg-orange-500 px-3 text-white">Add</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
