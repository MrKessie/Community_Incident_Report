import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const TOAST_LIFETIME_MS = 3800;

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = 'info', title, message }) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToasts((previous) => [...previous, { id, type, title, message }]);

      window.setTimeout(() => {
        removeToast(id);
      }, TOAST_LIFETIME_MS);
    },
    [removeToast],
  );

  const value = useMemo(
    () => ({
      showToast,
      success: (title, message) => showToast({ type: 'success', title, message }),
      error: (title, message) => showToast({ type: 'error', title, message }),
      info: (title, message) => showToast({ type: 'info', title, message }),
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="toast-stack" aria-live="polite" aria-label="Notifications">
        {toasts.map((toast) => (
          <article key={toast.id} className={`toast-item toast-${toast.type}`}>
            <div>
              <h4>{toast.title}</h4>
              {toast.message && <p>{toast.message}</p>}
            </div>
            <button type="button" onClick={() => removeToast(toast.id)} aria-label="Dismiss notification">
              x
            </button>
          </article>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }

  return context;
}
