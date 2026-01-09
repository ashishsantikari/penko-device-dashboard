/**
 * Utility functions for generating realistic random data
 */

/**
 * Generate a random number within a range
 */
export const randomInRange = (min: number, max: number, decimals: number = 0): number => {
  const random = Math.random() * (max - min) + min;
  return Number(random.toFixed(decimals));
};

/**
 * Generate a random integer within a range (inclusive)
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Randomly select an item from an array
 */
export const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Generate a smooth transition value (prevents jumpy changes)
 */
export const smoothTransition = (
  current: number,
  target: number,
  maxChange: number
): number => {
  const diff = target - current;
  const change = Math.max(-maxChange, Math.min(maxChange, diff));
  return current + change;
};

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Generate a random boolean with a given probability
 */
export const randomBool = (probability: number = 0.5): boolean => {
  return Math.random() < probability;
};

/**
 * Generate a realistic timestamp offset (for historical data)
 */
export const generateTimestamp = (offsetMs: number = 0): Date => {
  return new Date(Date.now() + offsetMs);
};

/**
 * Format a number to a specific decimal places
 */
export const toFixed = (value: number, decimals: number): number => {
  return Number(value.toFixed(decimals));
};
