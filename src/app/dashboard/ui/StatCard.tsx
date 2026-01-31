"use client";

import React from "react";

export default function StatCard({
  title,
  value,
  caption,
}: {
  title: string;
  value: string;
  caption?: string;
}) {
  return (
    <div className="bg-zinc-400 rounded-2xl p-5 shadow-sm border border-zinc-300 text-zinc-900">
      <div className="text-sm text-zinc-700">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {caption && <div className="mt-1 text-xs text-zinc-700">{caption}</div>}
    </div>
  );
}
