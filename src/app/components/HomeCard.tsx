"use client";

import React from "react";

export default function HomeCard() {
  return (
    <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-lg rounded-3xl p-8 border border-zinc-700/40 shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left section - Main stats */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-full bg-zinc-700/50 overflow-hidden">
              <img
                src="https://github.com/lucaskampi.png"
                alt="GitHub avatar"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <div className="text-sm text-zinc-400">This Month</div>
              <div className="text-3xl font-bold text-zinc-100">121,491.01</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <div className="text-xs text-zinc-400">Completed Sales</div>
              <div className="text-lg font-semibold text-zinc-100">10</div>
            </div>
            <div>
              <div className="text-xs text-zinc-400">Averaging</div>
              <div className="text-lg font-semibold text-zinc-100">$6,122.21</div>
            </div>
          </div>
        </div>

        {/* Center section - Activity breakdown */}
        <div className="lg:col-span-1 border-l border-r border-zinc-700/40 px-8">
          <div className="text-sm text-zinc-400 mb-4">Activity Breakdown</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-300">Average</span>
              <span className="text-sm font-medium text-zinc-100">01:46</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-300">Worst</span>
              <span className="text-sm font-medium text-zinc-100">31:23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-300">Purchases</span>
              <span className="text-sm font-medium text-zinc-100">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-300">Time Saved</span>
              <span className="text-sm font-medium text-zinc-100">04:23:09</span>
            </div>
          </div>
        </div>

        {/* Right section - Challenge stats */}
        <div className="lg:col-span-1 flex items-center justify-center">
          <div className="relative">
            <svg className="transform -rotate-90" width="120" height="120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#374151"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#f97316"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(52 / 60) * 314} 314`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-xs text-zinc-400 uppercase tracking-wide">Challenge</div>
              <div className="text-3xl font-bold text-zinc-100">52</div>
            </div>
          </div>
          <div className="ml-6">
            <div className="text-xs text-zinc-400 mb-2">Your 60 Second Challenge Stars</div>
            <div className="space-y-1 text-sm text-zinc-300">
              <div>Average: <span className="text-zinc-100 font-medium">01:46</span></div>
              <div>Worst: <span className="text-zinc-100 font-medium">31:23</span></div>
              <div>Purchases: <span className="text-zinc-100 font-medium">23</span></div>
              <div>Time Saved: <span className="text-zinc-100 font-medium">04:23:09</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
