import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, apiResponse, parsePaginationParams, generatePaginationMetadata } from '@/lib/apiUtils';

// Mock analytics data
const mockAnalyticsData = [
  { id: '1', date: '2025-03-01', platform: 'Amazon', revenue: 1245.67, profit: 456.78, orders: 23, views: 456 },
  { id: '2', date: '2025-03-02', platform: 'Amazon', revenue: 1345.89, profit: 498.76, orders: 25, views: 512 },
  { id: '3', date: '2025-03-03', platform: 'eBay', revenue: 876.54, profit: 321.45, orders: 15, views: 345 },
  { id: '4', date: '2025-03-04', platform: 'Walmart', revenue: 654.32, profit: 234.56, orders: 12, views: 278 },
  { id: '5', date: '2025-03-05', platform: 'Amazon', revenue: 1456.78, profit: 534.56, orders: 27, views: 567 },
  { id: '6', date: '2025-03-06', platform: 'Etsy', revenue: 543.21, profit: 187.65, orders: 9, views: 198 },
  { id: '7', date: '2025-03-07', platform: 'eBay', revenue: 987.65, profit: 365.43, orders: 18, views: 387 },
  { id: '8', date: '2025-03-08', platform: 'Amazon', revenue: 1567.89, profit: 587.65, orders: 29, views: 623 },
  { id: '9', date: '2025-03-09', platform: 'Walmart', revenue: 765.43, profit: 276.54, orders: 14, views: 312 },
  { id: '10', date: '2025-03-10', platform: 'Amazon', revenue: 1678.90, profit: 623.45, orders: 31, views: 678 },
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
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    
    // Filter data based on query parameters
    let filteredData = [...mockAnalyticsData];
    
    if (platform) {
      filteredData = filteredData.filter(item => item.platform.toLowerCase() === platform.toLowerCase());
    }
    
    if (startDate) {
      filteredData = filteredData.filter(item => new Date(item.date) >= new Date(startDate));
    }
    
    if (endDate) {
      filteredData = filteredData.filter(item => new Date(item.date) <= new Date(endDate));
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
    console.error('Error in analytics API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
