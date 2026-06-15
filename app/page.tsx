'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Day, MealType, MenuItem, WorkflowStep, PosterConfig } from '@/types';
import { fetchMenuItems } from '@/lib/supabase';
import { DEFAULT_ACCOMPANIMENTS } from '@/lib/menuData';

import StepIndicator from '@/components/ui/StepIndicator';
import StepDay from '@/components/workflow/StepDay';
import StepMealType from '@/components/workflow/StepMealType';
import StepMenuSelect from '@/components/workflow/StepMenuSelect';
import StepPoster from '@/components/workflow/StepPoster';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function HomePage() {
  const [step, setStep] = useState<WorkflowStep>(1);
  const [day, setDay] = useState<Day | null>(null);
  const [mealType, setMealType] = useState<MealType | null>(null);
  const [selectedVeg, setSelectedVeg] = useState<MenuItem[]>([]);
  const [selectedNonVeg, setSelectedNonVeg] = useState<MenuItem[]>([]);
  const [selectedDesserts, setSelectedDesserts] = useState<MenuItem[]>([]);
  const [accompaniments] = useState<MenuItem[]>(DEFAULT_ACCOMPANIMENTS.filter((a) => a.isActive));

  const [allVeg, setAllVeg] = useState<MenuItem[]>([]);
  const [allNonVeg, setAllNonVeg] = useState<MenuItem[]>([]);
  const [allDesserts, setAllDesserts] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      setMenuLoading(true);
      const [veg, nonVeg, desserts] = await Promise.all([
        fetchMenuItems('veg'),
        fetchMenuItems('non-veg'),
        fetchMenuItems('dessert'),
      ]);
      setAllVeg(veg.filter((i) => i.isActive));
      setAllNonVeg(nonVeg.filter((i) => i.isActive));
      setAllDesserts(desserts.filter((i) => i.isActive));
      setMenuLoading(false);
    }
    loadAll();
  }, []);

  function toggleItem(item: MenuItem, setter: React.Dispatch<React.SetStateAction<MenuItem[]>>) {
    setter((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      return exists ? prev.filter((i) => i.id !== item.id) : [...prev, item];
    });
  }

  const canProceed = useCallback(() => {
    switch (step) {
      case 1: return day !== null;
      case 2: return mealType !== null;
      case 3: return selectedVeg.length >= 1;
      case 4: return selectedNonVeg.length >= 1;
      case 5: return selectedDesserts.length >= 1;
      default: return true;
    }
  }, [step, day, mealType, selectedVeg, selectedNonVeg, selectedDesserts]);

  function nextStep() {
    if (canProceed() && step < 6) setStep((s) => (s + 1) as WorkflowStep);
  }
  function prevStep() {
    if (step > 1) setStep((s) => (s - 1) as WorkflowStep);
  }

  function reset() {
    setStep(1);
    setDay(null);
    setMealType(null);
    setSelectedVeg([]);
    setSelectedNonVeg([]);
    setSelectedDesserts([]);
  }

  const posterConfig: PosterConfig = {
    day: day || 'Monday',
    mealType: mealType || 'Lunch',
    vegItems: selectedVeg,
    nonVegItems: selectedNonVeg,
    desserts: selectedDesserts,
    accompaniments,
  };

  if (menuLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-stone-400 text-sm">Loading menu library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950">
      {/* Top Nav */}
      <div className="border-b border-stone-800/80 bg-stone-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="text-base font-bold"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                background: 'linear-gradient(135deg, #C9A84C, #F0C96B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Amulya
            </div>
            <span className="text-stone-600 text-xs">Poster Generator</span>
          </div>

          <div className="flex items-center gap-2">
            {step > 1 && step < 6 && (
              <button onClick={reset} className="text-xs text-stone-600 hover:text-stone-400 cursor-pointer px-2 py-1">
                Start over
              </button>
            )}
            <Link href="/admin">
              <button className="text-xs text-amber-700 hover:text-amber-500 border border-amber-800/40 hover:border-amber-700/60 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                Manage Menu
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pb-24">
        {/* Step indicator */}
        <div className="py-5">
          <StepIndicator currentStep={step} totalSteps={6} />
        </div>

        {/* Step content */}
        <div className="min-h-[420px]">
          {step === 1 && (
            <StepDay
              selected={day}
              onSelect={(d) => { setDay(d); setTimeout(nextStep, 300); }}
            />
          )}

          {step === 2 && (
            <StepMealType
              selected={mealType}
              onSelect={(m) => { setMealType(m); setTimeout(nextStep, 300); }}
            />
          )}

          {step === 3 && (
            <StepMenuSelect
              title="Veg Items"
              subtitle="Select vegetarian dishes for the buffet"
              emoji="🌿"
              allItems={allVeg}
              selectedItems={selectedVeg}
              onToggle={(item) => toggleItem(item, setSelectedVeg)}
              minItems={1}
            />
          )}

          {step === 4 && (
            <StepMenuSelect
              title="Non-Veg Items"
              subtitle="Select non-vegetarian dishes"
              emoji="🍗"
              allItems={allNonVeg}
              selectedItems={selectedNonVeg}
              onToggle={(item) => toggleItem(item, setSelectedNonVeg)}
              minItems={1}
            />
          )}

          {step === 5 && (
            <StepMenuSelect
              title="Desserts"
              subtitle="Choose today's sweet selections"
              emoji="🍮"
              allItems={allDesserts}
              selectedItems={selectedDesserts}
              onToggle={(item) => toggleItem(item, setSelectedDesserts)}
              minItems={1}
            />
          )}

          {step === 6 && (
            <StepPoster config={posterConfig} onBack={prevStep} />
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      {step < 6 && (
        <div className="fixed bottom-0 left-0 right-0 bg-stone-950/95 backdrop-blur-sm border-t border-stone-800 px-4 py-4 z-20">
          <div className="max-w-lg mx-auto flex gap-3">
            {step > 1 && (
              <Button variant="ghost" size="lg" onClick={prevStep} className="flex-1">
                ← Back
              </Button>
            )}
            <Button
              variant="primary"
              size="lg"
              onClick={nextStep}
              disabled={!canProceed()}
              className={`${step === 1 ? 'w-full' : 'flex-2 flex-grow-[2]'} font-bold tracking-wide`}
            >
              {step === 5 ? '✨ Generate Poster' : 'Continue →'}
            </Button>
          </div>

          <div className="max-w-lg mx-auto mt-2 text-center">
            {step === 3 && selectedVeg.length === 0 && (
              <p className="text-xs text-stone-600">Select at least 1 veg item to continue</p>
            )}
            {step === 4 && selectedNonVeg.length === 0 && (
              <p className="text-xs text-stone-600">Select at least 1 non-veg item to continue</p>
            )}
            {step === 5 && selectedDesserts.length === 0 && (
              <p className="text-xs text-stone-600">Select at least 1 dessert to continue</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
