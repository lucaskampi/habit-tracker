"use client";

import React from "react";

export default function IntegrationsCard() {
  return (
    <div className="bg-zinc-400 rounded-2xl p-5 shadow-sm border border-zinc-300 text-zinc-900">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-base font-semibold">Connect your Spotify account</div>
          <div className="mt-2 text-sm text-zinc-700">
            Keep habit tracking going while you enjoy music.
          </div>
          <button className="mt-4 h-10 px-4 rounded-xl bg-orange-600 text-white text-sm font-medium">
            Link Account
          </button>
        </div>
        <div className="h-10 w-10 rounded-xl bg-orange-200" />
      </div>
      <div className="mt-5 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 p-4">
        <div className="text-sm font-semibold">More Integrations</div>
        <div className="text-xs text-zinc-900 mt-1">23+ apps</div>
      </div>
    </div>
  );
}
