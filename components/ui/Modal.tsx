"use client";

import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl",
          className
        )}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink-950">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="rounded-full p-1.5 text-ink-600 hover:bg-surface-100"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default Modal;