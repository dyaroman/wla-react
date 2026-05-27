import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { hideToast } from '../features/toast/toast.slice';

export function Toast() {
  const dispatch = useDispatch();
  const queue = useSelector((state) => state.toast.queue);
  const activeToasts = useSelector((state) => state.toast.active);
  const [visibleToasts, setVisibleToasts] = useState({});

  useEffect(() => {
    // Process new toasts that have been added
    activeToasts.forEach((toast) => {
      // Only set up timers for toasts that don't already have a visibility state
      if (visibleToasts[toast.id] === undefined) {
        // Set toast to visible
        setVisibleToasts((prev) => ({
          ...prev,
          [toast.id]: true,
        }));

        // Set a timer to hide this specific toast
        setTimeout(() => {
          setVisibleToasts((prev) => ({
            ...prev,
            [toast.id]: false,
          }));

          // Wait for animation to complete before removing
          setTimeout(() => {
            dispatch(hideToast());
          }, 300);
        }, 5000);
      }
    });

    // Clean up the visibility state for toasts that are no longer active
    setVisibleToasts((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((id) => {
        if (!activeToasts.some((toast) => toast.id === id)) {
          delete newState[id];
        }
      });
      return newState;
    });
  }, [activeToasts]);

  // Don't render anything if there are no active toasts and no queue
  if (activeToasts.length === 0 && queue.length === 0) {
    return null;
  }

  // Use createPortal to render to body
  return createPortal(
    <div className="toast-container">
      {activeToasts.map((toast) => {
        const toastId = toast.id;
        const isVisible = visibleToasts[toastId];
        const toastType = toast.type || 'default';
        const message = typeof toast === 'string' ? toast : toast.message;

        return (
          <div
            key={toastId}
            className={`toast ${toastType === 'default' ? '' : `toast--${toastType}`} ${isVisible ? 'show' : 'hide'}`}
          >
            {message}
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
