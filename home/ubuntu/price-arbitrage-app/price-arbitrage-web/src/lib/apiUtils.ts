import { NextRequest, NextResponse } from 'next/server';

// API key validation middleware
export async function validateApiKey(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  
  if (!apiKey) {
    return new NextResponse(
      JSON.stringify({ error: 'API key is required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // In a real implementation, we would validate the API key against a database
  // For now, we'll use a simple check for demonstration purposes
  const isValidApiKey = apiKey.startsWith('sas_');
  
  if (!isValidApiKey) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid API key' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Check rate limits
  // In a real implementation, we would check against a rate limiting service
  
  // Check subscription tier
  // In a real implementation, we would check the subscription tier associated with the API key
  
  return null; // No error, proceed with the request
}

// Rate limiting middleware
export async function rateLimit(req: NextRequest, limit: number = 100) {
  const apiKey = req.headers.get('x-api-key');
  
  if (!apiKey) {
    return new NextResponse(
      JSON.stringify({ error: 'API key is required for rate limiting' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // In a real implementation, we would check against a rate limiting service
  // For now, we'll assume all requests are within limits
  
  return null; // No error, proceed with the request
}

// Helper function to handle API errors
export function handleApiError(error: any) {
  console.error('API Error:', error);
  
  const message = error.message || 'An unexpected error occurred';
  const status = error.status || 500;
  
  return new NextResponse(
    JSON.stringify({ error: message }),
    { status, headers: { 'Content-Type': 'application/json' } }
  );
}

// Helper function to return successful API responses
export function apiResponse(data: any, status: number = 200) {
  return new NextResponse(
    JSON.stringify(data),
    { status, headers: { 'Content-Type': 'application/json' } }
  );
}

// Helper function to parse query parameters
export function parseQueryParams(req: NextRequest) {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

// Helper function to parse pagination parameters
export function parsePaginationParams(req: NextRequest) {
  const params = parseQueryParams(req);
  
  const page = parseInt(params.page || '1', 10);
  const limit = parseInt(params.limit || '20', 10);
  
  // Enforce reasonable limits
  const validatedLimit = Math.min(Math.max(limit, 1), 100);
  const validatedPage = Math.max(page, 1);
  
  return {
    page: validatedPage,
    limit: validatedLimit,
    offset: (validatedPage - 1) * validatedLimit
  };
}

// Helper function to generate pagination metadata
export function generatePaginationMetadata(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
}

// Helper function to validate required fields
export function validateRequiredFields(data: any, requiredFields: string[]) {
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return {
      error: `Missing required fields: ${missingFields.join(', ')}`,
      status: 400
    };
  }
  
  return null; // No error
}

// Helper function to sanitize input data
export function sanitizeInput(data: any) {
  // In a real implementation, we would sanitize the input data
  // For now, we'll just return the data as is
  return data;
}

// Helper function to format API documentation
export function formatApiDocumentation(endpoints: any[]) {
  return {
    openapi: '3.0.0',
    info: {
      title: 'SourceAndSell API',
      version: '1.0.0',
      description: 'API for SourceAndSell platform'
    },
    servers: [
      {
        url: 'https://api.sourceandsell.com/v1',
        description: 'Production API'
      }
    ],
    paths: endpoints.reduce((acc, endpoint) => {
      acc[endpoint.path] = {
        [endpoint.method.toLowerCase()]: {
          summary: endpoint.summary,
          description: endpoint.description,
          parameters: endpoint.parameters,
          requestBody: endpoint.requestBody,
          responses: endpoint.responses
        }
      };
      return acc;
    }, {})
  };
}
