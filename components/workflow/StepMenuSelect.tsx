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
      {/* HEADER */}
      <div className="text-center">
        <div className="text-3xl mb-1">{emoji}</div>
        <h2 className="text-xl font-bold text-amber-100" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {title}
        </h2>
        <p className="text-stone-400 text-sm mt-0.5">{subtitle}</p>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-2 gap-3 min-h-[500px]">

        {/* LEFT: Search + Items to Select */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold">Available</span>
            <div className="flex gap-1.5">
              <button onClick={selectAll} className="text-[10px] text-amber-600 hover:text-amber-400 cursor-pointer">
                Select all
              </button>
              <span className="text-[10px] text-stone-700">·</span>
              <button onClick={clearAll} className="text-[10px] text-stone-500 hover:text-stone-300 cursor-pointer">
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
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-800/80 border border-stone-700/60 rounded-lg text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-600/40 focus:ring-1 focus:ring-amber-600/30"
            />
          </div>

          {/* Items Grid - Scrollable */}
          <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-1">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-xs">No items match</div>
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

        {/* RIGHT: Selected Items */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-amber-600 uppercase tracking-widest font-semibold">Selected</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              selectedCount >= minItems 
                ? 'bg-green-900/30 text-green-300 border border-green-700/40' 
                : 'bg-stone-800 text-stone-400 border border-stone-700'
            }`}>
              {selectedCount}{maxItems ? `/${maxItems}` : ''}
            </span>
          </div>

          {/* Selected Items - Scrollable */}
          <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-1 bg-stone-900/30 rounded-lg p-2 border border-amber-700/20">
            {selectedItems.length === 0 ? (
              <div className="text-center py-8 text-stone-600 text-xs">Select items →</div>
            ) : (
              selectedItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onToggle(item)}
                  className="w-full text-left text-xs bg-amber-800/40 text-amber-100 border border-amber-700/30 px-3 py-2 rounded-lg hover:bg-red-900/40 hover:text-red-200 hover:border-red-700/40 transition-all cursor-pointer flex justify-between items-center"
                >
                  <span>{item.name}</span>
                  <span className="text-[9px] opacity-60">✕</span>
                </button>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
