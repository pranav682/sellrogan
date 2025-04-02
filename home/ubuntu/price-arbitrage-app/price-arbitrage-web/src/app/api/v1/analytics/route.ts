export const dynamic = "force-static";

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, apiResponse, handleApiError, parsePaginationParams, generatePaginationMetadata } from '@/lib/apiUtils';

// Mock data for demonstration purposes
const mockAnalytics = [
  {
    id: '1',
    date: '2025-04-01',
    metrics: {
      revenue: 12500,
      profit: 5200,
      sales: 125,
      views: 3450,
      clicks: 420,
      conversion: 0.0362,
      roi: 0.42
    },
    platforms: {
      amazon: { revenue: 7500, sales: 75 },
      ebay: { revenue: 3000, sales: 30 },
      walmart: { revenue: 1500, sales: 15 },
      etsy: { revenue: 500, sales: 5 }
    },
    categories: {
      electronics: { revenue: 6250, sales: 50 },
      homeKitchen: { revenue: 3125, sales: 35 },
      toysGames: { revenue: 1875, sales: 25 },
      beauty: { revenue: 1250, sales: 15 }
    },
    topProducts: [
      { id: 'prod1', name: 'Wireless Earbuds', revenue: 2500, sales: 50, roi: 0.85 },
      { id: 'prod2', name: 'Smart Watch', revenue: 1800, sales: 20, roi: 0.65 },
      { id: 'prod3', name: 'Bluetooth Speaker', revenue: 1500, sales: 15, roi: 0.50 }
    ]
  },
  {
    id: '2',
    date: '2025-03-31',
    metrics: {
      revenue: 11800,
      profit: 4900,
      sales: 118,
      views: 3200,
      clicks: 390,
      conversion: 0.0369,
      roi: 0.41
    },
    platforms: {
      amazon: { revenue: 7080, sales: 70 },
      ebay: { revenue: 2950, sales: 28 },
      walmart: { revenue: 1180, sales: 12 },
      etsy: { revenue: 590, sales: 8 }
    },
    categories: {
      electronics: { revenue: 5900, sales: 48 },
      homeKitchen: { revenue: 2950, sales: 32 },
      toysGames: { revenue: 1770, sales: 23 },
      beauty: { revenue: 1180, sales: 15 }
    },
    topProducts: [
      { id: 'prod1', name: 'Wireless Earbuds', revenue: 2360, sales: 47, roi: 0.83 },
      { id: 'prod2', name: 'Smart Watch', revenue: 1770, sales: 19, roi: 0.64 },
      { id: 'prod3', name: 'Bluetooth Speaker', revenue: 1420, sales: 14, roi: 0.49 }
    ]
  }
];

export async function GET(req: NextRequest) {
  try {
    // Validate API key
    const authError = await validateApiKey(req);
    if (authError) return authError;
    
    // Parse pagination parameters
    const { page, limit } = parsePaginationParams(req);
    
    // Parse query parameters
    const url = new URL(req.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const platform = url.searchParams.get('platform');
    const category = url.searchParams.get('category');
    
    // In a real implementation, we would fetch analytics from a database
    // For now, we'll filter the mock data based on the query parameters
    let results = [...mockAnalytics];
    
    // Filter by date range
    if (startDate) {
      results = results.filter(item => new Date(item.date) >= new Date(startDate));
    }
    
    if (endDate) {
      results = results.filter(item => new Date(item.date) <= new Date(endDate));
    }
    
    // Apply pagination
    const total = results.length;
    const paginatedResults = results.slice((page - 1) * limit, page * limit);
    
    // Generate pagination metadata
    const pagination = generatePaginationMetadata(page, limit, total);
    
    return apiResponse({
      success: true,
      pagination,
      analytics: paginatedResults
    });
  } catch (error) {
    return handleApiError(error);
  }
}
