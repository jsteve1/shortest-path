import { writable, get } from 'svelte/store';
import { pathfindingStore } from './pathfindingStore';

function createThemeStore() {
  const store = writable(false);
  const { subscribe, set } = store;

  return {
    subscribe,
    toggle: () => {
      // First, stop the algorithm if it's running
      const state = pathfindingStore.getState();
      if (state.isRunning) {
        pathfindingStore.stopAlgorithm();
        pathfindingStore.setIsRunning(false);
        pathfindingStore.clearPath();
      }

      // Then update the theme after a small delay
      setTimeout(() => {
        const newMode = !get(store);
        set(newMode);
        if (typeof window !== 'undefined') {
          localStorage.setItem('darkMode', String(newMode));
          if (newMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      }, 50);
    },
    initialize: () => {
      if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const storedTheme = localStorage.getItem('darkMode');
        const isDark = storedTheme ? storedTheme === 'true' : prefersDark;
        set(isDark);
        if (isDark) {
          document.documentElement.classList.add('dark');
        }
      }
    }
  };
}

export const themeStore = createThemeStore(); 