import React, { createContext, useCallback, useContext, useState } from "react";

type Toast = {
  id: string;
  message: string;
  type?: "info" | "success" | "error";
  style?: React.CSSProperties;
  anchored?: boolean;
};

type ToastContextType = {
  push: (
    message: string,
    type?: Toast["type"],
    anchor?: HTMLElement | null
  ) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback(
    (
      message: string,
      type: Toast["type"] = "info",
      anchor?: HTMLElement | null
    ) => {
      const id = Math.random().toString(36).substring(2, 9);
      let style: React.CSSProperties | undefined;
      let anchored = false;
      if (anchor) {
        try {
          const rect = anchor.getBoundingClientRect();
          // position to the right of the anchor with small offset
          style = {
            position: "absolute",
            top: rect.top + window.scrollY + rect.height / 2,
            left: rect.right + window.scrollX + 8,
            transform: "translateY(-50%)",
          };
          anchored = true;
        } catch (e) {
          // ignore and fall back to top-right
        }
      }

      setToasts((t) => [...t, { id, message, type, style, anchored }]);
      window.setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 3500);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div
        className="toast-root"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast toast-${t.type} ${
              t.anchored ? "toast-anchored" : ""
            }`}
            style={t.style}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

export default ToastProvider;
