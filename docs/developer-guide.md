# SellRogan - Developer Documentation

This document provides technical details and implementation guides for developers working on the SellRogan platform.

## Architecture Overview

SellRogan is built using Next.js with the App Router architecture, which provides several benefits:
- Server-side rendering for improved SEO and performance
- API routes for backend functionality
- File-based routing for simplified navigation
- React Server Components for optimized rendering

The application follows a component-based architecture with clear separation of concerns:
- UI components for reusable interface elements
- Feature components for specific functionality
- Service modules for business logic
- API routes for data access

## AI Integration

### Google Generative AI

The platform uses Google's Generative AI (Gemini) for various AI features. The integration is implemented in `src/lib/geminiAIService.ts`.

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Get the model
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Generate content
export async function generateContent(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content:', error);
    return 'An error occurred while generating content.';
  }
}
```

### AI Agent System

The AI Agent Manager coordinates between specialized agents:
- Search Agent: Finds products and sources
- Listing Agent: Creates optimized listings
- Fulfillment Agent: Manages order fulfillment
- Coordinator Agent: Maintains context across tasks

Each agent has its own responsibility but shares context through the AI Agent Manager.

## Data Flow

1. User interacts with the UI (search, create listing, etc.)
2. UI components call appropriate service modules
3. Service modules process the request and call API routes if needed
4. API routes interact with external services (marketplaces, AI models, etc.)
5. Results flow back through the same path to update the UI

## Key Services

### User Data Service

The User Data Service (`src/lib/userDataService.tsx`) manages user preferences, interaction history, and personalization data.

```typescript
// Example usage
const { userData, trackEvent } = useContext(UserDataContext);

// Track user interaction
trackEvent('search_performed', { query: 'makhana', filters: { ... } });

// Access user preferences
const userPreferences = userData.preferences;
```

### Price Comparison Service

The Price Comparison Engine (`src/components/PriceComparisonEngine.tsx`) aggregates data from multiple sources to find the best deals.

Sources include:
- Direct API integrations with marketplaces
- Web scraping for sites without APIs
- Google Programmable Search Engine results

### Marketplace Integration

The Marketplace Integration component (`src/components/MarketplaceIntegration.tsx`) connects to various e-commerce platforms:
- Amazon
- eBay
- Etsy
- Walmart
- Shopify

Each integration requires specific API credentials and follows the platform's authentication flow.

## Testing

The application includes a comprehensive test suite accessible at `/test`. This page runs tests for all major components and reports issues.

To add new tests:
1. Create a test function in `src/app/test/page.tsx`
2. Return an object with `status`, `message`, and `details`
3. Add the test to the `tests` array

## Deployment

### Vercel Deployment

The application is optimized for Vercel deployment. Required environment variables:
- `GOOGLE_AI_API_KEY`: For AI features
- `ANALYTICS_API_ENDPOINT`: For analytics integration

### Local Development

For local development:
1. Clone the repository
2. Install dependencies with `npm install`
3. Create `.env.local` with required environment variables
4. Run `npm run dev`

## Performance Optimization

The application implements several performance optimizations:
- React Server Components for reduced client-side JavaScript
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- API response caching
- Incremental Static Regeneration for semi-static pages

## Security Considerations

- User credentials for marketplaces are encrypted before storage
- API keys are never exposed to the client
- Input validation on all user inputs
- Rate limiting on API routes
- CSRF protection

## Extending the Platform

### Adding New Marketplaces

To add a new marketplace integration:
1. Create a new service file in `src/lib/marketplaces/`
2. Implement the standard marketplace interface
3. Add the marketplace to the available options in `MarketplaceIntegration.tsx`

### Adding New AI Features

To add new AI capabilities:
1. Define the prompt template in `src/lib/prompts/`
2. Create a new function in `geminiAIService.ts` that uses the template
3. Create a UI component that calls the new function
4. Add the component to the appropriate page

## Troubleshooting

Common issues and solutions:
- API key issues: Verify environment variables are correctly set
- Marketplace connection failures: Check API credentials and network connectivity
- AI generation errors: Ensure prompts are within token limits
- Build failures: Check for TypeScript errors and missing dependencies
