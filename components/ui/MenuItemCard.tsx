'use client';
import React from 'react';
import { MenuItem } from '@/types';

interface MenuItemCardProps {
  item: MenuItem;
  selected: boolean;
  onToggle: (item: MenuItem) => void;
}

const categoryColors = {
  veg: { ring: 'ring-emerald-500', bg: 'bg-emerald-500/10', dot: 'bg-emerald-400', check: 'bg-emerald-600' },
  'non-veg': { ring: 'ring-red-500', bg: 'bg-red-500/10', dot: 'bg-red-500', check: 'bg-red-700' },
  dessert: { ring: 'ring-pink-500', bg: 'bg-pink-500/10', dot: 'bg-pink-400', check: 'bg-pink-600' },
  accompaniment: { ring: 'ring-amber-500', bg: 'bg-amber-500/10', dot: 'bg-amber-400', check: 'bg-amber-600' },
};

export default function MenuItemCard({ item, selected, onToggle }: MenuItemCardProps) {
  const colors = categoryColors[item.category];

  return (
    <button
      role="checkbox"
      aria-checked={selected}
      onClick={() => onToggle(item)}
      className={`
        relative w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer
        active:scale-95 select-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-900
        ${selected
          ? `${colors.bg} border-amber-500/60 ring-1 ${colors.ring} ring-opacity-40 shadow-md`
          : 'bg-stone-800/50 border-stone-700/50 hover:border-amber-600/30 hover:bg-stone-800'
        }
      `}
    >
      <div className="flex items-center gap-3">
        {/* Category indicator */}
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />

        {/* Item name */}
        <span className={`text-sm font-medium flex-1 leading-snug ${selected ? 'text-amber-100' : 'text-stone-300'}`}>
          {item.name}
        </span>

        {/* Checkbox */}
        <div className={`
          w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all duration-150
          ${selected ? `${colors.check} border-transparent` : 'border-stone-600 bg-transparent'}
        `}>
          {selected && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
