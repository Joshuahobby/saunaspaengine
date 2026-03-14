"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "!glass-card !bg-white/95 dark:!bg-surface-dark/95 !text-teal-950 dark:!text-teal-50 !shadow-xl !border !border-teal-100 dark:!border-teal-900 !backdrop-blur-xl",
        success: {
          iconTheme: {
            primary: "var(--color-primary)",
            secondary: "#10221c",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
