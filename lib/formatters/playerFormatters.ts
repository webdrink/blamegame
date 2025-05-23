/**
 * Utility functions for player management
 */

import { Player } from '../../types';

/**
 * Generate a unique ID for a player
 * @returns A unique string ID
 */
export function generatePlayerId(): string {
  return `player${Date.now()}`;
}

/**
 * Check if a name is valid for player setup
 * @param name The name to validate
 * @param existingPlayers List of existing players to check for duplicates
 * @returns Object with validation result and error message if invalid
 */
/**
 * Validates a player's name against several criteria:
 * - The name must not be empty.
 * - The name must not exceed 20 characters.
 * - The name must not duplicate any existing player's name (case-insensitive, trimmed).
 *
 * @param name - The player's name to validate.
 * @param existingPlayers - The list of existing players to check for duplicates.
 * @returns An object indicating whether the name is valid and an error message if not.
 */
export function validatePlayerName(name: string, existingPlayers: Player[]): { valid: boolean; error: string | null } {
  const trimmedName = name.trim();
  
  if (!trimmedName) {
    return { valid: false, error: "Bitte gib einen Namen ein." };
  }
  
  if (trimmedName.length > 20) {
    return { valid: false, error: "Name darf maximal 20 Zeichen lang sein." };
  }
  
  const isDuplicate = existingPlayers.some(p => p.name.trim().toLowerCase() === trimmedName.toLowerCase());
  if (isDuplicate) {
    return { valid: false, error: "Dieser Name existiert bereits." };
  }
  
  return { valid: true, error: null };
}
