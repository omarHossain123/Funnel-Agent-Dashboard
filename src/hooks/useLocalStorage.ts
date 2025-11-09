import { useState } from "react";

/**
 * Custom hook for localStorage with automatic JSON serialization
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook for managing session persistence
 */
export function useSessionPersistence(
  sessionKey: string = "ai-dashboard-session"
) {
  const [session, setSession] = useLocalStorage(sessionKey, {
    currentAgent: "market-research",
    sessions: {},
    lastUpdated: Date.now(),
  });

  const updateSession = (updates: any) => {
    setSession((prev: any) => ({
      ...prev,
      ...updates,
      lastUpdated: Date.now(),
    }));
  };

  const clearSession = () => {
    setSession({
      currentAgent: "market-research",
      sessions: {},
      lastUpdated: Date.now(),
    });
  };

  return { session, updateSession, clearSession };
}
