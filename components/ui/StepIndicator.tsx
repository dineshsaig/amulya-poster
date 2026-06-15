'use client';
import React from 'react';
import { WorkflowStep } from '@/types';

interface StepIndicatorProps {
  currentStep: WorkflowStep;
  totalSteps: number;
}

const STEPS = [
  { label: 'Day' },
  { label: 'Meal' },
  { label: 'Veg' },
  { label: 'Non-Veg' },
  { label: 'Desserts' },
  { label: 'Poster' },
];

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="w-full px-4">
      <div className="flex items-center justify-between gap-1">
        {STEPS.map((step, index) => {
          const stepNum = (index + 1) as WorkflowStep;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                    ${isCompleted
                      ? 'bg-gradient-to-br from-amber-500 to-yellow-500 text-stone-900 shadow-md shadow-amber-900/40'
                      : isCurrent
                      ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white ring-2 ring-amber-400/50 shadow-lg shadow-amber-900/40'
                      : 'bg-stone-800 text-stone-500 border border-stone-700'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span className={`text-[9px] font-medium tracking-wide ${
                  isCurrent ? 'text-amber-400' : isCompleted ? 'text-amber-600' : 'text-stone-600'
                }`}>
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-px mb-3 transition-all duration-500 ${
                  isCompleted ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'bg-stone-700'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
