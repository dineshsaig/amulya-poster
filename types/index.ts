export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type MealType = 'Lunch' | 'Dinner';
export type MenuCategory = 'veg' | 'non-veg' | 'dessert' | 'accompaniment';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  isDefault?: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
}

export interface PosterConfig {
  day: Day;
  mealType: MealType;
  vegItems: MenuItem[];
  nonVegItems: MenuItem[];
  desserts: MenuItem[];
  accompaniments: MenuItem[];
  date?: string;
}

export interface MenuLibrary {
  veg: MenuItem[];
  nonVeg: MenuItem[];
  desserts: MenuItem[];
  accompaniments: MenuItem[];
}

export type WorkflowStep = 1 | 2 | 3 | 4 | 5 | 6;
