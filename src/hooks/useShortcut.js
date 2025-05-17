import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

export const useShortcut = (shortcut, callback, node = null) => {
  if (!Array.isArray(shortcut)) {
    throw new Error('"shortcut" must be an array of strings');
  }

  if (
    shortcut.some((key) => {
      if (key.length === 1) {
        return key.match(/[^A-Z0-9/]/g);
      } else {
        return !key.match(/^(CommandOrControl|Shift|Alt)$/);
      }
    })
  ) {
    throw new Error(
      `"shortcut" could contain only: 'CommandOrControl', 'Shift', 'Alt' and 'A-Z0-9/', but got ${JSON.stringify(shortcut)}`,
    );
  }

  // implement the callback ref pattern
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event) => {
      const check = shortcut.every((key) => {
        switch (key) {
          case 'CommandOrControl':
            return event.metaKey || event.ctrlKey;

          case 'Shift':
            return event.shiftKey;

          case 'Alt':
            return event.altKey;

          default:
            if (key.match(/[A-Z]/)) {
              return event.code === `Key${key}`;
            } else if (key.match(/[0-9]/)) {
              return event.code === `Digit${key}`;
            } else if (key === '/') {
              return event.code === 'Slash';
            }
        }
      });
      if (check) {
        callbackRef.current(event);
      }
    },
    [shortcut],
  );

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document;
    // attach the event listener
    targetNode && targetNode.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () =>
      targetNode && targetNode.removeEventListener('keydown', handleKeyPress);
  }, [node]);
};
