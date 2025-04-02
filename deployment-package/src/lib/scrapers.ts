import puppeteer from 'puppeteer';

// Define interfaces
export interface ProductSource {
  id?: number;
  name: string;
  price: number;
  source: string;
  url: string;
  reliability: number;
  shipping: number;
  total: number;
  image?: string;
}

export interface ScraperResult {
  success: boolean;
  results: ProductSource[];
  error?: string;
}

// Base scraper class that all platform-specific scrapers will extend
export abstract class BaseScraper {
  protected browser: puppeteer.Browser | null = null;
  protected reliability: number;
  protected source: string;
  
  constructor(source: string, reliability: number) {
    this.source = source;
    this.reliability = reliability;
  }
  
  // Initialize browser instance
  protected async initBrowser(): Promise<puppeteer.Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    return this.browser;
  }
  
  // Close browser instance
  public async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
  
  // Abstract method that each platform-specific scraper must implement
  public abstract search(query: string): Promise<ScraperResult>;
  
  // Helper method to calculate total price
  protected calculateTotal(price: number, shipping: number): number {
    return parseFloat((price + shipping).toFixed(2));
  }
  
  // Helper method to extract price from string
  protected extractPrice(priceText: string): number {
    const match = priceText.match(/[\d,]+\.\d{2}/);
    if (match) {
      return parseFloat(match[0].replace(/,/g, ''));
    }
    return 0;
  }
}

// Amazon scraper implementation
export class AmazonScraper extends BaseScraper {
  constructor() {
    super('Amazon', 4.8);
  }
  
  public async search(query: string): Promise<ScraperResult> {
    try {
      const browser = await this.initBrowser();
      const page = await browser.newPage();
      
      // Set user agent to avoid detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Navigate to Amazon search page
      await page.goto(`https://www.amazon.com/s?k=${encodeURIComponent(query)}`, {
        waitUntil: 'networkidle2'
      });
      
      // Wait for search results to load
      await page.waitForSelector('.s-result-item');
      
      // Extract product information
      const products = await page.evaluate((reliability) => {
        const items = Array.from(document.querySelectorAll('.s-result-item[data-asin]:not([data-asin=""])'));
        return items.slice(0, 5).map((item, index) => {
          const nameElement = item.querySelector('h2 .a-link-normal');
          const priceElement = item.querySelector('.a-price .a-offscreen');
          const linkElement = item.querySelector('h2 .a-link-normal');
          const imageElement = item.querySelector('img.s-image');
          
          // Extract shipping information
          let shipping = 0;
          const shippingElement = item.querySelector('.a-color-secondary .a-row');
          if (shippingElement && shippingElement.textContent?.includes('shipping')) {
            const shippingText = shippingElement.textContent;
            const shippingMatch = shippingText.match(/\$[\d.]+/);
            if (shippingMatch) {
              shipping = parseFloat(shippingMatch[0].replace('$', ''));
            }
          }
          
          const name = nameElement ? nameElement.textContent?.trim() || 'Unknown Product' : 'Unknown Product';
          const priceText = priceElement ? priceElement.textContent || '$0.00' : '$0.00';
          const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
          const url = linkElement ? linkElement.getAttribute('href') || '#' : '#';
          const image = imageElement ? imageElement.getAttribute('src') || undefined : undefined;
          
          return {
            id: index + 1,
            name,
            price,
            source: 'Amazon',
            url: url.startsWith('http') ? url : `https://www.amazon.com${url}`,
            reliability,
            shipping,
            total: price + shipping,
            image
          };
        });
      }, this.reliability);
      
      await page.close();
      
      return {
        success: true,
        results: products
      };
    } catch (error) {
      console.error('Amazon scraping error:', error);
      return {
        success: false,
        results: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Walmart scraper implementation
export class WalmartScraper extends BaseScraper {
  constructor() {
    super('Walmart', 4.5);
  }
  
  public async search(query: string): Promise<ScraperResult> {
    try {
      const browser = await this.initBrowser();
      const page = await browser.newPage();
      
      // Set user agent to avoid detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Navigate to Walmart search page
      await page.goto(`https://www.walmart.com/search?q=${encodeURIComponent(query)}`, {
        waitUntil: 'networkidle2'
      });
      
      // Wait for search results to load
      await page.waitForSelector('[data-testid="product-results"]');
      
      // Extract product information
      const products = await page.evaluate((reliability) => {
        const items = Array.from(document.querySelectorAll('[data-testid="product-results"] [data-item-id]'));
        return items.slice(0, 5).map((item, index) => {
          const nameElement = item.querySelector('[data-automation-id="product-title"]');
          const priceElement = item.querySelector('[data-automation-id="product-price"]');
          const linkElement = item.querySelector('a[link-identifier="linkText"]');
          const imageElement = item.querySelector('img[data-testid="product-image"]');
          
          // Extract shipping information
          let shipping = 0;
          const shippingElement = item.querySelector('[data-automation-id="fulfillment-shipping"]');
          if (shippingElement) {
            const shippingText = shippingElement.textContent || '';
            if (shippingText.includes('shipping')) {
              const shippingMatch = shippingText.match(/\$[\d.]+/);
              if (shippingMatch) {
                shipping = parseFloat(shippingMatch[0].replace('$', ''));
              }
            }
          }
          
          const name = nameElement ? nameElement.textContent?.trim() || 'Unknown Product' : 'Unknown Product';
          const priceText = priceElement ? priceElement.textContent || '$0.00' : '$0.00';
          const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
          const url = linkElement ? linkElement.getAttribute('href') || '#' : '#';
          const image = imageElement ? imageElement.getAttribute('src') || undefined : undefined;
          
          return {
            id: index + 1,
            name,
            price,
            source: 'Walmart',
            url: url.startsWith('http') ? url : `https://www.walmart.com${url}`,
            reliability,
            shipping,
            total: price + shipping,
            image
          };
        });
      }, this.reliability);
      
      await page.close();
      
      return {
        success: true,
        results: products
      };
    } catch (error) {
      console.error('Walmart scraping error:', error);
      return {
        success: false,
        results: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// eBay scraper implementation
export class EbayScraper extends BaseScraper {
  constructor() {
    super('eBay', 4.2);
  }
  
  public async search(query: string): Promise<ScraperResult> {
    try {
      const browser = await this.initBrowser();
      const page = await browser.newPage();
      
      // Set user agent to avoid detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Navigate to eBay search page
      await page.goto(`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`, {
        waitUntil: 'networkidle2'
      });
      
      // Wait for search results to load
      await page.waitForSelector('.s-item');
      
      // Extract product information
      const products = await page.evaluate((reliability) => {
        const items = Array.from(document.querySelectorAll('.s-item'));
        return items.slice(1, 6).map((item, index) => { // Skip first item as it's usually a header
          const nameElement = item.querySelector('.s-item__title');
          const priceElement = item.querySelector('.s-item__price');
          const linkElement = item.querySelector('.s-item__link');
          const imageElement = item.querySelector('.s-item__image-img');
          
          // Extract shipping information
          let shipping = 0;
          const shippingElement = item.querySelector('.s-item__shipping');
          if (shippingElement) {
            const shippingText = shippingElement.textContent || '';
            if (shippingText.includes('Free')) {
              shipping = 0;
            } else {
              const shippingMatch = shippingText.match(/\$[\d.]+/);
              if (shippingMatch) {
                shipping = parseFloat(shippingMatch[0].replace('$', ''));
              }
            }
          }
          
          const name = nameElement ? nameElement.textContent?.trim() || 'Unknown Product' : 'Unknown Product';
          const priceText = priceElement ? priceElement.textContent || '$0.00' : '$0.00';
          const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
          const url = linkElement ? linkElement.getAttribute('href') || '#' : '#';
          const image = imageElement ? imageElement.getAttribute('src') || undefined : undefined;
          
          return {
            id: index + 1,
            name,
            price,
            source: 'eBay',
            url,
            reliability,
            shipping,
            total: price + shipping,
            image
          };
        });
      }, this.reliability);
      
      await page.close();
      
      return {
        success: true,
        results: products
      };
    } catch (error) {
      console.error('eBay scraping error:', error);
      return {
        success: false,
        results: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Factory function to create scrapers
export function createScraper(platform: string): BaseScraper | null {
  switch (platform.toLowerCase()) {
    case 'amazon':
      return new AmazonScraper();
    case 'walmart':
      return new WalmartScraper();
    case 'ebay':
      return new EbayScraper();
    default:
      return null;
  }
}

// Function to search across multiple platforms
export async function searchAcrossPlatforms(query: string, platforms: string[] = ['amazon', 'walmart', 'ebay']): Promise<ProductSource[]> {
  const scrapers = platforms
    .map(platform => createScraper(platform))
    .filter((scraper): scraper is BaseScraper => scraper !== null);
  
  try {
    const results = await Promise.all(
      scrapers.map(async scraper => {
        const result = await scraper.search(query);
        return result.success ? result.results : [];
      })
    );
    
    // Flatten results and sort by total price
    const allResults = results.flat().sort((a, b) => a.total - b.total);
    
    // Close all scrapers
    await Promise.all(scrapers.map(scraper => scraper.close()));
    
    return allResults;
  } catch (error) {
    // Ensure scrapers are closed even if there's an error
    await Promise.all(scrapers.map(scraper => scraper.close()));
    throw error;
  }
}
