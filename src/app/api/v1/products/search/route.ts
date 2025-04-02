export const dynamic = "force-static";

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, apiResponse, handleApiError, parseQueryParams } from '@/lib/apiUtils';
import { ProductSource } from '@/lib/scrapers';

// Mock data for demonstration purposes
const mockProducts: ProductSource[] = [
  {
    id: '1',
    title: 'Wireless Earbuds',
    description: 'Bluetooth 5.0 Wireless Earbuds with Noise Cancellation',
    price: 49.99,
    currency: 'USD',
    platform: 'Amazon',
    url: 'https://amazon.com/wireless-earbuds',
    imageUrl: 'https://example.com/images/earbuds.jpg',
    rating: 4.5,
    ratingCount: 1250,
    availability: 'In Stock',
    shippingCost: 0,
    shippingTime: '2 days',
    seller: 'TechGadgets',
    sellerRating: 4.7,
    condition: 'New',
    timestamp: new Date().toISOString(),
    reliability: 0.95
  },
  {
    id: '2',
    title: 'Smart Watch',
    description: 'Fitness Tracker Smart Watch with Heart Rate Monitor',
    price: 89.99,
    currency: 'USD',
    platform: 'eBay',
    url: 'https://ebay.com/smart-watch',
    imageUrl: 'https://example.com/images/smartwatch.jpg',
    rating: 4.2,
    ratingCount: 850,
    availability: 'In Stock',
    shippingCost: 4.99,
    shippingTime: '3-5 days',
    seller: 'WearableTech',
    sellerRating: 4.5,
    condition: 'New',
    timestamp: new Date().toISOString(),
    reliability: 0.88
  }
];

export async function GET(req: NextRequest) {
  try {
    // Validate API key
    const authError = await validateApiKey(req);
    if (authError) return authError;
    
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
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Filter by platform
    if (platform !== 'all') {
      results = results.filter(product => product.platform === platform);
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
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'reliability':
          comparison = a.reliability - b.reliability;
          break;
        default:
          comparison = a.price - b.price;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return apiResponse({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    return handleApiError(error);
  }
}
