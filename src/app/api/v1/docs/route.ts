import { NextRequest, NextResponse } from 'next/server';
import { getApiDocumentation } from '@/lib/apiUtils';

export async function GET(request: NextRequest) {
  try {
    // Generate OpenAPI documentation
    const openApiSpec = {
      openapi: '3.0.0',
      info: {
        title: 'SellRogan API',
        description: 'API for SellRogan platform',
        version: '1.0.0',
        contact: {
          name: 'SellRogan Support',
          url: 'https://sellrogan.com/support',
          email: 'support@sellrogan.com',
        },
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

    return NextResponse.json(openApiSpec);
  } catch (error) {
    console.error('Error generating API documentation:', error);
    return NextResponse.json(
      { error: 'Failed to generate API documentation' },
      { status: 500 }
    );
  }
}
