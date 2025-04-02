import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, apiResponse, handleApiError, parseQueryParams } from '@/lib/apiUtils';
import { ProductSource } from '@/lib/scrapers';

export const dynamic = "force-static";

// Mock data for demonstration purposes
const mockProducts: ProductSource[] = [
  {
    id: 1,
    name: 'Wireless Earbuds',
    price: 49.99,
    source: 'Amazon',
    url: 'https://amazon.com/wireless-earbuds',
    image: 'https://example.com/images/earbuds.jpg',
    reliability: 0.95,
    shipping: 0,
    total: 49.99
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 89.99,
    source: 'eBay',
    url: 'https://ebay.com/smart-watch',
    image: 'https://example.com/images/smartwatch.jpg',
    reliability: 0.88,
    shipping: 4.99,
    total: 94.98
  }
];

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Validate API key
    const isValid = validateApiKey(req);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }
    
    // Parse query parameters
    const params = parseQueryParams(req);
    const query = params.query || '';
    const platform = params.platform || 'all';
    const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
    const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
    const sortBy = params.sortBy || 'price';
    const sortOrder = params.sortOrder || 'asc';
    
    // In a real implementation, we would search for products in a database
    // For now, we'll filter the mock data based on the query parameters
    let results = [...mockProducts];
    
    // Filter by query
    if (query) {
      results = results.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Filter by platform
    if (platform !== 'all') {
      results = results.filter(product => product.source === platform);
    }
    
    // Filter by price range
    if (minPrice !== undefined) {
      results = results.filter(product => product.price >= minPrice);
    }
    
    if (maxPrice !== undefined) {
      results = results.filter(product => product.price <= maxPrice);
    }
    
    // Sort results
    results.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'reliability':
          comparison = a.reliability - b.reliability;
          break;
        default:
          comparison = a.price - b.price;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return NextResponse.json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    return handleApiError(error);
  }
}
