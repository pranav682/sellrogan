# Vercel Deployment Instructions for SourceAndSell

This guide provides step-by-step instructions for deploying the SourceAndSell application to Vercel, ensuring all features function correctly.

## Prerequisites

1. A Vercel account (free tier available at [vercel.com](https://vercel.com))
2. Access to the SourceAndSell project files

## Deployment Steps

### 1. Create a Vercel Account

1. Go to [vercel.com](https://vercel.com) and click "Sign Up"
2. Choose to sign up with GitHub, GitLab, Bitbucket, or email
3. Complete the registration process

### 2. Install Vercel CLI (Optional)

For command-line deployment:

```bash
npm install -g vercel
```

### 3. Prepare the Project

Ensure the project has the following files properly configured:
- `next.config.mjs` with appropriate settings
- `package.json` with correct dependencies
- `.env.local` for environment variables (create if needed)

### 4. Deploy via Vercel Dashboard

#### Option A: Deploy from Git Repository

1. In the Vercel dashboard, click "Add New..." → "Project"
2. Import your Git repository containing the SourceAndSell code
3. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: `/price-arbitrage-web` (if in a subdirectory)
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Add environment variables if needed
5. Click "Deploy"

#### Option B: Deploy from Local Directory

1. In the project directory, run:
   ```bash
   cd /home/ubuntu/price-arbitrage-app/price-arbitrage-web
   vercel
   ```
2. Follow the CLI prompts to configure your project
3. Confirm deployment settings

### 5. Configure Custom Domain (Optional)

1. In the Vercel dashboard, select your project
2. Go to "Settings" → "Domains"
3. Add your custom domain (e.g., sourceandsell.com)
4. Follow the instructions to configure DNS settings

### 6. Verify Deployment

1. Once deployment is complete, Vercel will provide a URL (e.g., sourceandsell.vercel.app)
2. Visit the URL to verify all features are working correctly
3. Test key functionality:
   - Product search
   - Price comparison
   - Profit analysis
   - Listing creation
   - Analytics dashboard
   - API endpoints

### 7. Set Up Continuous Deployment (Optional)

For automatic deployments when code changes:

1. Connect your Git repository to Vercel
2. Configure branch deployments in project settings
3. Set up preview deployments for pull requests

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are properly installed
   - Verify Next.js configuration is correct

2. **API Routes Not Working**
   - Confirm API routes are properly configured
   - Check for serverless function limitations
   - Verify environment variables are set correctly

3. **Environment Variables**
   - Add all required environment variables in Vercel project settings
   - Ensure variable names match those used in the code

## Support

If you encounter any issues during deployment, you can:

1. Check Vercel documentation at [vercel.com/docs](https://vercel.com/docs)
2. Review Next.js deployment guides at [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
3. Contact Vercel support through their dashboard

## Next Steps After Deployment

1. Set up user accounts and access controls
2. Configure payment processing for subscription plans
3. Set up monitoring and analytics
4. Implement backup and recovery procedures
5. Plan for scaling as user base grows
