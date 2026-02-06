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
    <div className="bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-600 text-zinc-100">
      <div className="text-sm text-zinc-300">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {caption && <div className="mt-1 text-xs text-zinc-300">{caption}</div>}
    </div>
  );
}
