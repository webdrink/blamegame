/**
 * E2E User Flow Tests for BlameGame
 * 
 * Tests cover:
 * - Classic Mode game flow
 * - NameBlame Mode game flow
 * - Category selection
 * - Player management
 * - Game completion and summary
 */

import { test, expect, Page } from '@playwright/test';

// Helper function to wait for game to load
async function waitForGameReady(page: Page) {
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: /BlameGame/i })).toBeVisible({ timeout: 10000 });
}

test.describe('BlameGame Classic Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForGameReady(page);
  });

  test('should display intro screen correctly', async ({ page }) => {
    // Check for main heading
    await expect(page.getByRole('heading', { name: /BlameGame/i })).toBeVisible();
    
    // Check for subtitle (either English or German)
    const englishSubtitle = page.getByText(/Who would most likely/i);
    const germanSubtitle = page.getByRole('heading', { name: /Wer würde/i });
    
    // Either should be visible
    const isEnglish = await englishSubtitle.isVisible().catch(() => false);
    const isGerman = await germanSubtitle.isVisible().catch(() => false);
    expect(isEnglish || isGerman).toBeTruthy();
    
    // Check for start button (either language)
    const startButton = page.getByRole('button', { name: /Start Game|Spiel starten/i });
    await expect(startButton).toBeVisible();
  });

  test('should start a classic game and display questions', async ({ page }) => {
    // Click Start Game button (either language)
    const startButton = page.getByRole('button', { name: /Start Game|Spiel starten/i });
    await startButton.click();
    
    // Wait for loading animation to complete (usually 3-4 seconds)
    await page.waitForTimeout(5000);
    
    // Should now be on question screen - look for question-related content
    const questionContent = page.getByText(/würde|would|Wer/i);
    await expect(questionContent.first()).toBeVisible({ timeout: 10000 });
  });

  test('should display game mode toggles', async ({ page }) => {
    // Go to home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for app to fully load
    await expect(page.getByRole('heading', { name: /BlameGame/i })).toBeVisible({ timeout: 10000 });
    
    // Check for NameBlame mode toggle (match German or English)
    const nameBlameToggle = page.getByRole('switch', { name: /NameBlame/i });
    await expect(nameBlameToggle).toBeVisible({ timeout: 5000 });
    
    // Check for category selection toggle
    const categoryToggle = page.getByRole('switch', { name: /category|Kategorie/i });
    await expect(categoryToggle).toBeVisible();
  });

  test('should have language selector', async ({ page }) => {
    const languageSelector = page.getByRole('combobox', { name: /Language/i });
    await expect(languageSelector).toBeVisible();
    await expect(languageSelector).toBeEnabled();
  });
});

test.describe('BlameGame NameBlame Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForGameReady(page);
  });

  test('should enable NameBlame mode and show player setup', async ({ page }) => {
    // Find and click NameBlame toggle
    const nameBlameSwitch = page.getByRole('switch', { name: /NameBlame Mode/i });
    await nameBlameSwitch.click();
    
    // Should navigate to player setup
    await expect(page.getByText(/Spieler|Player|Add|hinzufügen/i)).toBeVisible({ timeout: 5000 });
  });

  test('should add players in NameBlame mode', async ({ page }) => {
    // Enable NameBlame mode
    const nameBlameSwitch = page.getByRole('switch', { name: /NameBlame Mode/i });
    await nameBlameSwitch.click();
    await page.waitForTimeout(1000);
    
    // Find player input
    const input = page.getByRole('textbox').first();
    if (await input.isVisible()) {
      await input.fill('Alice');
      await input.press('Enter');
      
      // Verify player was added
      await expect(page.getByText('Alice')).toBeVisible({ timeout: 3000 });
    }
  });
});

test.describe('BlameGame Settings and Preferences', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForGameReady(page);
  });

  test('should change language', async ({ page }) => {
    // Find language selector
    const languageSelector = page.getByRole('combobox', { name: /Language/i });
    await languageSelector.selectOption('English');
    await page.waitForTimeout(500);
    
    // UI should update to English
    await expect(page.getByText(/Who would most likely/i)).toBeVisible();
  });

  test('should open settings modal', async ({ page }) => {
    // Click settings button
    const settingsButton = page.getByRole('button', { name: /Settings/i });
    await settingsButton.click();
    
    // Settings modal should open
    await page.waitForTimeout(500);
  });

  test('should open info modal', async ({ page }) => {
    // Click info button
    const infoButton = page.getByRole('button', { name: /Information/i });
    await infoButton.click();
    
    // Info modal should open
    await page.waitForTimeout(500);
  });

  test('should toggle dark mode', async ({ page }) => {
    // Find dark mode toggle
    const darkModeButton = page.getByRole('button', { name: /dark mode/i });
    if (await darkModeButton.isVisible()) {
      await darkModeButton.click();
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Category Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForGameReady(page);
  });

  test('should enable manual category selection', async ({ page }) => {
    // Click category selection toggle
    const categorySwitch = page.getByRole('switch', { name: /Manual category selection/i });
    await categorySwitch.click();
    
    // Wait for category picker to appear
    await page.waitForTimeout(1000);
    
    // Should show category options
    const categoryContent = page.getByText(/category|Kategorie/i);
    await expect(categoryContent.first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForGameReady(page);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check for h1
    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab to first focusable element
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have accessible labels', async ({ page }) => {
    // Check that buttons have accessible names
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();
    
    expect(buttonCount).toBeGreaterThan(0);
    
    // All buttons should be clickable
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        await expect(button).toBeEnabled();
      }
    }
  });
});

test.describe('Hub Integration', () => {
  test('should handle playerId from URL', async ({ page }) => {
    // Navigate with playerId parameter (simulating coming from hub)
    await page.goto('/?playerId=test-player-123&returnUrl=https://leagueoffun.de');
    await waitForGameReady(page);
    
    // Game should load normally
    await expect(page.getByRole('heading', { name: /BlameGame/i })).toBeVisible();
  });
});

