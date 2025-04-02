export const dynamic = "force-static";

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, apiResponse, handleApiError } from '@/lib/apiUtils';

// API documentation
const apiEndpoints = [
  {
    path: '/api/v1/products/search',
    method: 'GET',
    summary: 'Search for products across multiple platforms',
    description: 'Search for products across multiple e-commerce platforms with filtering and sorting options.',
    parameters: [
      {
        name: 'query',
        in: 'query',
        description: 'Search query string',
        required: false,
        schema: { type: 'string' }
      },
      {
        name: 'platform',
        in: 'query',
        description: 'Filter by platform (e.g., Amazon, eBay, Walmart)',
        required: false,
        schema: { type: 'string' }
      },
      {
        name: 'minPrice',
        in: 'query',
        description: 'Minimum price filter',
        required: false,
        schema: { type: 'number' }
      },
      {
        name: 'maxPrice',
        in: 'query',
        description: 'Maximum price filter',
        required: false,
        schema: { type: 'number' }
      },
      {
        name: 'sortBy',
        in: 'query',
        description: 'Sort field (price, rating, reliability)',
        required: false,
        schema: { type: 'string', enum: ['price', 'rating', 'reliability'] }
      },
      {
        name: 'sortOrder',
        in: 'query',
        description: 'Sort order (asc, desc)',
        required: false,
        schema: { type: 'string', enum: ['asc', 'desc'] }
      }
    ],
    responses: {
      '200': {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                count: { type: 'integer' },
                results: { type: 'array' }
              }
            }
          }
        }
      },
      '401': {
        description: 'Unauthorized - Invalid or missing API key'
      },
      '500': {
        description: 'Server error'
      }
    }
  },
  {
    path: '/api/v1/listings',
    method: 'GET',
    summary: 'Get all listings',
    description: 'Retrieve all listings for the authenticated user.',
    parameters: [],
    responses: {
      '200': {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                count: { type: 'integer' },
                listings: { type: 'array' }
              }
            }
          }
        }
      },
      '401': {
        description: 'Unauthorized - Invalid or missing API key'
      },
      '500': {
        description: 'Server error'
      }
    }
  },
  {
    path: '/api/v1/listings',
    method: 'POST',
    summary: 'Create a new listing',
    description: 'Create a new listing on a specified platform.',
    parameters: [],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['platform', 'title', 'description', 'price', 'quantity', 'category'],
            properties: {
              platform: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'number' },
              currency: { type: 'string', default: 'USD' },
              quantity: { type: 'integer' },
              category: { type: 'string' },
              images: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      }
    },
    responses: {
      '201': {
        description: 'Listing created successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                listing: { type: 'object' }
              }
            }
          }
        }
      },
      '400': {
        description: 'Bad request - Missing required fields'
      },
      '401': {
        description: 'Unauthorized - Invalid or missing API key'
      },
      '500': {
        description: 'Server error'
      }
    }
  },
  {
    path: '/api/v1/analytics',
    method: 'GET',
    summary: 'Get analytics data',
    description: 'Retrieve analytics data with filtering and pagination options.',
    parameters: [
      {
        name: 'page',
        in: 'query',
        description: 'Page number for pagination',
        required: false,
        schema: { type: 'integer', default: 1 }
      },
      {
        name: 'limit',
        in: 'query',
        description: 'Number of items per page',
        required: false,
        schema: { type: 'integer', default: 20 }
      },
      {
        name: 'startDate',
        in: 'query',
        description: 'Start date for filtering (YYYY-MM-DD)',
        required: false,
        schema: { type: 'string', format: 'date' }
      },
      {
        name: 'endDate',
        in: 'query',
        description: 'End date for filtering (YYYY-MM-DD)',
        required: false,
        schema: { type: 'string', format: 'date' }
      },
      {
        name: 'platform',
        in: 'query',
        description: 'Filter by platform',
        required: false,
        schema: { type: 'string' }
      },
      {
        name: 'category',
        in: 'query',
        description: 'Filter by category',
        required: false,
        schema: { type: 'string' }
      }
    ],
    responses: {
      '200': {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                pagination: { type: 'object' },
                analytics: { type: 'array' }
              }
            }
          }
        }
      },
      '401': {
        description: 'Unauthorized - Invalid or missing API key'
      },
      '500': {
        description: 'Server error'
      }
    }
  },
  {
    path: '/api/v1/users/me',
    method: 'GET',
    summary: 'Get current user information',
    description: 'Retrieve information about the authenticated user.',
    parameters: [],
    responses: {
      '200': {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                user: { type: 'object' }
              }
            }
          }
        }
      },
      '401': {
        description: 'Unauthorized - Invalid or missing API key'
      },
      '500': {
        description: 'Server error'
      }
    }
  }
];

export async function GET(req: NextRequest) {
  try {
    // Validate API key
    const authError = await validateApiKey(req);
    if (authError) return authError;
    
    // Format API documentation
    const documentation = {
      openapi: '3.0.0',
      info: {
        title: 'SourceAndSell API',
        version: '1.0.0',
        description: 'API for SourceAndSell platform',
        contact: {
          name: 'SourceAndSell Support',
          url: 'https://sourceandsell.com/support',
          email: 'api@sourceandsell.com'
        }
      },
      servers: [
        {
          url: 'https://api.sourceandsell.com/v1',
          description: 'Production API'
        },
        {
          url: 'https://staging-api.sourceandsell.com/v1',
          description: 'Staging API'
        }
      ],
      paths: apiEndpoints.reduce((acc, endpoint) => {
        if (!acc[endpoint.path]) {
          acc[endpoint.path] = {};
        }
        
        acc[endpoint.path][endpoint.method.toLowerCase()] = {
          summary: endpoint.summary,
          description: endpoint.description,
          parameters: endpoint.parameters,
          requestBody: endpoint.requestBody,
          responses: endpoint.responses
        };
        
        return acc;
      }, {} as any),
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'x-api-key'
          }
        }
      },
      security: [
        {
          ApiKeyAuth: []
        }
      ]
    };
    
    return apiResponse(documentation);
  } catch (error) {
    return handleApiError(error);
  }
}
