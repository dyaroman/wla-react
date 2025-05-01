import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export function Modal({ isOpen, onClose, closeOnEsc = true, title, children }) {
  const dialogRef = useRef(null);
  const previousBodyStyle = useRef(null);

  // Track the real visibility state for animations
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    // Store current body style
    previousBodyStyle.current = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      width: document.body.style.width,
      top: document.body.style.top,
    };

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${window.scrollY}px`;

    // Focus trap
    const focusableElements = dialogRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstFocusableElement = focusableElements?.[0];
    const lastFocusableElement =
      focusableElements?.[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && closeOnEsc && isOpen) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      } else if (e.key === 'Tab' && isOpen) {
        handleTabKey(e);
      }
    };

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    firstFocusableElement?.focus();

    return () => {
      // Restore body scroll
      document.body.style.overflow = previousBodyStyle.current.overflow;
      document.body.style.position = previousBodyStyle.current.position;
      document.body.style.width = previousBodyStyle.current.width;
      document.body.style.top = previousBodyStyle.current.top;
      window.scrollTo(0, parseInt(previousBodyStyle.current.top || '0') * -1);

      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if ((!isVisible && !isOpen) || !children) return null;

  return createPortal(
    <div
      className={`modal ${isOpen ? 'fade-in' : 'fade-out'}`}
      onClick={onClose}
    >
      <div
        className="modal__content"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <>
            <div className="modal__header">
              <h3 className="modal__title">{title}</h3>
            </div>
          </>
        )}
        <div className="modal__content-inner">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
