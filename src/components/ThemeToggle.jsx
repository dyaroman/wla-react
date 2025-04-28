import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { triggerGtmEvent } from '../misc/functions';
import { gtmEvents } from '../misc/gtm.constants';
import { TOGGLE_THEME } from '../features/app/app.constants';

// todo: leave only auto theme switch, remove manual
export function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state['app'].theme);

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      triggerGtmEvent(gtmEvents.toggleTheme, {
        label: 'dark',
        method: 'init',
      });

      if (theme === 'dark') return;

      dispatch({
        type: TOGGLE_THEME,
        payload: 'dark',
      });
    } else {
      triggerGtmEvent(gtmEvents.toggleTheme, {
        label: 'light',
        method: 'init',
      });

      if (theme === 'light') return;

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
    const newTheme = event.matches ? 'dark' : 'light';

    dispatch({
      type: TOGGLE_THEME,
      payload: newTheme,
    });

    triggerGtmEvent(gtmEvents.toggleTheme, {
      label: newTheme,
      method: 'media-query',
    });
  }

  function onThemeToggleClick() {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch({
      type: TOGGLE_THEME,
      payload: newTheme,
    });

    triggerGtmEvent(gtmEvents.toggleTheme, {
      label: newTheme,
      method: 'toggle',
    });
  }

  return (
    <button
      className="btn btn--icon"
      data-qa="toggleTheme"
      onClick={onThemeToggleClick}
    >
      <span className="icon icon--toggle-theme" />
      toggle theme
    </button>
  );
}
