'use client';

// Mock scrapers implementation for SellRogan platform
// This is a client-side mock implementation that doesn't require puppeteer

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
  protected reliability: number;
  protected source: string;
  
  constructor(source: string, reliability: number) {
    this.source = source;
    this.reliability = reliability;
  }
  
  // Close browser instance - mock implementation
  public async close(): Promise<void> {
    console.log(`[MOCK] Closing browser for ${this.source} scraper`);
    // No actual browser to close in this mock implementation
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
    console.log(`[MOCK] Searching Amazon for: ${query}`);
    
    // Return mock data instead of actually scraping
    const mockProducts: ProductSource[] = [
      {
        id: 1,
        name: `${query} - Premium Version`,
        price: 49.99,
        source: 'Amazon',
        url: 'https://www.amazon.com/example-product-1',
        reliability: this.reliability,
        shipping: 0,
        total: 49.99,
        image: 'https://via.placeholder.com/150'
      },
      {
        id: 2,
        name: `${query} - Standard Edition`,
        price: 29.99,
        source: 'Amazon',
        url: 'https://www.amazon.com/example-product-2',
        reliability: this.reliability,
        shipping: 4.99,
        total: 34.98,
        image: 'https://via.placeholder.com/150'
      },
      {
        id: 3,
        name: `${query} - Budget Option`,
        price: 19.99,
        source: 'Amazon',
        url: 'https://www.amazon.com/example-product-3',
        reliability: this.reliability,
        shipping: 5.99,
        total: 25.98,
        image: 'https://via.placeholder.com/150'
      }
    ];
    
    return {
      success: true,
      results: mockProducts
    };
  }
}

// Walmart scraper implementation
export class WalmartScraper extends BaseScraper {
  constructor() {
    super('Walmart', 4.5);
  }
  
  public async search(query: string): Promise<ScraperResult> {
    console.log(`[MOCK] Searching Walmart for: ${query}`);
    
    // Return mock data instead of actually scraping
    const mockProducts: ProductSource[] = [
      {
        id: 1,
        name: `Great Value ${query}`,
        price: 42.99,
        source: 'Walmart',
        url: 'https://www.walmart.com/example-product-1',
        reliability: this.reliability,
        shipping: 0,
        total: 42.99,
        image: 'https://via.placeholder.com/150'
      },
      {
        id: 2,
        name: `Everyday ${query}`,
        price: 24.99,
        source: 'Walmart',
        url: 'https://www.walmart.com/example-product-2',
        reliability: this.reliability,
        shipping: 3.99,
        total: 28.98,
        image: 'https://via.placeholder.com/150'
      },
      {
        id: 3,
        name: `${query} Value Pack`,
        price: 17.99,
        source: 'Walmart',
        url: 'https://www.walmart.com/example-product-3',
        reliability: this.reliability,
        shipping: 5.99,
        total: 23.98,
        image: 'https://via.placeholder.com/150'
      }
    ];
    
    return {
      success: true,
      results: mockProducts
    };
  }
}

// eBay scraper implementation
export class EbayScraper extends BaseScraper {
  constructor() {
    super('eBay', 4.2);
  }
  
  public async search(query: string): Promise<ScraperResult> {
    console.log(`[MOCK] Searching eBay for: ${query}`);
    
    // Return mock data instead of actually scraping
    const mockProducts: ProductSource[] = [
      {
        id: 1,
        name: `New ${query} - Fast Shipping`,
        price: 39.99,
        source: 'eBay',
        url: 'https://www.ebay.com/example-product-1',
        reliability: this.reliability,
        shipping: 4.99,
        total: 44.98,
        image: 'https://via.placeholder.com/150'
      },
      {
        id: 2,
        name: `Used ${query} - Good Condition`,
        price: 22.50,
        source: 'eBay',
        url: 'https://www.ebay.com/example-product-2',
        reliability: this.reliability,
        shipping: 3.99,
        total: 26.49,
        image: 'https://via.placeholder.com/150'
      },
      {
        id: 3,
        name: `Refurbished ${query} - Like New`,
        price: 15.99,
        source: 'eBay',
        url: 'https://www.ebay.com/example-product-3',
        reliability: this.reliability,
        shipping: 0,
        total: 15.99,
        image: 'https://via.placeholder.com/150'
      }
    ];
    
    return {
      success: true,
      results: mockProducts
    };
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
