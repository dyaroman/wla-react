import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { hideToast, setCurrentToast } from '../features/toast/toast.actions';

export function Toast() {
  const dispatch = useDispatch();
  const queue = useSelector((state) => state.toast.queue);
  const current = useSelector((state) => state.toast.current);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    let hideTimer, showTimer;

    if (!current && queue.length > 0) {
      const nextToast = queue[0];
      showTimer = setTimeout(() => {
        dispatch(setCurrentToast(nextToast));
      }, 300);
    }

    if (current) {
      setVisible(true);
      hideTimer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          dispatch(hideToast());
        }, 300); // Wait for animation to complete before hiding
      }, 5000);
    }

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
    };
  }, [queue, current, dispatch]);

  // Don't render anything if there's no toast and no queue
  if (!current && queue.length === 0) {
    return null;
  }

  // Use createPortal to render to body
  return mounted
    ? createPortal(
        <div className={`toast ${visible ? 'show' : 'hide'}`}>{current}</div>,
        document.body,
      )
    : null;
}
