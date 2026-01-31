"use client";

import React, { useEffect, useRef, useState } from "react";

type Phase = "work" | "short" | "long";

export default function Pomodoro() {
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [phase, setPhase] = useState<Phase>("work");
  const [cycle, setCycle] = useState(0);
  const [workMin, setWorkMin] = useState(25);
  const [shortMin, setShortMin] = useState(5);
  const [longMin, setLongMin] = useState(15);
  const [cyclesBeforeLong, setCyclesBeforeLong] = useState(4);
  const [setupOpen, setSetupOpen] = useState(false);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      // advance phase
      if (phase === "work") {
        const nextCycle = cycle + 1;
        setCycle(nextCycle);
        if (nextCycle % cyclesBeforeLong === 0) {
          setPhase("long");
          setSecondsLeft(longMin * 60);
        } else {
          setPhase("short");
          setSecondsLeft(shortMin * 60);
        }
      } else {
        // after break -> work
        setPhase("work");
        setSecondsLeft(workMin * 60);
      }
    }
  }, [secondsLeft, phase, cycle, workMin, shortMin, longMin, cyclesBeforeLong]);

  function start() {
    if (secondsLeft <= 0) setSecondsLeft(workMin * 60);
    setRunning(true);
  }

  function stop() {
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setPhase("work");
    setCycle(0);
    setSecondsLeft(workMin * 60);
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

  return (
    <div className="rounded-2xl bg-gradient-to-br from-orange-700 to-orange-500 p-5 shadow-sm border border-orange-600 text-white w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSetupOpen((s) => !s)}
            className="text-xs text-orange-200 bg-white/5 px-2 py-1 rounded-md"
          >
            {setupOpen ? "Close" : "Setup"}
          </button>
        </div>
      </div>

      <div className="mt-4">
        {setupOpen ? (
          <div className="space-y-2 text-sm text-orange-100">
            <div className="flex items-center gap-2">
              <label className="w-28">Work (min)</label>
              <input type="number" value={workMin} onChange={(e) => setWorkMin(Number(e.target.value))} className="w-20 rounded-md px-2 text-black" />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-28">Short break</label>
              <input type="number" value={shortMin} onChange={(e) => setShortMin(Number(e.target.value))} className="w-20 rounded-md px-2 text-black" />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-28">Long break</label>
              <input type="number" value={longMin} onChange={(e) => setLongMin(Number(e.target.value))} className="w-20 rounded-md px-2 text-black" />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-28">Cycles</label>
              <input type="number" value={cyclesBeforeLong} onChange={(e) => setCyclesBeforeLong(Number(e.target.value))} className="w-20 rounded-md px-2 text-black" />
            </div>
          </div>
        ) : (
          <div className="flex items-end justify-between">
            <div>
              <div className="text-4xl font-semibold">{format(secondsLeft)}</div>
              <div className="text-xs text-orange-200 mt-1">{phase} • cycle {cycle}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="h-24 w-24 rounded-2xl bg-white/10 flex items-center justify-center">
                {running ? (
                  <button onClick={stop} className="h-10 px-3 rounded-full bg-white/20 text-white text-sm font-medium">Stop</button>
                ) : (
                  <button onClick={start} className="h-10 px-3 rounded-full bg-white/20 text-white text-sm font-medium">Start</button>
                )}
              </div>
              <button onClick={reset} className="mt-2 text-xs text-orange-100 underline">Reset</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
