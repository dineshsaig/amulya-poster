'use client';
import React from 'react';
import { Day } from '@/types';

const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DAY_SHORT: Record<Day, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu',
  Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
};

interface StepDayProps {
  selected: Day | null;
  onSelect: (day: Day) => void;
}

export default function StepDay({ selected, onSelect }: StepDayProps) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as Day;

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl font-bold text-amber-100" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Select the Day
        </h2>
        <p className="text-stone-400 text-sm mt-1">Which day is this buffet for?</p>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {DAYS.map((day) => {
          const isToday = day === today;
          const isSelected = day === selected;
          return (
            <button
              key={day}
              onClick={() => onSelect(day)}
              className={`
                flex flex-col items-center gap-1 py-3 px-1 rounded-xl border transition-all duration-200 cursor-pointer active:scale-95
                ${isSelected
                  ? 'bg-gradient-to-b from-amber-600 to-amber-700 border-amber-500 shadow-lg shadow-amber-900/40 ring-1 ring-amber-400/50'
                  : 'bg-stone-800/60 border-stone-700/50 hover:border-amber-600/40 hover:bg-stone-800'
                }
              `}
            >
              <span className={`text-[10px] font-semibold tracking-wide uppercase ${isSelected ? 'text-amber-100' : 'text-stone-400'}`}>
                {DAY_SHORT[day]}
              </span>
              {isToday && (
                <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-200' : 'bg-amber-500'}`} />
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="text-center py-3 rounded-xl bg-amber-900/20 border border-amber-700/30">
          <span className="text-amber-300 font-semibold text-sm">
            ✓ {selected} selected
            {today === selected && <span className="text-amber-500 ml-1.5 text-xs">(Today)</span>}
          </span>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={() => onSelect(today)}
          className="text-xs text-amber-600 hover:text-amber-400 underline underline-offset-2 cursor-pointer"
        >
          Use today ({today})
        </button>
      </div>
    </div>
  );
}
