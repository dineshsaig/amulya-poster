'use client';
import React from 'react';
import { MealType } from '@/types';

interface StepMealTypeProps {
  selected: MealType | null;
  onSelect: (meal: MealType) => void;
}

const MEAL_OPTIONS: { type: MealType; icon: string; desc: string; time: string }[] = [
  { type: 'Lunch', icon: '☀️', desc: 'Midday buffet spread', time: '12:00 – 3:00 PM' },
  { type: 'Dinner', icon: '🌙', desc: 'Evening buffet spread', time: '6:00 – 10:00 PM' },
];

export default function StepMealType({ selected, onSelect }: StepMealTypeProps) {
  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl font-bold text-amber-100" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Lunch or Dinner?
        </h2>
        <p className="text-stone-400 text-sm mt-1">Select the buffet service</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {MEAL_OPTIONS.map((meal) => {
          const isSelected = selected === meal.type;
          return (
            <button
              key={meal.type}
              onClick={() => onSelect(meal.type)}
              className={`
                flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-200 cursor-pointer active:scale-95
                ${isSelected
                  ? 'bg-gradient-to-b from-amber-600/20 to-amber-800/20 border-amber-500/60 ring-2 ring-amber-500/40 shadow-xl shadow-amber-900/30'
                  : 'bg-stone-800/60 border-stone-700/50 hover:border-amber-600/30 hover:bg-stone-800'
                }
              `}
            >
              <div className="text-4xl">{meal.icon}</div>
              <div className="text-center">
                <div className={`text-lg font-bold ${isSelected ? 'text-amber-200' : 'text-stone-200'}`}
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {meal.type}
                </div>
                <div className={`text-xs mt-0.5 ${isSelected ? 'text-amber-400' : 'text-stone-500'}`}>
                  {meal.desc}
                </div>
                <div className={`text-[10px] mt-1 font-medium ${isSelected ? 'text-amber-500' : 'text-stone-600'}`}>
                  {meal.time}
                </div>
              </div>
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shadow">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
