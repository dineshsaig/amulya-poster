'use client';
import React, { useEffect, useState } from 'react';
import { MenuItem, MenuCategory } from '@/types';
import { fetchMenuItems, saveMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const CATEGORIES: { key: MenuCategory; label: string; emoji: string }[] = [
  { key: 'veg', label: 'Vegetarian', emoji: '🌿' },
  { key: 'non-veg', label: 'Non-Vegetarian', emoji: '🍗' },
  { key: 'dessert', label: 'Desserts', emoji: '🍮' },
  { key: 'accompaniment', label: 'Accompaniments', emoji: '🍚' },
];

export default function AdminPage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('veg');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    loadItems();
  }, [activeCategory]);

  async function loadItems() {
    setLoading(true);
    const data = await fetchMenuItems(activeCategory);
    setItems(data);
    setLoading(false);
  }

  async function handleAdd() {
    if (!newItemName.trim()) return;
    setAdding(true);
    try {
      const newItem = await saveMenuItem({
        name: newItemName.trim(),
        category: activeCategory,
        isActive: true,
        sortOrder: items.length + 1,
      });
      setItems((prev) => [...prev, newItem]);
      setNewItemName('');
    } finally {
      setAdding(false);
    }
  }

  async function handleUpdate(item: MenuItem) {
    await updateMenuItem({ ...item, name: editName.trim() });
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, name: editName.trim() } : i)));
    setEditingId(null);
  }

  async function handleDelete(item: MenuItem) {
    if (!confirm(`Delete "${item.name}"?`)) return;
    await deleteMenuItem(item.id, item.category);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  async function handleToggleActive(item: MenuItem) {
    const updated = { ...item, isActive: !item.isActive };
    await updateMenuItem(updated);
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Header */}
      <div className="border-b border-stone-800 bg-stone-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-amber-300" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Menu Library
            </h1>
            <p className="text-xs text-stone-500">Manage your buffet menu items</p>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">← Back to App</Button>
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Category tabs */}
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`
                flex flex-col items-center gap-1 py-3 px-2 rounded-xl border transition-all duration-200 cursor-pointer
                ${activeCategory === cat.key
                  ? 'bg-amber-900/30 border-amber-600/50 text-amber-300'
                  : 'bg-stone-800/50 border-stone-700/50 text-stone-400 hover:border-stone-600'
                }
              `}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className="text-[10px] font-medium text-center leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Add new item */}
        <div className="bg-stone-900/60 rounded-2xl border border-stone-700/40 p-4">
          <h3 className="text-sm font-semibold text-amber-300 mb-3">
            Add New {CATEGORIES.find((c) => c.key === activeCategory)?.label} Item
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Item name..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1 px-4 py-2.5 bg-stone-800 border border-stone-700/60 rounded-xl text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-600/40"
            />
            <Button onClick={handleAdd} loading={adding} disabled={!newItemName.trim()}>
              Add
            </Button>
          </div>
        </div>

        {/* Items list */}
        <div className="bg-stone-900/60 rounded-2xl border border-stone-700/40 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-800 flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-300">
              {CATEGORIES.find((c) => c.key === activeCategory)?.emoji} Items ({items.length})
            </span>
            <span className="text-xs text-stone-500">
              {items.filter((i) => i.isActive).length} active
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-stone-500 text-sm">Loading...</div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-stone-500 text-sm">
              No items yet. Add your first item above.
            </div>
          ) : (
            <div className="divide-y divide-stone-800">
              {items.map((item) => (
                <div key={item.id} className="px-4 py-3 flex items-center gap-3">
                  {/* Active toggle */}
                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`w-9 h-5 rounded-full transition-all duration-200 flex-shrink-0 relative cursor-pointer ${
                      item.isActive ? 'bg-amber-600' : 'bg-stone-700'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                      item.isActive ? 'left-4' : 'left-0.5'
                    }`} />
                  </button>

                  {/* Name / edit */}
                  <div className="flex-1 min-w-0">
                    {editingId === item.id ? (
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdate(item);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="w-full px-2 py-1 bg-stone-800 border border-amber-600/40 rounded-lg text-sm text-stone-200 focus:outline-none"
                      />
                    ) : (
                      <span className={`text-sm truncate block ${item.isActive ? 'text-stone-200' : 'text-stone-500 line-through'}`}>
                        {item.name}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {editingId === item.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(item)}
                          className="text-xs text-amber-400 hover:text-amber-300 px-2 py-1 cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-xs text-stone-500 hover:text-stone-300 px-2 py-1 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditingId(item.id); setEditName(item.name); }}
                          className="p-1.5 text-stone-500 hover:text-amber-400 rounded-lg hover:bg-amber-900/20 transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 text-stone-600 hover:text-red-400 rounded-lg hover:bg-red-900/20 transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
