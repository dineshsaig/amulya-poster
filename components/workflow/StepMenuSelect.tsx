'use client';
import React, { useState } from 'react';
import { MenuItem } from '@/types';
import MenuItemCard from '@/components/ui/MenuItemCard';

interface StepMenuSelectProps {
  title: string;
  subtitle: string;
  emoji: string;
  allItems: MenuItem[];
  selectedItems: MenuItem[];
  onToggle: (item: MenuItem) => void;
  maxItems?: number;
  minItems?: number;
}

export default function StepMenuSelect({
  title,
  subtitle,
  emoji,
  allItems,
  selectedItems,
  onToggle,
  maxItems = 12,
  minItems = 1,
}: StepMenuSelectProps) {
  const [search, setSearch] = useState('');
  const selectedIds = new Set(selectedItems.map((i) => i.id));

  const filtered = allItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCount = selectedItems.length;

  function selectAll() {
    allItems.forEach((item) => {
      if (!selectedIds.has(item.id)) onToggle(item);
    });
  }

  function clearAll() {
    selectedItems.forEach((item) => onToggle(item));
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-3xl mb-1">{emoji}</div>
        <h2 className="text-xl font-bold text-amber-100" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {title}
        </h2>
        <p className="text-stone-400 text-sm mt-0.5">{subtitle}</p>
      </div>

      {/* Count badge + controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`
            text-xs font-bold px-2.5 py-1 rounded-full
            ${selectedCount >= minItems ? 'bg-amber-600/20 text-amber-300 border border-amber-600/30' : 'bg-stone-800 text-stone-400 border border-stone-700'}
          `}>
            {selectedCount} selected
          </span>
          {maxItems && <span className="text-xs text-stone-600">/ {maxItems} max</span>}
        </div>
        <div className="flex gap-2">
          <button onClick={selectAll} className="text-xs text-amber-600 hover:text-amber-400 cursor-pointer">
            Select all
          </button>
          <span className="text-stone-700">·</span>
          <button onClick={clearAll} className="text-xs text-stone-500 hover:text-stone-300 cursor-pointer">
            Clear
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-stone-800/80 border border-stone-700/60 rounded-xl text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-600/40 focus:ring-1 focus:ring-amber-600/30"
        />
      </div>

      {/* Selected items preview */}
      {selectedItems.length > 0 && (
        <div className="bg-stone-900/40 rounded-xl p-3 border border-amber-700/20">
          <div className="text-[10px] text-amber-600 uppercase tracking-widest mb-2 font-semibold">Selected</div>
          <div className="flex flex-wrap gap-1.5">
            {selectedItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onToggle(item)}
                className="text-xs bg-amber-800/30 text-amber-200 border border-amber-700/40 px-2 py-0.5 rounded-full hover:bg-red-900/30 hover:text-red-300 hover:border-red-700/40 transition-colors cursor-pointer"
              >
                {item.name} ✕
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Items grid */}
      <div className="grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto pr-1 -mr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-6 text-stone-500 text-sm">No items match your search</div>
        ) : (
          filtered.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              selected={selectedIds.has(item.id)}
              onToggle={onToggle}
            />
          ))
        )}
      </div>
    </div>
  );
}
