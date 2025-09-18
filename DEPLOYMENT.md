# Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the Secure Title Chain application to Vercel.

## Prerequisites

- GitHub account
- Vercel account
- Node.js (v18 or higher) installed locally
- Git installed

## Step 1: Prepare Your Repository

1. **Fork the Repository**
   - Go to [https://github.com/ByteMonkey2/secure-title-chain](https://github.com/ByteMonkey2/secure-title-chain)
   - Click the "Fork" button to create your own copy

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/secure-title-chain.git
   cd secure-title-chain
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Test Locally**
   ```bash
   npm run dev
   ```
   - Open [http://localhost:8080](http://localhost:8080) to verify the application works

## Step 2: Deploy to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Sign in to Vercel**
   - Go to [https://vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose your forked `secure-title-chain` repository
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Set Environment Variables**
   Click "Environment Variables" and add the following:

   ```
   NEXT_PUBLIC_CHAIN_ID=11155111
   NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
   NEXT_PUBLIC_INFURA_API_KEY=YOUR_INFURA_API_KEY
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete (usually 2-3 minutes)

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Directory**
   ```bash
   cd secure-title-chain
   vercel
   ```

4. **Follow the Prompts**
   - Link to existing project or create new
   - Set up environment variables
   - Deploy

## Step 3: Configure Domain (Optional)

1. **Custom Domain**
   - Go to your project dashboard in Vercel
   - Click "Domains" tab
   - Add your custom domain
   - Configure DNS records as instructed

2. **SSL Certificate**
   - Vercel automatically provides SSL certificates
   - HTTPS is enabled by default

## Step 4: Environment Variables Configuration

### Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_CHAIN_ID` | `11155111` | Sepolia testnet chain ID |
| `NEXT_PUBLIC_RPC_URL` | `https://sepolia.infura.io/v3/YOUR_INFURA_KEY` | RPC endpoint |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | `YOUR_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID |

### Optional Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_INFURA_API_KEY` | `YOUR_INFURA_API_KEY` | Infura API key |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | `TBD` | Deployed contract address |
| `NEXT_PUBLIC_VERIFIER_ADDRESS` | `TBD` | Verifier contract address |
| `NEXT_PUBLIC_INSPECTOR_ADDRESS` | `TBD` | Inspector contract address |

## Step 5: Post-Deployment Configuration

1. **Verify Deployment**
   - Visit your Vercel deployment URL
   - Test wallet connection
   - Verify all features work correctly

2. **Monitor Performance**
   - Use Vercel Analytics (if enabled)
   - Monitor build logs for any issues
   - Check function execution logs

3. **Set up Automatic Deployments**
   - Connect to GitHub repository
   - Enable automatic deployments on push to main branch
   - Configure preview deployments for pull requests

## Step 6: Smart Contract Deployment

### Deploy FHE Contracts

1. **Install Hardhat**
   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   ```

2. **Configure Hardhat**
   Create `hardhat.config.js`:
   ```javascript
   require("@nomicfoundation/hardhat-toolbox");
   
   module.exports = {
     solidity: "0.8.24",
     networks: {
       sepolia: {
         url: process.env.NEXT_PUBLIC_RPC_URL,
         accounts: [process.env.PRIVATE_KEY]
       }
     }
   };
   ```

3. **Deploy Contracts**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

4. **Update Environment Variables**
   - Add contract addresses to Vercel environment variables
   - Redeploy the application

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names (case-sensitive)
   - Verify values are correct

3. **Wallet Connection Issues**
   - Verify WalletConnect project ID
   - Check RPC URL is accessible
   - Ensure chain ID is correct

4. **FHE Integration**
   - Verify FHE network configuration
   - Check contract deployment
   - Ensure proper encryption setup

### Performance Optimization

1. **Build Optimization**
   - Enable Vercel's automatic optimizations
   - Use dynamic imports for large components
   - Optimize images and assets

2. **Caching**
   - Configure appropriate cache headers
   - Use Vercel's edge caching
   - Implement service worker for offline support

## Monitoring and Maintenance

1. **Analytics**
   - Enable Vercel Analytics
   - Monitor Core Web Vitals
   - Track user engagement

2. **Updates**
   - Set up automatic dependency updates
   - Monitor security vulnerabilities
   - Keep dependencies up to date

3. **Backup**
   - Regular database backups (if applicable)
   - Code repository backups
   - Environment variable documentation

## Support

For deployment issues:
- Check Vercel documentation: [https://vercel.com/docs](https://vercel.com/docs)
- Review build logs in Vercel dashboard
- Contact support through Vercel dashboard

For application issues:
- Check GitHub issues: [https://github.com/ByteMonkey2/secure-title-chain/issues](https://github.com/ByteMonkey2/secure-title-chain/issues)
- Review application logs
- Test locally first

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive keys to repository
   - Use Vercel's secure environment variable storage
   - Rotate keys regularly

2. **Access Control**
   - Limit deployment access to trusted team members
   - Use branch protection rules
   - Implement code review processes

3. **Monitoring**
   - Set up alerts for failed deployments
   - Monitor for unusual traffic patterns
   - Regular security audits
