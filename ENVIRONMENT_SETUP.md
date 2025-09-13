# Environment Setup Guide

## Step 1.4: Secure Credential Management (Updated for Amoy)

This project uses environment variables to securely manage sensitive information. **Note: Polygon Mumbai has been deprecated and replaced with Amoy testnet.**

### Required Environment Variables

1. **DEPLOYER_PRIVATE_KEY**: Your wallet's private key for deployment
2. **POLYGON_AMOY_RPC_URL**: (Optional) Your Alchemy RPC URL for better performance

### Setup Instructions

1. **Copy the template file:**
   ```bash
   cp env.template .env
   ```

2. **Get your private key from MetaMask:**
   - Open MetaMask
   - Click on account details
   - Click "Export Private Key"
   - Enter your password
   - Copy the private key

3. **Get your Alchemy RPC URL (Recommended):**
   - Go to [Alchemy Dashboard](https://dashboard.alchemy.com/)
   - Select your Amoy app
   - Copy the HTTPS URL from the "View Key" section
   - It should look like: `https://polygon-amoy.g.alchemy.com/v2/your-api-key`

4. **Update your .env file:**
   ```
   DEPLOYER_PRIVATE_KEY=0x1234567890abcdef...
   POLYGON_AMOY_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/your-api-key
   ```

5. **Add Amoy testnet to MetaMask:**
   - Network Name: Polygon Amoy
   - RPC URL: https://rpc-amoy.polygon.technology/ (or your Alchemy URL)
   - Chain ID: 80002
   - Currency Symbol: MATIC
   - Block Explorer: https://amoy.polygonscan.com/

6. **Get testnet MATIC:**
   - Visit [Alchemy Amoy Faucet](https://sepoliafaucet.com/) (recommended)
   - Or [Polygon Faucet](https://faucet.polygon.technology/)
   - Select "Amoy" network
   - Enter your wallet address
   - Request testnet MATIC

### What Changed with Amoy

- ✅ **Flexible RPC**: Use Alchemy for better performance or official endpoint as fallback
- ✅ **Simplified setup**: Only private key required
- ✅ **Official support**: Direct from Polygon team
- ✅ **Better reliability**: More stable than Mumbai
- ✅ **Enhanced features**: Alchemy provides better debugging and analytics

### Security Notes

- ✅ The `.env` file is already added to `.gitignore`
- ✅ Never commit your `.env` file to version control
- ✅ Use a dedicated wallet for development (not your main wallet)
- ✅ Keep your private keys secure and never share them

### Verification

After setting up your environment variables, you can test the connection:

```bash
npx hardhat run scripts/deploy.js --network amoy
```
