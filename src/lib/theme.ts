export type ThemeMode = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'sf_theme';

export function resolveIsDarkMode(theme: ThemeMode, systemPrefersDark: boolean): boolean {
  return theme === 'dark' || (theme === 'system' && systemPrefersDark);
}

export function readStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
  if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  return 'system';
}

export function readSystemPrefersDark(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyThemeToDocument(isDarkMode: boolean): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (isDarkMode) {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
}

/** Inline script run in <head> before first paint to prevent light-mode flash. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var dark=t==='dark'||(t!=='light'&&d);var r=document.documentElement;if(dark){r.classList.add('dark');r.style.colorScheme='dark';}else{r.classList.remove('dark');r.style.colorScheme='light';}}catch(e){}})();`;
