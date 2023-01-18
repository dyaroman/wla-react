import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { TOGGLE_THEME } from '../features/app/app.constants';

export function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state['app'].theme);

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      dispatch({
        type: TOGGLE_THEME,
        payload: 'dark',
      });
    } else {
      dispatch({
        type: TOGGLE_THEME,
        payload: 'light',
      });
    }

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', prefersColorSchemeHandler);

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', prefersColorSchemeHandler);
    };
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  function prefersColorSchemeHandler(event) {
    dispatch({
      type: TOGGLE_THEME,
      payload: event.matches ? 'dark' : 'light',
    });
  }

  function onThemeToggleClick() {
    dispatch({
      type: TOGGLE_THEME,
      payload: theme === 'dark' ? 'light' : 'dark',
    });
  }

  return (
    <button className="theme-toggle" onClick={onThemeToggleClick}>
      theme toggle
    </button>
  );
}
