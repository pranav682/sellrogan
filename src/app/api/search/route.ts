import { NextRequest, NextResponse } from 'next/server';
// Import only the ProductSource type, not the actual scraper functions
// This avoids the puppeteer dependency in production builds
import type { ProductSource } from '@/lib/scrapers';

// Define interfaces
interface SearchRequest {
  query: string;
  platforms?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json();
    
    if (!body.query || typeof body.query !== 'string') {
      return NextResponse.json(
        { error: 'Invalid search query' },
        { status: 400 }
      );
    }
    
    // For development and production, we'll use mock data
    // In a real implementation, you would integrate with actual scraping services
    let results: ProductSource[] = [];
    
    // Use mock data for development and production
    results = generateMockResults(body.query);
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Function to generate mock results for development
function generateMockResults(query: string): ProductSource[] {
  const sources = [
    'Amazon', 'Walmart', 'eBay', 'Target', 'Best Buy', 
    'AliExpress', 'Etsy', 'Newegg', 'Wayfair', 'Home Depot',
    'Costco', 'B&H Photo', 'Overstock', 'Staples', 'Office Depot',
    'Macy\'s', 'Kohl\'s', 'Lowe\'s', 'GameStop', 'Adorama'
  ];
  
  const reliabilityMap: Record<string, number> = {
    'Amazon': 4.8,
    'Walmart': 4.5,
    'eBay': 4.2,
    'Target': 4.6,
    'Best Buy': 4.7,
    'AliExpress': 3.9,
    'Etsy': 4.3,
    'Newegg': 4.4,
    'Wayfair': 4.1,
    'Home Depot': 4.5,
    'Costco': 4.7,
    'B&H Photo': 4.6,
    'Overstock': 4.0,
    'Staples': 4.2,
    'Office Depot': 4.1,
    'Macy\'s': 4.3,
    'Kohl\'s': 4.2,
    'Lowe\'s': 4.4,
    'GameStop': 3.9,
    'Adorama': 4.5
  };
  
  // Generate a base price that's somewhat consistent for the query
  const basePrice = (
    query.length * 1.5 + 
    query.charCodeAt(0) % 10 + 
    15
  ).toFixed(2);
  
  // Create mock results
  const results: ProductSource[] = sources.map((source, index) => {
    // Create price variation based on source and query
    const priceVariation = (
      (index % 5) * 0.8 - 
      (source.length % 3) * 0.5 + 
      (query.length % 4) * 0.3
    );
    
    const price = parseFloat((parseFloat(basePrice) + priceVariation).toFixed(2));
    
    // Determine shipping cost
    let shipping = 0;
    if (index % 4 === 1) {
      shipping = 4.99;
    } else if (index % 4 === 2) {
      shipping = 7.99;
    } else if (index % 4 === 3) {
      shipping = 2.99;
    }
    
    // Calculate total
    const total = parseFloat((price + shipping).toFixed(2));
    
    // Create URL based on source
    let url = '#';
    switch (source) {
      case 'Amazon':
        url = `https://amazon.com/s?k=${encodeURIComponent(query)}`;
        break;
      case 'Walmart':
        url = `https://walmart.com/search/?query=${encodeURIComponent(query)}`;
        break;
      case 'eBay':
        url = `https://ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`;
        break;
      case 'Target':
        url = `https://target.com/s?searchTerm=${encodeURIComponent(query)}`;
        break;
      default:
        url = `https://${source.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/search?q=${encodeURIComponent(query)}`;
    }
    
    return {
      id: index + 1,
      name: query,
      price,
      source,
      url,
      reliability: reliabilityMap[source] || 4.0,
      shipping,
      total,
      image: `https://via.placeholder.com/150?text=${encodeURIComponent(source)}`
    };
  });
  
  // Sort by total price
  return results.sort((a, b) => a.total - b.total);
}
