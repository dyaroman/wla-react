import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

export const useKeyPress = (hotkey = '', callback, node = null) => {
  hotkey = hotkey.replace(/ /g, '').toLowerCase();

  if (hotkey.match(/[^+a-z0-9?]/g)) {
    throw new Error(`hotkey could contain only '+a-z0-9?'`);
  }

  const keys = hotkey.split('+');
  // implement the callback ref pattern
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event) => {
      const check = keys.every((key) => {
        switch (key) {
          case 'meta':
            return event.metaKey;
          case 'ctrl':
            return event.ctrlKey;
          case 'shift':
            return event.shiftKey;
          case 'option':
          case 'alt':
            return event.altKey;
          default:
            return event.key.toLowerCase() === key;
        }
      });
      if (check) {
        callbackRef.current(event);
      }
    },
    [hotkey]
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
