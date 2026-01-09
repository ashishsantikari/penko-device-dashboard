import { useEffect, useCallback, useState } from 'react';

interface KeyMap {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  action: () => void;
  description: string;
}

export const useKeyMap = (keyMaps: KeyMap[]) => {
  const [showHelp, setShowHelp] = useState(false);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Show/hide help with '?'
      if (event.key === '?' && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
        event.preventDefault();
        setShowHelp(prev => !prev);
        return;
      }

      // Check for matching keymaps
      for (const keyMap of keyMaps) {
        const keyMatches = event.key.toLowerCase() === keyMap.key.toLowerCase();
        const ctrlMatches = !!keyMap.ctrl === event.ctrlKey;
        const altMatches = !!keyMap.alt === event.altKey;
        const shiftMatches = !!keyMap.shift === event.shiftKey;
        const metaMatches = !!keyMap.meta === event.metaKey;

        if (keyMatches && ctrlMatches && altMatches && shiftMatches && metaMatches) {
          event.preventDefault();
          keyMap.action();
          break;
        }
      }
    },
    [keyMaps]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { showHelp, setShowHelp };
};

export const toggleFullscreen = async (element?: HTMLElement | null) => {
  try {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (element) {
        await element.requestFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } else {
      // Exit fullscreen
      await document.exitFullscreen();
    }
  } catch (error) {
    console.error('Fullscreen error:', error);
  }
};

export const isFullscreen = () => !!document.fullscreenElement;

export type { KeyMap };
