/**
 * Utility functions for localStorage operations
 */

/**
 * Get a value from localStorage with type safety
 * @param key The localStorage key
 * @param defaultValue Default value if key doesn't exist
 * @returns The stored value or default value
 */
/**
 * Retrieves a value from localStorage by the specified key and parses it as JSON.
 * If the key does not exist or an error occurs (e.g., invalid JSON or localStorage is unavailable),
 * the provided default value is returned instead.
 *
 * @template T - The expected type of the value to retrieve.
 * @param {string} key - The key under which the value is stored in localStorage.
 * @param {T} defaultValue - The value to return if the key does not exist or an error occurs.
 * @returns {T} The parsed value from localStorage, or the default value if not found or on error.
 */
export const getStorageValue = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Save a value to localStorage with type safety
 * @param key The localStorage key
 * @param value The value to store
 */
export const setStorageValue = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error saving ${key} to localStorage:`, error);
  }
};

/**
 * Remove a value from localStorage
 * @param key The localStorage key to remove
 */
export const removeStorageValue = (key: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Error removing ${key} from localStorage:`, error);
  }
};
