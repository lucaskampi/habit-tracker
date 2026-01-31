"use client";

import React from "react";

// Analytics placeholder: shows failing habits, activity by weekday, and correlations.
// Intended to be replaced/expanded with AI-driven insights later.
export default function IntegrationsCard() {
  return (
    <div className="bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-600 text-zinc-100">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-base font-semibold">Analytics</div>
          <div className="mt-2 text-sm text-zinc-300">Patterns & insights for habits (placeholder)</div>
        </div>
        <div className="h-10 w-10 rounded-xl bg-orange-200 flex items-center justify-center text-zinc-900 font-semibold">AI</div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <div className="rounded-lg p-3 bg-zinc-800 border border-zinc-700">
          <div className="text-xs text-zinc-400">Top failing habits</div>
          <ul className="mt-2 text-sm text-zinc-100 space-y-1">
            <li>• "Skip workout" — missed 8 times this month</li>
            <li>• "Read" — missed 5 times, mostly weekends</li>
            <li>• "Drink water" — inconsistent in afternoons</li>
          </ul>
        </div>

        <div className="rounded-lg p-3 bg-zinc-800 border border-zinc-700">
          <div className="flex items-center justify-between">
            <div className="text-xs text-zinc-400">Activity by weekday</div>
            <div className="text-xs text-zinc-500">View</div>
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={`${d}-${i}`} className="h-6 rounded bg-zinc-700 flex items-center justify-center text-xs text-zinc-300">{d}</div>
            ))}
          </div>
        </div>

        <div className="rounded-lg p-3 bg-zinc-800 border border-zinc-700">
          <div className="text-xs text-zinc-400">Correlations</div>
          <div className="mt-2 text-sm text-zinc-100">
            - Higher failure rate on weekends. <br />
            - Afternoon slump correlates with lower completion for hydration goals.
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-zinc-400">Insights are placeholders — AI integration planned.</div>
        <button className="text-xs bg-orange-600 px-3 py-1 rounded-md text-white">Run analysis</button>
      </div>
    </div>
  );
}
