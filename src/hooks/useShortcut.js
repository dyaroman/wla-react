import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

export const useShortcut = (hotkey, callback, node = null) => {
  if (!Array.isArray(hotkey)) {
    throw new Error('"hotkey" must be an array of strings');
  }

  if (
    hotkey.some((key) => {
      if (key.length === 1) {
        return key.match(/[^A-Z0-9/]/g);
      } else {
        return !key.match(/^(CommandOrControl|Shift|Alt)$/);
      }
    })
  ) {
    throw new Error(
      `"hotkey" could contain only: 'CommandOrControl', 'Shift', 'Alt' and 'A-Z0-9/', but got ${JSON.stringify(hotkey)}`,
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
      const check = hotkey.every((key) => {
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
    [hotkey],
  );

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document;
    // attach the event listener
    targetNode && targetNode.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () =>
      targetNode && targetNode.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress, node]);
};
