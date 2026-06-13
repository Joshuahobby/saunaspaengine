"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "var(--bg-card)",
          color: "var(--text-main)",
          border: "1px solid var(--border-main)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          backdropFilter: "blur(16px)",
        },
        success: {
          iconTheme: {
            primary: "var(--color-primary)",
            secondary: "#fff",
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
