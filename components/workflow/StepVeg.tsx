'use client';
import StepMenuSelect from './StepMenuSelect';
import { PosterConfig } from '@/types';
import { getAllMenuItems } from '@/lib/menuData';

interface StepVegProps {
  config: PosterConfig;
  onUpdate: (config: PosterConfig) => void;
}

export default function StepVeg({ config, onUpdate }: StepVegProps) {
  const allItems = getAllMenuItems();

  return (
    <StepMenuSelect
      title="Veg Items"
      subtitle="Select vegetarian dishes"
      emoji="🥬"
      allItems={allItems.veg}
      selectedItems={config.vegItems}
      onToggle={(item) => {
        const updated = config.vegItems.find(i => i.id === item.id)
          ? config.vegItems.filter(i => i.id !== item.id)
          : [...config.vegItems, item];
        onUpdate({ ...config, vegItems: updated });
      }}
      maxItems={15}
      minItems={1}
    />
  );
}
