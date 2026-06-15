import { createClient } from '@supabase/supabase-js';
import { MenuItem, MenuCategory } from '@/types';
import {
  DEFAULT_VEG_ITEMS,
  DEFAULT_NON_VEG_ITEMS,
  DEFAULT_DESSERTS,
  DEFAULT_ACCOMPANIMENTS,
} from './menuData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local Storage Keys
const STORAGE_KEYS = {
  VEG: 'amulya_veg_items',
  NON_VEG: 'amulya_nonveg_items',
  DESSERTS: 'amulya_dessert_items',
  ACCOMPANIMENTS: 'amulya_accompaniments',
};

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getFromStorage<T>(key: string, defaults: T[]): T[] {
  if (typeof window === 'undefined') return defaults;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaults;
  } catch {
    return defaults;
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

export async function fetchMenuItems(category: MenuCategory): Promise<MenuItem[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('sort_order');
    if (!error && data) {
      return data.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category as MenuCategory,
        isDefault: item.is_default,
        isActive: item.is_active,
        sortOrder: item.sort_order,
        createdAt: item.created_at,
      }));
    }
  }

  // Fallback to localStorage
  switch (category) {
    case 'veg': return getFromStorage(STORAGE_KEYS.VEG, DEFAULT_VEG_ITEMS);
    case 'non-veg': return getFromStorage(STORAGE_KEYS.NON_VEG, DEFAULT_NON_VEG_ITEMS);
    case 'dessert': return getFromStorage(STORAGE_KEYS.DESSERTS, DEFAULT_DESSERTS);
    case 'accompaniment': return getFromStorage(STORAGE_KEYS.ACCOMPANIMENTS, DEFAULT_ACCOMPANIMENTS);
    default: return [];
  }
}

export async function saveMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
  const newItem: MenuItem = { ...item, id: generateId() };

  if (supabase) {
    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        name: newItem.name,
        category: newItem.category,
        is_default: newItem.isDefault ?? false,
        is_active: newItem.isActive,
        sort_order: newItem.sortOrder,
      })
      .select()
      .single();
    if (!error && data) {
      return { ...newItem, id: data.id };
    }
  }

  // Fallback to localStorage
  const key = getCategoryKey(item.category);
  const items = getFromStorage(key, getDefaults(item.category));
  const updated = [...items, newItem];
  saveToStorage(key, updated);
  return newItem;
}

export async function updateMenuItem(item: MenuItem): Promise<void> {
  if (supabase) {
    await supabase
      .from('menu_items')
      .update({
        name: item.name,
        is_active: item.isActive,
        sort_order: item.sortOrder,
      })
      .eq('id', item.id);
    return;
  }

  const key = getCategoryKey(item.category);
  const items = getFromStorage<MenuItem>(key, getDefaults(item.category));
  const updated = items.map((i) => (i.id === item.id ? item : i));
  saveToStorage(key, updated);
}

export async function deleteMenuItem(id: string, category: MenuCategory): Promise<void> {
  if (supabase) {
    await supabase.from('menu_items').delete().eq('id', id);
    return;
  }

  const key = getCategoryKey(category);
  const items = getFromStorage<MenuItem>(key, getDefaults(category));
  const updated = items.filter((i) => i.id !== id);
  saveToStorage(key, updated);
}

function getCategoryKey(category: MenuCategory): string {
  switch (category) {
    case 'veg': return STORAGE_KEYS.VEG;
    case 'non-veg': return STORAGE_KEYS.NON_VEG;
    case 'dessert': return STORAGE_KEYS.DESSERTS;
    case 'accompaniment': return STORAGE_KEYS.ACCOMPANIMENTS;
  }
}

function getDefaults(category: MenuCategory): MenuItem[] {
  switch (category) {
    case 'veg': return DEFAULT_VEG_ITEMS;
    case 'non-veg': return DEFAULT_NON_VEG_ITEMS;
    case 'dessert': return DEFAULT_DESSERTS;
    case 'accompaniment': return DEFAULT_ACCOMPANIMENTS;
  }
}
