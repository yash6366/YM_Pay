/**
 * Vercel Deployment Helper Script
 * 
 * This script provides instructions for deploying to Vercel.
 */

console.log(`
======================================================
YM-Pay Vercel Deployment Instructions
======================================================

1. Make sure you've committed all your changes to Git
   git add .
   git commit -m "Ready for deployment"
   git push

2. Install Vercel CLI if not already installed
   npm install -g vercel

3. Run the Vercel deployment command
   vercel

4. During the setup process:
   - Login to your Vercel account if prompted
   - Select "Link to existing project" if you've deployed before
   - Select your team/account
   - Set up the environment variables when prompted:
     * MONGODB_URI: Your MongoDB connection string
     * JWT_SECRET: Your JWT secret key
     * NEXTAUTH_URL: Your Vercel deployment URL
     * NEXTAUTH_SECRET: Your NextAuth secret key

5. Once deployed, verify your environment variables in the Vercel dashboard:
   - Go to your project in the Vercel dashboard
   - Navigate to "Settings" > "Environment Variables"
   - Ensure all required variables are set correctly

======================================================
`);

console.log('To run this deployment, execute: "npx vercel" in your terminal'); 