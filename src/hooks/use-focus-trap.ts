import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  'button:not([disabled]):not([aria-hidden="true"])',
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"]):not([aria-hidden="true"])',
].join(", ");

export function useFocusTrap(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    const el = ref.current;
    if (!el) return;

    const focusableElements = el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (firstFocusable) {
      firstFocusable.focus();
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab" || !el) return;

      const currentFocusables = el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      const first = currentFocusables[0];
      const last = currentFocusables[currentFocusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [active]);

  return ref;
}
