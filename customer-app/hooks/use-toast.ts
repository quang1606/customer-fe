"use client";

import { useState, useEffect, useCallback } from "react";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

let toastCount = 0;
const listeners: Set<(toast: Toast) => void> = new Set();

export function toast({ title, description, variant = "default" }: Omit<Toast, "id">) {
  const id = String(++toastCount);
  const t: Toast = { id, title, description, variant };
  listeners.forEach((l) => l(t));
  return t;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Toast) => {
    setToasts((prev) => [...prev, t]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== t.id));
    }, 4000);
  }, []);

  useEffect(() => {
    listeners.add(addToast);
    return () => {
      listeners.delete(addToast);
    };
  }, [addToast]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, toast, dismiss };
}
