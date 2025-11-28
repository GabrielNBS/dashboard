import { useState, useCallback } from 'react';

export interface UseWizardNavigationOptions {
  totalSteps: number;
  onSubmit: () => Promise<void> | void;
  validateStep?: (step: number) => boolean;
  onStepChange?: (step: number) => void;
}

export function useWizardNavigation({
  totalSteps,
  onSubmit,
  validateStep,
  onStepChange,
}: UseWizardNavigationOptions) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        setCurrentStep(step);
        onStepChange?.(step);
      }
    },
    [totalSteps, onStepChange]
  );

  const nextStep = useCallback(() => {
    if (validateStep && !validateStep(currentStep)) {
      return false;
    }

    if (currentStep < totalSteps - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      onStepChange?.(nextStepIndex);
      return true;
    }
    return false;
  }, [currentStep, totalSteps, validateStep, onStepChange]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      onStepChange?.(prevStepIndex);
      return true;
    }
    return false;
  }, [currentStep, onStepChange]);

  const submit = useCallback(async () => {
    if (validateStep && !validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  }, [currentStep, validateStep, onSubmit]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsSubmitting(false);
  }, []);

  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return {
    currentStep,
    isSubmitting,
    progress,
    isFirstStep,
    isLastStep,
    goToStep,
    nextStep,
    prevStep,
    submit,
    reset,
  };
}
