'use client';
import StepMenuSelect from './StepMenuSelect';
import { PosterConfig } from '@/types';
import { getAllMenuItems } from '@/lib/menuData';

interface StepNonVegProps {
  config: PosterConfig;
  onUpdate: (config: PosterConfig) => void;
}

export default function StepNonVeg({ config, onUpdate }: StepNonVegProps) {
  const allItems = getAllMenuItems();

  return (
    <StepMenuSelect
      title="Non-Veg Items"
      subtitle="Select meat & seafood dishes"
      emoji="🍗"
      allItems={allItems.nonVeg}
      selectedItems={config.nonVegItems}
      onToggle={(item) => {
        const updated = config.nonVegItems.find(i => i.id === item.id)
          ? config.nonVegItems.filter(i => i.id !== item.id)
          : [...config.nonVegItems, item];
        onUpdate({ ...config, nonVegItems: updated });
      }}
      maxItems={15}
      minItems={1}
    />
  );
}
