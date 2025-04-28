import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { hideToast, setCurrentToast } from '../features/toast/toast.actions';

// todo: rework Toast to use createPortal to body and don't render when it don't need
export function Toast() {
  const dispatch = useDispatch();
  const queue = useSelector((state) => state.toast.queue);
  const current = useSelector((state) => state.toast.current);

  useEffect(() => {
    let hideTimer, showTimer;

    if (!current && queue.length > 0) {
      const nextToast = queue[0];
      hideTimer = setTimeout(() => {
        dispatch(hideToast());
      }, 5000);

      showTimer = setTimeout(() => {
        dispatch(setCurrentToast(nextToast));
      }, 300);
    }

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
    };
  }, [queue, current, dispatch]);

  return (
    <div className={'toast' + (current ? ' show' : ' hide')}>{current}</div>
  );
}
