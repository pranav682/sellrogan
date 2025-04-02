export const dynamic = "force-static";

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, apiResponse, handleApiError, validateRequiredFields, sanitizeInput } from '@/lib/apiUtils';
import { ListingResult } from '@/lib/aiListingAgent';

// Mock data for demonstration purposes
const mockListings: ListingResult[] = [
  {
    listingId: 'amz-123456',
    platform: 'Amazon',
    status: 'active',
    title: 'Wireless Earbuds with Noise Cancellation',
    description: 'High-quality wireless earbuds with active noise cancellation, Bluetooth 5.0, and 24-hour battery life.',
    price: 49.99,
    currency: 'USD',
    quantity: 100,
    category: 'Electronics',
    images: ['https://example.com/images/earbuds-1.jpg', 'https://example.com/images/earbuds-2.jpg'],
    listingUrl: 'https://amazon.com/listing/amz-123456',
    createdAt: new Date().toISOString(),
    analytics: {
      estimatedViews: 1200,
      estimatedSales: 45,
      competitorCount: 12,
      pricePosition: 'mid_range'
    }
  },
  {
    listingId: 'ebay-789012',
    platform: 'eBay',
    status: 'active',
    title: 'Smart Watch Fitness Tracker',
    description: 'Fitness tracker with heart rate monitor, sleep tracking, and smartphone notifications.',
    price: 89.99,
    currency: 'USD',
    quantity: 50,
    category: 'Electronics',
    images: ['https://example.com/images/smartwatch-1.jpg', 'https://example.com/images/smartwatch-2.jpg'],
    listingUrl: 'https://ebay.com/listing/ebay-789012',
    createdAt: new Date().toISOString(),
    analytics: {
      estimatedViews: 850,
      estimatedSales: 32,
      competitorCount: 18,
      pricePosition: 'competitive'
    }
  }
];

export async function GET(req: NextRequest) {
  try {
    // Validate API key
    const authError = await validateApiKey(req);
    if (authError) return authError;
    
    // In a real implementation, we would fetch listings from a database
    // For now, we'll return the mock data
    return apiResponse({
      success: true,
      count: mockListings.length,
      listings: mockListings
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    // Validate API key
    const authError = await validateApiKey(req);
    if (authError) return authError;
    
    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ['platform', 'title', 'description', 'price', 'quantity', 'category'];
    const validationError = validateRequiredFields(body, requiredFields);
    if (validationError) {
      return new NextResponse(
        JSON.stringify({ error: validationError.error }),
        { status: validationError.status, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Sanitize input
    const sanitizedData = sanitizeInput(body);
    
    // In a real implementation, we would create a listing in the database
    // For now, we'll create a mock listing result
    const newListing: ListingResult = {
      listingId: `${sanitizedData.platform.toLowerCase()}-${Date.now()}`,
      platform: sanitizedData.platform,
      status: 'pending',
      title: sanitizedData.title,
      description: sanitizedData.description,
      price: sanitizedData.price,
      currency: sanitizedData.currency || 'USD',
      quantity: sanitizedData.quantity,
      category: sanitizedData.category,
      images: sanitizedData.images || [],
      createdAt: new Date().toISOString(),
      analytics: {
        estimatedViews: Math.floor(Math.random() * 1000) + 500,
        estimatedSales: Math.floor(Math.random() * 50) + 10,
        competitorCount: Math.floor(Math.random() * 20) + 5,
        pricePosition: ['low_end', 'competitive', 'mid_range', 'premium'][Math.floor(Math.random() * 4)]
      }
    };
    
    // Add listing URL if available
    if (sanitizedData.listingUrl) {
      newListing.listingUrl = sanitizedData.listingUrl;
    }
    
    return apiResponse({
      success: true,
      message: 'Listing created successfully',
      listing: newListing
    }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
