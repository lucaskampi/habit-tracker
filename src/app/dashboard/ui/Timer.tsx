"use client";

import React, { useEffect, useRef, useState } from "react";
import Pomodoro from "./Pomodoro";

export default function Timer() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

  function toggle() {
    setRunning((r) => !r);
  }

  function reset() {
    setRunning(false);
    setSeconds(0);
  }

  function format(s: number) {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${mm}:${ss}`;
  }

  const [mode, setMode] = useState<"timer" | "pomodoro">("timer");

  return (
    <div className="rounded-2xl bg-gradient-to-br from-orange-700 to-orange-500 p-5 shadow-sm border border-orange-600 text-white w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="inline-flex bg-white/10 rounded-full p-1">
            <button
              onClick={() => setMode("timer")}
              className={`px-3 py-1 rounded-full text-sm ${mode === "timer" ? "bg-white/20" : "text-orange-200"}`}
            >
              Timer
            </button>
            <button
              onClick={() => setMode("pomodoro")}
              className={`px-3 py-1 rounded-full text-sm ${mode === "pomodoro" ? "bg-white/20" : "text-orange-200"}`}
            >
              Pomodoro
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {mode === "timer" ? (
          <div className="mt-6 flex items-end justify-between">
            <div>
              <div className="text-4xl font-semibold">{format(seconds)}</div>
              <div className="text-xs text-orange-200 mt-1">{running ? "Running" : "Paused"}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="h-24 w-24 rounded-2xl bg-white/10 flex items-center justify-center">
                <button
                  onClick={toggle}
                  className="h-10 px-3 rounded-full bg-white/20 text-white text-sm font-medium"
                >
                  {running ? "Stop" : "Start"}
                </button>
              </div>
              <button onClick={reset} className="mt-2 text-xs text-orange-100 underline">
                Reset
              </button>
            </div>
          </div>
        ) : (
          <Pomodoro />
        )}
      </div>
    </div>
  );
}
