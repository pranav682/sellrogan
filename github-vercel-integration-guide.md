# GitHub Integration with Vercel for SourceAndSell

This guide provides detailed instructions for setting up GitHub integration with Vercel to enable continuous deployment for your SourceAndSell application.

## Option 1: Manual GitHub Setup

### 1. Create a New GitHub Repository

1. Go to [GitHub](https://github.com) and sign in to your account
2. Click the "+" icon in the top-right corner and select "New repository"
3. Name your repository (e.g., "sourceandsell")
4. Choose visibility (public or private)
5. Do not initialize with README, .gitignore, or license
6. Click "Create repository"

### 2. Set Up Local Git Repository

1. Extract the deployment package I provided to a folder on your computer
2. Open a terminal/command prompt and navigate to that folder
3. Initialize a Git repository:
   ```bash
   git init
   ```
4. Add all files to the repository:
   ```bash
   git add .
   ```
5. Commit the files:
   ```bash
   git commit -m "Initial commit of SourceAndSell application"
   ```

### 3. Connect to GitHub and Push

1. Add your GitHub repository as a remote:
   ```bash
   git remote add origin https://github.com/yourusername/sourceandsell.git
   ```
   (Replace with your actual repository URL)

2. Push the code to GitHub:
   ```bash
   git push -u origin main
   ```
   (Use `master` instead of `main` if your default branch is named differently)

## Option 2: Vercel's GitHub Integration (Recommended)

### 1. Connect GitHub to Vercel

1. Go to [Vercel](https://vercel.com/new)
2. Select "Import Git Repository"
3. Choose "GitHub" as the Git provider
4. If not already connected, click "Connect with GitHub"
5. Follow the authorization process to grant Vercel access to your GitHub account

### 2. Import Your Repository

1. Once connected, Vercel will show a list of your GitHub repositories
2. Select the repository you created for SourceAndSell
3. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: Leave as default (should detect automatically)
   - Build Command: Use default (`npm run build`)
   - Output Directory: Use default (`.next`)
   - Install Command: Use default (`npm install`)
4. Click "Deploy"

## Setting Up Continuous Deployment

### 1. Vercel Project Settings

1. After deployment, go to your project dashboard in Vercel
2. Navigate to "Settings" > "Git"
3. Verify that "Production Branch" is set to your main branch
4. Ensure "Auto Deploy" is enabled

### 2. Configure Preview Deployments (Optional)

1. In the same Git settings section
2. Configure "Preview Deployments" settings:
   - Enable "Preview Deployments for Pull Requests"
   - Set "Preview Deployment Suffix" as desired

## Making Changes and Automatic Deployment

### 1. Local Development Workflow

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/yourusername/sourceandsell.git
   ```

2. Make changes to the code

3. Commit and push changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

4. Vercel will automatically detect the push and deploy the changes

### 2. GitHub Web Interface Workflow

1. Navigate to your repository on GitHub
2. Locate the file you want to edit and click on it
3. Click the pencil icon to edit the file
4. Make your changes
5. Scroll down and add a commit message
6. Click "Commit changes"
7. Vercel will automatically detect the commit and deploy the changes

## Testing Deployments

### 1. Preview Deployments

- Each pull request will generate a unique preview URL
- Use this URL to test changes before merging to the main branch

### 2. Production Deployments

- Changes to the main branch will deploy to your production URL
- Monitor deployment status in the Vercel dashboard

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are properly listed in package.json
   - Verify Next.js configuration is correct

2. **GitHub Permission Issues**
   - Ensure Vercel has the necessary permissions to your repository
   - Check GitHub access tokens if using manual deployment

3. **Deployment Not Triggering**
   - Verify webhook settings in GitHub repository
   - Check Vercel project settings to ensure auto-deploy is enabled

## Best Practices

1. **Use Branches**
   - Create feature branches for new features or changes
   - Use pull requests to review changes before merging to main

2. **Environment Variables**
   - Store sensitive information as environment variables in Vercel
   - Do not commit sensitive information to GitHub

3. **Regular Testing**
   - Test preview deployments thoroughly before merging to main
   - Set up automated tests if possible

## Next Steps

1. Set up a development workflow that works for your team
2. Consider implementing a staging environment
3. Set up monitoring and analytics for your deployed application
4. Implement a regular backup strategy for your code and data
