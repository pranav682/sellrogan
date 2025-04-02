# SellRogan - AI-Powered E-commerce Arbitrage Platform

SellRogan is a comprehensive e-commerce arbitrage platform that helps users find products to source, create optimized listings across multiple marketplaces, and automate the fulfillment process. The platform leverages AI technology to provide intelligent recommendations, optimize listings, and streamline the entire selling process.

## Features

### AI-Powered Search
- Conversational search interface that asks clarifying questions
- Finds the cheapest and most reliable sources for products
- Compares prices across multiple suppliers
- Provides detailed information about shipping costs and delivery times

### Smart Listing Creation
- AI-generated product descriptions and titles
- Optimized pricing recommendations based on market analysis
- Multi-marketplace listing support
- SEO-friendly content generation

### Automated Fulfillment
- Automatically orders from suppliers when a sale is made
- Manages shipping and tracking information
- Handles customer notifications
- Coordinates the entire fulfillment process

### AI Agent Manager
- Coordinates between specialized AI agents
- Maintains context throughout the user experience
- Provides personalized recommendations
- Ensures a seamless experience across all platform features

### User-Friendly Dashboard
- Modern, Gen Z-friendly interface following HCI principles
- Comprehensive analytics and reporting
- Marketplace integration management
- Order and listing tracking

## Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn
- Google AI API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sellrogan.git
cd sellrogan
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following content:
```
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment on Vercel

This application is optimized for deployment on Vercel.

1. Push your code to a GitHub repository.

2. Connect your repository to Vercel.

3. Add the following environment variables in your Vercel project settings:
   - `GOOGLE_AI_API_KEY`: Your Google AI API key

4. Deploy the application.

## Project Structure

```
sellrogan/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   │   ├── ui/         # UI components
│   │   └── ...         # Feature components
│   ├── lib/            # Utility functions and services
│   └── styles/         # Global styles
├── .env.local          # Environment variables (local development)
├── next.config.js      # Next.js configuration
├── package.json        # Project dependencies
└── tsconfig.json       # TypeScript configuration
```

## Key Components

### AI Features

- **SmartSearch**: Conversational search interface that helps users find products.
- **AIListingCreator**: Generates optimized product listings for multiple marketplaces.
- **AIAssistant**: Provides assistance and answers questions about selling products.
- **AIAgentManager**: Coordinates between specialized AI agents to maintain context.

### Core Functionality

- **PriceComparisonEngine**: Finds and compares prices across multiple sources.
- **MarketplaceIntegration**: Connects to multiple marketplaces for listing and order management.
- **AutomatedFulfillment**: Handles the entire order fulfillment process.
- **UserDataService**: Collects and stores user interaction data for personalization.

## API Routes

- `/api/search`: Searches for products across multiple sources.
- `/api/v1/listings`: Manages product listings across marketplaces.
- `/api/v1/analytics`: Provides analytics data for user dashboard.
- `/api/v1/docs`: Serves API documentation.

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Google Generative AI**: AI model for recommendations and content generation
- **Framer Motion**: Animation library for React

## Configuration

### Google AI API

The application uses Google's Generative AI for various AI features. You need to obtain an API key from [Google AI Studio](https://makersuite.google.com/) and add it to your environment variables.

### Marketplace Integration

To connect to marketplaces (Amazon, eBay, Etsy, etc.), you need to provide your marketplace credentials in the application settings. These credentials are securely stored and used for listing creation and order management.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Google Generative AI for powering the AI features
- Next.js team for the amazing framework
- All the open-source libraries used in this project
