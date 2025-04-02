import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, apiResponse, parsePaginationParams, generatePaginationMetadata } from '@/lib/apiUtils';

// Mock listings data
const mockListingsData = [
  { id: '1', title: 'Wireless Bluetooth Headphones', price: 49.99, platform: 'Amazon', status: 'active', createdAt: '2025-03-01' },
  { id: '2', title: 'Smart Watch Series 5', price: 199.99, platform: 'eBay', status: 'active', createdAt: '2025-03-02' },
  { id: '3', title: 'Portable Bluetooth Speaker', price: 39.99, platform: 'Amazon', status: 'active', createdAt: '2025-03-03' },
  { id: '4', title: 'Wireless Charging Pad', price: 29.99, platform: 'Walmart', status: 'active', createdAt: '2025-03-04' },
  { id: '5', title: 'Fitness Tracker Band', price: 79.99, platform: 'Etsy', status: 'active', createdAt: '2025-03-05' },
  { id: '6', title: 'Noise Cancelling Earbuds', price: 89.99, platform: 'Amazon', status: 'draft', createdAt: '2025-03-06' },
  { id: '7', title: 'Laptop Stand', price: 24.99, platform: 'eBay', status: 'active', createdAt: '2025-03-07' },
  { id: '8', title: 'Mechanical Keyboard', price: 69.99, platform: 'Amazon', status: 'active', createdAt: '2025-03-08' },
  { id: '9', title: 'Wireless Mouse', price: 19.99, platform: 'Walmart', status: 'active', createdAt: '2025-03-09' },
  { id: '10', title: 'USB-C Hub', price: 34.99, platform: 'Amazon', status: 'active', createdAt: '2025-03-10' },
];

export async function GET(request: NextRequest) {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }
    
    // Parse pagination parameters
    const { page, limit } = parsePaginationParams(request);
    
    // Get query parameters
    const url = new URL(request.url);
    const platform = url.searchParams.get('platform');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');
    
    // Filter data based on query parameters
    let filteredData = [...mockListingsData];
    
    if (platform) {
      filteredData = filteredData.filter(item => item.platform.toLowerCase() === platform.toLowerCase());
    }
    
    if (status) {
      filteredData = filteredData.filter(item => item.status.toLowerCase() === status.toLowerCase());
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(item => item.title.toLowerCase().includes(searchLower));
    }
    
    // Calculate total
    const total = filteredData.length;
    
    // Paginate data
    const paginatedData = filteredData.slice((page - 1) * limit, page * limit);
    
    // Generate pagination metadata
    const meta = generatePaginationMetadata(page, limit, total);
    
    // Return response
    return apiResponse(paginatedData, meta);
  } catch (error) {
    console.error('Error in listings API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
