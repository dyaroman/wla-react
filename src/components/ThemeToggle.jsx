import { useEffect } from 'react';

import { triggerGtmEvent } from '../misc/functions';
import { gtmEvents } from '../misc/gtm.constants';

export function ThemeToggle() {
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      triggerGtmEvent(gtmEvents.toggleTheme, {
        label: 'dark',
        method: 'init',
      });
    } else {
      triggerGtmEvent(gtmEvents.toggleTheme, {
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

  function prefersColorSchemeHandler(event) {
    const newTheme = event.matches ? 'dark' : 'light';

    triggerGtmEvent(gtmEvents.toggleTheme, {
      label: newTheme,
      method: 'media-query',
    });
  }
}
