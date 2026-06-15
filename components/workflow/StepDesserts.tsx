'use client';
import StepMenuSelect from './StepMenuSelect';
import { PosterConfig } from '@/types';
import { getAllMenuItems } from '@/lib/menuData';

interface StepDessertsProps {
  config: PosterConfig;
  onUpdate: (config: PosterConfig) => void;
}

export default function StepDesserts({ config, onUpdate }: StepDessertsProps) {
  const allItems = getAllMenuItems();

  return (
    <StepMenuSelect
      title="Desserts"
      subtitle="Sweet treats & puddings"
      emoji="🍰"
      allItems={allItems.desserts}
      selectedItems={config.desserts}
      onToggle={(item) => {
        const updated = config.desserts.find(i => i.id === item.id)
          ? config.desserts.filter(i => i.id !== item.id)
          : [...config.desserts, item];
        onUpdate({ ...config, desserts: updated });
      }}
      maxItems={5}
      minItems={0}
    />
  );
}
