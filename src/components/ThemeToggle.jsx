import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { triggerGtmEvent } from '../misc/functions';
import { TOGGLE_THEME } from '../features/app/app.constants';
import { TOGGLE_THEME_GTM_EVENT } from '../misc/gtm.constants';

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

      triggerGtmEvent(TOGGLE_THEME_GTM_EVENT, {
        label: 'dark',
        method: 'init',
      });
    } else {
      dispatch({
        type: TOGGLE_THEME,
        payload: 'light',
      });

      triggerGtmEvent(TOGGLE_THEME_GTM_EVENT, {
        label: 'light',
        method: 'init',
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

    triggerGtmEvent(TOGGLE_THEME_GTM_EVENT, {
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

    triggerGtmEvent(TOGGLE_THEME_GTM_EVENT, {
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
