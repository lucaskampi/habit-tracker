import React from "react";

type TodoItem = {
  id: string;
  title: string;
  meta?: string;
  done?: boolean;
};

export default function TodoCard({
  title,
  items,
}: {
  title: string;
  items: TodoItem[];
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{title}</h3>
        <a className="text-xs text-slate-500">View Details</a>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((t) => (
          <label
            key={t.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-3"
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                defaultChecked={t.done}
                className="mt-1 h-4 w-4 accent-emerald-600"
              />
              <div>
                <div className={`font-medium ${t.done ? "line-through text-slate-400" : ""}`}>{t.title}</div>
                {t.meta && <div className="text-xs text-slate-500 mt-1">{t.meta}</div>}
              </div>
            </div>
            <div className="text-slate-400">⋯</div>
          </label>
        ))}
      </div>
    </div>
  );
}
