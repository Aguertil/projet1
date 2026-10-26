import { chromium, Browser, Page } from 'playwright-core';
import type { ImageFormat, ViewportType } from './types';
import chromiumPkg from '@sparticuz/chromium';

// Detect if running on Vercel
const isVercel = process.env.VERCEL === '1';

// Types pour les options de screenshot
export interface ScreenshotOptions {
  url: string;
  format?: 'PNG' | 'JPEG' | 'WEBP';
  quality?: number;
  viewportType?: 'DESKTOP' | 'MOBILE' | 'TABLET' | 'CUSTOM';
  viewportWidth?: number;
  viewportHeight?: number;
  fullPage?: boolean;
  waitForSelector?: string;
  waitForTimeout?: number;
  hideElements?: string[];
  blockCookies?: boolean;
  blockAds?: boolean;
  userAgent?: string;
}

export interface ScreenshotResult {
  buffer: Buffer;
  width: number;
  height: number;
  format: ImageFormat;
  durationMs: number;
  fileSizeBytes: number;
}

// Viewports prédéfinis
const VIEWPORTS = {
  DESKTOP: { width: 1920, height: 1080 },
  MOBILE: { width: 375, height: 667 },
  TABLET: { width: 768, height: 1024 },
};

// Browser pool pour réutiliser les instances
class BrowserPool {
  private browser: Browser | null = null;
  private isInitializing = false;
  private lastUsed = Date.now();
  private readonly IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  async getBrowser(): Promise<Browser> {
    // Nettoyer le browser s'il est inactif trop longtemps
    if (this.browser && Date.now() - this.lastUsed > this.IDLE_TIMEOUT) {
      await this.closeBrowser();
    }

    if (this.browser && this.browser.isConnected()) {
      this.lastUsed = Date.now();
      return this.browser;
    }

    if (this.isInitializing) {
      // Attendre que l'initialisation se termine
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.getBrowser();
    }

    this.isInitializing = true;

    try {
      // Use optimized Chromium for serverless environments
      const launchOptions: any = {
        headless: true,
        args: isVercel
          ? chromiumPkg.args
          : [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-gpu',
              '--no-first-run',
              '--no-zygote',
              '--single-process',
              '--disable-background-networking',
              '--disable-background-timer-throttling',
              '--disable-backgrounding-occluded-windows',
              '--disable-breakpad',
              '--disable-component-extensions-with-background-pages',
              '--disable-extensions',
              '--disable-features=TranslateUI',
              '--disable-ipc-flooding-protection',
              '--disable-renderer-backgrounding',
              '--enable-features=NetworkService,NetworkServiceInProcess',
              '--force-color-profile=srgb',
              '--hide-scrollbars',
              '--metrics-recording-only',
              '--mute-audio',
            ],
      };

      // Use serverless chromium executable path on Vercel
      if (isVercel) {
        launchOptions.executablePath = await chromiumPkg.executablePath();
      }

      this.browser = await chromium.launch(launchOptions);

      this.lastUsed = Date.now();
      return this.browser;
    } finally {
      this.isInitializing = false;
    }
  }

  async closeBrowser() {
    if (this.browser) {
      try {
        await this.browser.close();
      } catch (error) {
        console.error('Error closing browser:', error);
      }
      this.browser = null;
    }
  }

  async cleanup() {
    await this.closeBrowser();
  }
}

// Instance singleton du pool
const browserPool = new BrowserPool();

/**
 * Nettoie les ressources au shutdown
 */
process.on('SIGTERM', async () => {
  await browserPool.cleanup();
});

process.on('SIGINT', async () => {
  await browserPool.cleanup();
});

/**
 * Valide et nettoie une URL
 */
function validateUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Only HTTP and HTTPS protocols are supported');
    }
    return urlObj.toString();
  } catch (error) {
    throw new Error('Invalid URL format');
  }
}

/**
 * Capture un screenshot d'une page web
 */
export async function captureScreenshot(
  options: ScreenshotOptions
): Promise<ScreenshotResult> {
  const startTime = Date.now();
  let page: Page | null = null;

  try {
    // Valider l'URL
    const validatedUrl = validateUrl(options.url);

    // Obtenir le browser du pool
    const browser = await browserPool.getBrowser();

    // Déterminer le viewport
    let viewport = VIEWPORTS.DESKTOP;
    if (options.viewportType === 'MOBILE') {
      viewport = VIEWPORTS.MOBILE;
    } else if (options.viewportType === 'TABLET') {
      viewport = VIEWPORTS.TABLET;
    } else if (options.viewportType === 'CUSTOM' && options.viewportWidth && options.viewportHeight) {
      viewport = {
        width: options.viewportWidth,
        height: options.viewportHeight,
      };
    }

    // Créer un nouveau contexte pour isolation
    const context = await browser.newContext({
      viewport,
      userAgent:
        options.userAgent ||
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      bypassCSP: true,
      javaScriptEnabled: true,
    });

    // Bloquer les cookies si demandé
    if (options.blockCookies) {
      await context.route('**/*', (route) => {
        const resourceType = route.request().resourceType();
        if (resourceType === 'fetch' || resourceType === 'xhr') {
          route.continue({
            headers: {
              ...route.request().headers(),
              cookie: '',
            },
          });
        } else {
          route.continue();
        }
      });
    }

    // Bloquer les publicités si demandé
    if (options.blockAds) {
      await context.route('**/*', (route) => {
        const url = route.request().url();
        const adPatterns = [
          'doubleclick.net',
          'googlesyndication.com',
          'googleadservices.com',
          'facebook.net',
          'google-analytics.com',
          'googletagmanager.com',
        ];

        if (adPatterns.some((pattern) => url.includes(pattern))) {
          route.abort();
        } else {
          route.continue();
        }
      });
    }

    page = await context.newPage();

    // Naviguer vers l'URL avec timeout
    await page.goto(validatedUrl, {
      waitUntil: 'networkidle',
      timeout: options.waitForTimeout || 30000,
    });

    // Attendre un sélecteur spécifique si demandé
    if (options.waitForSelector) {
      await page.waitForSelector(options.waitForSelector, {
        timeout: 10000,
      });
    }

    // Masquer des éléments si demandé
    if (options.hideElements && options.hideElements.length > 0) {
      await page.evaluate((selectors) => {
        selectors.forEach((selector) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            (el as HTMLElement).style.display = 'none';
          });
        });
      }, options.hideElements);
    }

    // Masquer les overlays de cookies communs
    await page.evaluate(() => {
      const cookieSelectors = [
        '[class*="cookie"]',
        '[id*="cookie"]',
        '[class*="gdpr"]',
        '[id*="gdpr"]',
        '[class*="consent"]',
        '[id*="consent"]',
      ];

      cookieSelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          const text = el.textContent?.toLowerCase() || '';
          if (
            text.includes('cookie') ||
            text.includes('consent') ||
            text.includes('privacy') ||
            text.includes('gdpr')
          ) {
            (el as HTMLElement).style.display = 'none';
          }
        });
      });
    });

    // Prendre le screenshot
    const format = (options.format || 'PNG').toLowerCase() as 'png' | 'jpeg' | 'webp';
    const buffer = await page.screenshot({
      type: format,
      quality: options.quality || (format === 'jpeg' ? 80 : undefined),
      fullPage: options.fullPage || false,
    });

    // Obtenir les dimensions
    const dimensions = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    }));

    const durationMs = Date.now() - startTime;

    // Nettoyer
    await context.close();

    return {
      buffer: Buffer.from(buffer),
      width: dimensions.width,
      height: dimensions.height,
      format: options.format || 'PNG',
      durationMs,
      fileSizeBytes: buffer.length,
    };
  } catch (error) {
    console.error('Screenshot capture error:', error);
    throw error;
  } finally {
    // S'assurer que la page est fermée
    if (page && !page.isClosed()) {
      try {
        await page.close();
      } catch (error) {
        console.error('Error closing page:', error);
      }
    }
  }
}

/**
 * Vérifie si Playwright est installé
 */
export async function checkPlaywrightInstallation(): Promise<boolean> {
  try {
    const browser = await chromium.launch({ headless: true });
    await browser.close();
    return true;
  } catch (error) {
    console.error('Playwright not properly installed:', error);
    return false;
  }
}
