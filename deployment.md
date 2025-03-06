# Deployment Guide for THE APPRENTICE Bingo

This guide provides detailed instructions for deploying THE APPRENTICE Bingo to various hosting platforms.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Preparing Your Application](#preparing-your-application)
- [Deployment Options](#deployment-options)
  - [Vercel Deployment](#vercel-deployment)
  - [Netlify Deployment](#netlify-deployment)
  - [DigitalOcean App Platform Deployment](#digitalocean-app-platform-deployment)
  - [AWS Amplify Deployment](#aws-amplify-deployment)
- [Post-Deployment Configuration](#post-deployment-configuration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

1. A complete and tested version of the application
2. Git installed and repository initialized
3. Required dependencies listed in `package.json`
4. Environment variables properly set up

## Preparing Your Application

1. **Update dependencies**:
   ```bash
   npm install
   ```

2. **Build your application**:
   ```bash
   npm run build
   ```

3. **Configure environment variables**:
   Create a `.env.example` file with required variables (but no actual values):
   ```
   NEXT_PUBLIC_API_URL=your_api_url
   NEXT_PUBLIC_SITE_URL=your_site_url
   ```

4. **Test your production build locally**:
   ```bash
   npm start
   ```

## Deployment Options

### Vercel Deployment

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel** (if using CLI):
   ```bash
   vercel login
   ```

3. **Deploy your application**:
   
   **Option 1: Using Vercel Dashboard**
   - Connect your GitHub repository to Vercel
   - Configure build settings and environment variables
   - Deploy

   **Option 2: Using Vercel CLI**
   ```bash
   vercel
   ```

4. **Configure environment variables**:
   - In the Vercel dashboard, go to your project settings
   - Add environment variables under the "Environment Variables" section

### Netlify Deployment

1. **Install Netlify CLI** (optional):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify** (if using CLI):
   ```bash
   netlify login
   ```

3. **Deploy your application**:
   
   **Option 1: Using Netlify Dashboard**
   - Connect your GitHub repository to Netlify
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Deploy

   **Option 2: Using Netlify CLI**
   ```bash
   netlify deploy
   ```

4. **Configure environment variables**:
   - In the Netlify dashboard, go to your site settings
   - Add environment variables under "Build & deploy" > "Environment"

### DigitalOcean App Platform Deployment

1. **Create a new App**:
   - Log in to your DigitalOcean account
   - Go to the App Platform section
   - Click "Create App"
   - Connect your GitHub repository

2. **Configure your app**:
   - Select the repository and branch
   - Configure as a Next.js app
   - Set the build command: `npm run build`
   - Set the run command: `npm start`

3. **Configure environment variables**:
   - Add environment variables in the "Environment Variables" section

4. **Deploy your application**:
   - Review settings and click "Launch App"

### AWS Amplify Deployment

1. **Install the Amplify CLI** (optional):
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. **Configure Amplify** (if using CLI):
   ```bash
   amplify configure
   ```

3. **Deploy your application**:
   
   **Option 1: Using Amplify Console**
   - Log in to the AWS Management Console
   - Navigate to AWS Amplify
   - Click "Connect app"
   - Connect your GitHub repository
   - Configure build settings:
     - Build command: `npm run build`
     - Output directory: `.next`

   **Option 2: Using Amplify CLI**
   ```bash
   amplify init
   amplify add hosting
   amplify publish
   ```

4. **Configure environment variables**:
   - In the Amplify Console, go to your app
   - Navigate to "Environment variables"
   - Add your environment variables

## Post-Deployment Configuration

1. **Set up custom domains**:
   - Configure your custom domain in your hosting provider's dashboard
   - Set up SSL certificates

2. **Configure analytics** (optional):
   - Set up Google Analytics or similar services
   - Add tracking code to your application

3. **Set up monitoring**:
   - Configure uptime monitoring
   - Set up error tracking

## Troubleshooting

### Common Issues

1. **Build failures**:
   - Check your build logs for errors
   - Ensure all dependencies are properly installed
   - Verify environment variables are correctly set

2. **Runtime errors**:
   - Check browser console for JavaScript errors
   - Verify API endpoints are correctly configured
   - Check server logs for backend issues

3. **Performance issues**:
   - Use Lighthouse to analyze performance
   - Optimize images and assets
   - Implement code splitting and lazy loading

### Getting Help

If you encounter issues not covered in this guide, consider:

- Checking the Next.js documentation
- Searching for similar issues on Stack Overflow
- Reaching out to the hosting provider's support
- Opening an issue in the project repository 