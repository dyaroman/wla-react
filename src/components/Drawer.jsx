import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import { closeDrawer } from '../features/drawer/drawer.actions';

export function Drawer({
  drawerId,
  position = 'right',
  maxSize,
  title = '',
  showHeader = true,
  closeOnBackdropClick = true,
  closeOnEsc = true,
  children,
}) {
  const dispatch = useDispatch();
  const openDrawerId = useSelector((state) => state['drawer'].openDrawerId);
  const isOpen = drawerId === openDrawerId;
  const drawerRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);
  const scrollPositionRef = useRef(0);

  // Track real visibility state for animations
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

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && closeOnEsc && isOpen) {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      } else if (event.key === 'Tab' && isOpen) {
        handleTabKey(event);
      }
    };

    // Focus trap handler
    const handleTabKey = (event) => {
      if (!isOpen || !drawerRef.current) return;

      const focusableElements = drawerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // If shifting backwards and on the first element, move to the last element
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      // If moving forwards and on the last element, cycle to first element
      else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEsc]);

  // Handle focus management and scroll locking
  useEffect(() => {
    if (isOpen) {
      // Store current focus and scroll position
      previouslyFocusedElementRef.current = document.activeElement;
      scrollPositionRef.current = window.pageYOffset;

      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';

      // Focus the drawer after it's rendered
      setTimeout(() => {
        if (drawerRef.current) {
          drawerRef.current.focus();
        }
      }, 0);
    } else {
      // Restore body scrolling
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      // Restore scroll position
      window.scrollTo(0, scrollPositionRef.current);

      // Return focus to the element that opened the drawer
      if (
        previouslyFocusedElementRef.current &&
        typeof previouslyFocusedElementRef.current.focus === 'function'
      ) {
        setTimeout(() => {
          previouslyFocusedElementRef.current.focus();
        }, 0);
      }
    }

    // Clean up on unmount
    return () => {
      if (isOpen) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollPositionRef.current);
      }
    };
  }, [isOpen]);

  function onClose() {
    dispatch(closeDrawer());
  }

  // Only render if visible is true (either opening or closing with animation)
  if (!isVisible && !isOpen) return null;

  // Determine animation class
  const backdropClass = `drawer-backdrop ${isOpen ? 'fade-in' : 'fade-out'}`;
  const drawerClass = `drawer drawer--${position} ${isOpen ? `slide-${position}-in` : `slide-${position}-out`}`;

  // Drawer content
  const drawerContent = (
    <>
      <div
        className={backdropClass}
        onClick={closeOnBackdropClick ? onClose : null}
      />
      <div
        ref={drawerRef}
        className={drawerClass}
        tabIndex={-1}
        role="dialog"
        aria-labelledby="drawer-title"
        style={{
          maxWidth:
            position === 'right' || position === 'left'
              ? (maxSize ?? '50vw')
              : null,
          maxHeight:
            position === 'top' || position === 'bottom'
              ? (maxSize ?? '50vh')
              : null,
        }}
      >
        {showHeader && (
          <div className="drawer__header">
            <h3 className="drawer__title" id="drawer-title">
              {title}
            </h3>
            <button
              className="drawer__close"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        )}
        <div className="drawer__content">{children}</div>
      </div>
    </>
  );

  // Use Portal to render at body level
  return createPortal(drawerContent, document.body);
}
