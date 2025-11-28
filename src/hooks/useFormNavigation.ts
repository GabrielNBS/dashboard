import { useCallback } from 'react';

export const useFormNavigation = () => {
  const focusNext = useCallback((currentElement: HTMLElement | null) => {
    if (!currentElement) return;

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const form = currentElement.closest('form') || document.body;
    const focusable = Array.from(form.querySelectorAll(focusableSelector)) as HTMLElement[];

    const index = focusable.indexOf(currentElement);

    if (index > -1 && index < focusable.length - 1) {
      const nextElement = focusable[index + 1];

      nextElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

      nextElement.focus();
    }
  }, []);

  const focusElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.focus();
    }
  }, []);

  return { focusNext, focusElement };
};
