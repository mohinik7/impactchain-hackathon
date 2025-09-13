import hre from "hardhat";

async function main() {
  console.log("🚀 Setting up Polygon Amoy testnet connection...\n");

  try {
    // Get network info - Hardhat 3 approach
    const hardhatConfig = hre.config;
    const availableNetworks = Object.keys(hardhatConfig.networks);
    
    console.log("🌐 Network Details:");
    console.log("   Available networks:", availableNetworks.join(", "));
    
    // Since hre.network.name is undefined in Hardhat 3, let's check the amoy config directly
    const amoyConfig = hardhatConfig.networks.amoy;
    
    if (amoyConfig) {
      console.log("   ✅ Amoy network configuration found!");
      console.log("   Chain ID:", amoyConfig.chainId);
      console.log("   RPC URL:", amoyConfig.url || "Not set");
      console.log("   Type:", amoyConfig.type);
      
      if (amoyConfig.chainId === 80002) {
        console.log("\n✅ Successfully configured for Polygon Amoy testnet!");
        console.log("   You can now deploy contracts to Amoy using:");
        console.log("   npx hardhat run scripts/deploy.js --network amoy");
      } else {
        console.log("\n❌ Amoy network chain ID is incorrect. Expected: 80002, Got:", amoyConfig.chainId);
      }
    } else {
      console.log("   ❌ Amoy network configuration not found!");
    }
    
    console.log("\n📋 Configuration Status:");
    console.log("   Environment variables loaded:", process.env.DEPLOYER_PRIVATE_KEY ? "✅ Yes" : "❌ No");
    console.log("   RPC URL set:", process.env.POLYGON_AMOY_RPC_URL ? "✅ Yes" : "❌ No (using fallback)");

    console.log("\n📝 Next steps:");
    console.log("   1. Make sure you have testnet POL from: https://faucet.polygon.technology/");
    console.log("   2. Deploy your contract: npx hardhat run scripts/deploy.js --network amoy");
    console.log("   3. View on block explorer: https://amoy.polygonscan.com/");

  } catch (error) {
    console.error("❌ Setup failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  });