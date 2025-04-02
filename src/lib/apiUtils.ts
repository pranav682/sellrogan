import { NextRequest, NextResponse } from 'next/server';

// API utility functions for SellRogan platform

// Define API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// API error types
export enum ApiErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
}

// API error class
export class ApiError extends Error {
  type: ApiErrorType;
  statusCode: number;
  
  constructor(message: string, type: ApiErrorType, statusCode: number = 500) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

// Function to handle API errors
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);
  
  if (error instanceof ApiError) {
    return NextResponse.json(
      { success: false, error: error.message, errorType: error.type },
      { status: error.statusCode }
    );
  }
  
  // Handle other types of errors
  const message = error instanceof Error ? error.message : 'An unknown error occurred';
  return NextResponse.json(
    { success: false, error: message, errorType: ApiErrorType.SERVER_ERROR },
    { status: 500 }
  );
}

// Function to validate request data
export function validateRequest<T>(data: any, schema: any): T {
  try {
    return schema.parse(data);
  } catch (error) {
    throw new ApiError(
      'Validation error: Invalid request data',
      ApiErrorType.VALIDATION_ERROR,
      400
    );
  }
}

// Function to get API documentation
export function getApiDocumentation() {
  return {
    openapi: '3.0.0',
    info: {
      title: 'SellRogan API',
      description: 'API for SellRogan platform',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'https://api.sellrogan.com/v1',
        description: 'Production server',
      },
      {
        url: 'https://staging-api.sellrogan.com/v1',
        description: 'Staging server',
      },
    ],
    paths: {
      '/products/search': {
        post: {
          summary: 'Search for products across multiple platforms',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    query: {
                      type: 'string',
                      description: 'Search query',
                    },
                    platforms: {
                      type: 'array',
                      items: {
                        type: 'string',
                        enum: ['amazon', 'ebay', 'walmart', 'etsy'],
                      },
                      description: 'Platforms to search on',
                    },
                  },
                  required: ['query'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: {
                        type: 'boolean',
                        example: true,
                      },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: {
                              type: 'string',
                            },
                            name: {
                              type: 'string',
                            },
                            price: {
                              type: 'number',
                            },
                            source: {
                              type: 'string',
                            },
                            url: {
                              type: 'string',
                            },
                            image: {
                              type: 'string',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
            },
            '500': {
              description: 'Server error',
            },
          },
        },
      },
    },
  };
}

// Function to validate API key
export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key') || '';
  
  // In a real application, this would validate against stored API keys
  // For demo purposes, we'll accept any non-empty string
  return apiKey.length > 0;
}

// Function to parse pagination parameters
export function parsePaginationParams(request: NextRequest): { page: number; limit: number } {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  
  return {
    page: isNaN(page) || page < 1 ? 1 : page,
    limit: isNaN(limit) || limit < 1 || limit > 100 ? 10 : limit,
  };
}

// Function to generate pagination metadata
export function generatePaginationMetadata(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

// Function to create API response
export function apiResponse<T>(data: T, meta?: any): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  });
}

// Function to parse query parameters
export function parseQueryParams(request: NextRequest): Record<string, string> {
  const url = new URL(request.url);
  const params: Record<string, string> = {};
  
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

// Function to validate required fields
export function validateRequiredFields(data: any, fields: string[]): boolean {
  for (const field of fields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      return false;
    }
  }
  
  return true;
}

// Function to sanitize input
export function sanitizeInput(input: string): string {
  // In a real application, this would implement proper sanitization
  // For demo purposes, we'll just trim and limit length
  return input.trim().substring(0, 1000);
}
