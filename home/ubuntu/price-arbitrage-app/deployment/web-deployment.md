# SourceAndSell Web Deployment Configuration

## Cloudflare Pages Deployment

To deploy the SourceAndSell application to Cloudflare Pages:

1. Create a Cloudflare account if you don't have one already
2. Install Wrangler CLI globally:
   ```
   npm install -g wrangler
   ```
3. Authenticate with Cloudflare:
   ```
   wrangler login
   ```
4. Build the application:
   ```
   cd price-arbitrage-web
   npm run build
   ```
5. Deploy to Cloudflare Pages:
   ```
   wrangler pages publish .next --project-name sourceandsell
   ```

## Environment Variables

The following environment variables need to be configured in Cloudflare Pages:

- `DATABASE_URL`: Connection string for the database
- `API_KEY_AMAZON`: API key for Amazon Marketplace API
- `API_KEY_EBAY`: API key for eBay API
- `API_KEY_WALMART`: API key for Walmart API
- `JWT_SECRET`: Secret for JWT authentication

## Custom Domain Setup

To configure a custom domain:

1. Go to Cloudflare Pages dashboard
2. Select the price-arbitrage project
3. Go to Custom Domains
4. Add your domain and follow the DNS configuration instructions

## Continuous Deployment

For continuous deployment with GitHub:

1. Push your code to a GitHub repository
2. Connect your GitHub account to Cloudflare Pages
3. Select the repository and configure build settings:
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Node.js version: 20.x

## D1 Database Migration

To set up the database in production:

1. Create a D1 database in Cloudflare:
   ```
   wrangler d1 create sourceandsell-db
   ```
2. Update wrangler.toml with the database ID
3. Apply migrations:
   ```
   wrangler d1 migrations apply --database sourceandsell-db
   ```

## Monitoring and Analytics

Enable Cloudflare Analytics for monitoring:

1. Go to Cloudflare dashboard
2. Navigate to Analytics
3. Enable Web Analytics for your domain
