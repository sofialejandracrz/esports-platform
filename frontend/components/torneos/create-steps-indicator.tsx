'use client';

import { cn } from '@/lib/utils';
import { IconCheck } from '@tabler/icons-react';

interface StepsIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const STEP_LABELS = [
  'Info Básica',
  'Detalles',
  'Premios',
  'Anfitrión',
  'Gráficos',
  'Finalizar',
];

export function CreateStepsIndicator({ currentStep, totalSteps, onStepClick }: StepsIndicatorProps) {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Paso {currentStep} de {totalSteps}</span>
        <span className="text-muted-foreground">{progress}%</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <button
              key={stepNumber}
              onClick={() => onStepClick(stepNumber)}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-xs font-medium transition-colors',
                isCurrent && 'border-primary bg-primary text-primary-foreground',
                isCompleted && 'border-green-600/50 bg-green-950/30 text-green-400',
                !isCurrent && !isCompleted && 'border-border bg-card text-muted-foreground hover:bg-accent'
              )}
            >
              {isCompleted && <IconCheck className="size-3" />}
              <span className="truncate">{STEP_LABELS[index]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
