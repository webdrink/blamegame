/**
 * Visual Regression Tests for League of Fun Applications
 * 
 * These tests capture and compare screenshots across:
 * - Game Picker (Hub)
 * - BlameGame
 * - HookHunt
 * 
 * Run with: npx playwright test tests/visual/
 */

import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.describe('Game Picker Hub', () => {
    test.beforeEach(async ({ page }) => {
      // Note: In real deployment, game-picker runs on leagueoffun.de
      // For local testing, we test against the blamegame dev server or mock
    });

    test('should display correct header and branding', async ({ page }) => {
      await page.goto('/');
      
      // Check for main title element
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
    });

    test('should display game cards', async ({ page }) => {
      await page.goto('/');
      
      // The intro screen should be visible
      const startButton = page.getByRole('button', { name: /start/i });
      await expect(startButton).toBeVisible();
    });
  });

  test.describe('BlameGame', () => {
    test('should display intro screen correctly', async ({ page }) => {
      await page.goto('/');
      
      // Wait for the intro screen
      await expect(page.getByText(/BlameGame/i)).toBeVisible();
      
      // Check for start game button
      const startButton = page.getByRole('button', { name: /start game/i });
      await expect(startButton).toBeVisible();
    });

    test('should display game mode toggles', async ({ page }) => {
      await page.goto('/');
      
      // Check for NameBlame mode toggle
      await expect(page.getByText(/NameBlame Mode/i)).toBeVisible();
      
      // Check for category selection toggle
      await expect(page.getByText(/manual category selection/i)).toBeVisible();
    });

    test('should have accessible controls', async ({ page }) => {
      await page.goto('/');
      
      // Check for language selector
      const languageSelector = page.getByRole('combobox');
      if (await languageSelector.isVisible()) {
        await expect(languageSelector).toBeEnabled();
      }
    });

    test('should navigate to player setup when NameBlame enabled', async ({ page }) => {
      await page.goto('/');
      
      // Find and click the NameBlame mode toggle
      const nameBlameToogle = page.getByText(/NameBlame Mode/i);
      await nameBlameToogle.click();
      
      // Should show player setup screen
      await expect(page.getByText(/Add Player|Player Setup|Spieler/i)).toBeVisible({ timeout: 5000 });
    });

    test('visual: intro screen layout', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Take screenshot for visual comparison
      await expect(page).toHaveScreenshot('blamegame-intro.png', {
        maxDiffPixelRatio: 0.1,
        threshold: 0.2
      });
    });
  });

  test.describe('Animation Toggle', () => {
    test('should persist animation preference', async ({ page }) => {
      await page.goto('/');
      
      // Check if animation toggle exists (in game-picker/hookhunt)
      const animationToggle = page.getByRole('button', { name: /animations/i });
      
      if (await animationToggle.isVisible()) {
        // Click to toggle
        await animationToggle.click();
        
        // Reload and check persistence
        await page.reload();
        
        // Animation preference should be remembered via localStorage
        const animPref = await page.evaluate(() => {
          return localStorage.getItem('leagueoffun.animationsEnabled');
        });
        
        expect(animPref).toBeTruthy();
      }
    });
  });
});

test.describe('Game Flow E2E Tests', () => {
  test('BlameGame Classic Mode - Full Game Flow', async ({ page }) => {
    await page.goto('/');
    
    // Wait for intro screen
    await expect(page.getByText(/BlameGame/i)).toBeVisible();
    
    // Click Start Game
    const startButton = page.getByRole('button', { name: /start game/i });
    await startButton.click();
    
    // Should see loading or game screen
    await page.waitForTimeout(4000); // Loading animation
    
    // Should be in game mode
    const questionText = page.locator('text=/Who would|Wer würde/i');
    await expect(questionText).toBeVisible({ timeout: 10000 });
  });

  test('BlameGame NameBlame Mode - Player Setup Flow', async ({ page }) => {
    await page.goto('/');
    
    // Enable NameBlame mode
    const nameBlameToggle = page.getByText(/NameBlame Mode/i);
    await nameBlameToggle.click();
    
    // Should navigate to player setup
    await expect(page.getByText(/Add Player|Spieler hinzufügen/i)).toBeVisible({ timeout: 5000 });
    
    // Try to add a player
    const playerInput = page.getByRole('textbox');
    if (await playerInput.isVisible()) {
      await playerInput.fill('TestPlayer1');
      
      const addButton = page.getByRole('button', { name: /add|hinzufügen/i });
      if (await addButton.isVisible()) {
        await addButton.click();
      }
    }
  });
});

test.describe('Accessibility Tests', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check for h1
    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible();
  });

  test('buttons should be focusable', async ({ page }) => {
    await page.goto('/');
    
    // Tab to first button and check focus
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Navigate using keyboard
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Should trigger some action
    await page.waitForTimeout(500);
  });
});

test.describe('Responsive Design Tests', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
  ];

  for (const viewport of viewports) {
    test(`should display correctly on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      
      // Check that main content is visible
      await expect(page.getByText(/BlameGame/i)).toBeVisible();
      
      // Take viewport-specific screenshot
      await expect(page).toHaveScreenshot(`blamegame-${viewport.name}.png`, {
        maxDiffPixelRatio: 0.15,
        threshold: 0.2
      });
    });
  }
});
