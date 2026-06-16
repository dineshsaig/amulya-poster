'use client';
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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

// ── Draft persistence ────────────────────────────────────────────────────────
const DRAFT_KEY = 'amulya_wizard_draft';

interface WizardDraft {
  step: WorkflowStep;
  day: Day | null;
  mealType: MealType | null;
  selectedVegIds: string[];
  selectedNonVegIds: string[];
  selectedDessertIds: string[];
}

function saveDraft(draft: WizardDraft): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch {}
}

function clearDraft(): void {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(DRAFT_KEY); } catch {}
}

function loadDraft(): WizardDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    return stored ? (JSON.parse(stored) as WizardDraft) : null;
  } catch {
    return null;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
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
  const [fetchError, setFetchError] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const directionRef = useRef(1);
  const prefersReducedMotion = useReducedMotion();

  const stepVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: prefersReducedMotion ? 0 : dir * 28,
    }),
    animate: { opacity: 1, x: 0 },
    exit: (dir: number) => ({
      opacity: 0,
      x: prefersReducedMotion ? 0 : dir * -28,
    }),
  };

  useEffect(() => { loadMenu(); }, []);

  async function loadMenu() {
    setMenuLoading(true);
    setFetchError(false);
    try {
      const [veg, nonVeg, desserts] = await Promise.all([
        fetchMenuItems('veg'),
        fetchMenuItems('non-veg'),
        fetchMenuItems('dessert'),
      ]);
      const activeVeg = veg.filter((i) => i.isActive);
      const activeNonVeg = nonVeg.filter((i) => i.isActive);
      const activeDesserts = desserts.filter((i) => i.isActive);

      // Restore draft state before committing to React — batched in one render
      const draft = loadDraft();
      const vegSet = new Set(draft?.selectedVegIds ?? []);
      const nonVegSet = new Set(draft?.selectedNonVegIds ?? []);
      const dessertsSet = new Set(draft?.selectedDessertIds ?? []);

      setAllVeg(activeVeg);
      setAllNonVeg(activeNonVeg);
      setAllDesserts(activeDesserts);

      if (draft) {
        if (draft.day) setDay(draft.day);
        if (draft.mealType) setMealType(draft.mealType);
        if (draft.step > 1) setStep(draft.step);
        setSelectedVeg(activeVeg.filter((i) => vegSet.has(i.id)));
        setSelectedNonVeg(activeNonVeg.filter((i) => nonVegSet.has(i.id)));
        setSelectedDesserts(activeDesserts.filter((i) => dessertsSet.has(i.id)));
      }
    } catch {
      setFetchError(true);
    } finally {
      setMenuLoading(false);
    }
  }

  // Persist wizard state whenever it changes so a tab switch never loses work
  useEffect(() => {
    if (menuLoading) return;
    const isEmpty =
      step === 1 && !day && !mealType &&
      selectedVeg.length === 0 && selectedNonVeg.length === 0 && selectedDesserts.length === 0;
    if (isEmpty) { clearDraft(); return; }
    saveDraft({
      step, day, mealType,
      selectedVegIds: selectedVeg.map((i) => i.id),
      selectedNonVegIds: selectedNonVeg.map((i) => i.id),
      selectedDessertIds: selectedDesserts.map((i) => i.id),
    });
  }, [step, day, mealType, selectedVeg, selectedNonVeg, selectedDesserts, menuLoading]);

  function toggleItem(item: MenuItem, setter: React.Dispatch<React.SetStateAction<MenuItem[]>>) {
    setter((prev) =>
      prev.find((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  }

  function canProceed(): boolean {
    switch (step) {
      case 1: return day !== null;
      case 2: return mealType !== null;
      case 3: return selectedVeg.length >= 1;
      case 4: return selectedNonVeg.length >= 1;
      case 5: return selectedDesserts.length >= 1;
      default: return true;
    }
  }

  function nextStep() {
    if (canProceed() && step < 6) {
      directionRef.current = 1;
      setStep((s) => (s + 1) as WorkflowStep);
    }
  }
  function prevStep() {
    if (step > 1) {
      directionRef.current = -1;
      setStep((s) => (s - 1) as WorkflowStep);
    }
  }

  function confirmReset() {
    setShowResetConfirm(false);
    setStep(1);
    setDay(null);
    setMealType(null);
    setSelectedVeg([]);
    setSelectedNonVeg([]);
    setSelectedDesserts([]);
    clearDraft();
  }

  const posterConfig: PosterConfig = {
    day: day || 'Monday',
    mealType: mealType || 'Lunch',
    vegItems: selectedVeg,
    nonVegItems: selectedNonVeg,
    desserts: selectedDesserts,
    accompaniments,
  };

  // ── Loading ──────────────────────────────────────────────────────────────
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

  // ── Error ────────────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center px-6">
        <div className="text-center space-y-5 max-w-sm w-full">
          <div className="w-14 h-14 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h2
              className="text-lg font-bold text-stone-100"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Couldn't load the menu
            </h2>
            <p className="text-stone-400 text-sm mt-1.5 leading-relaxed">
              Check your connection and try again.
            </p>
          </div>
          <Button variant="primary" size="md" onClick={loadMenu} className="w-full">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  // ── Main wizard ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-950">
      {/* Top Nav */}
      <div className="border-b border-stone-800/80 bg-stone-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="text-base font-bold text-amber-400"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Amulya
            </div>
            <span className="text-stone-600 text-xs">Poster Generator</span>
          </div>

          <div className="flex items-center gap-2">
            {step > 1 && step < 6 && (
              showResetConfirm ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-stone-400">Reset all?</span>
                  <button
                    onClick={confirmReset}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold px-2 py-1 cursor-pointer"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="text-xs text-stone-500 hover:text-stone-300 px-2 py-1 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="text-xs text-stone-600 hover:text-stone-400 cursor-pointer px-2 py-1"
                >
                  Start over
                </button>
              )
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
        {/* Step indicator + cross-step context */}
        <div className="py-5">
          <StepIndicator currentStep={step} totalSteps={6} />
          {step >= 3 && day && mealType && (
            <p className="text-center text-xs text-amber-700/70 mt-2 tracking-wide">
              {day} · {mealType}
            </p>
          )}
        </div>

        {/* Step content */}
        <div className="min-h-[420px]">
          <AnimatePresence mode="wait" custom={directionRef.current}>
            <motion.div
              key={step}
              custom={directionRef.current}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                duration: prefersReducedMotion ? 0.08 : 0.22,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
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
            </motion.div>
          </AnimatePresence>
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
