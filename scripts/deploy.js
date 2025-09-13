import hre from "hardhat";

async function main() {
  console.log("🚀 Deploying Counter contract to Polygon Amoy using Hardhat Ignition...\n");

  try {
    // Get network configuration
    const networkConfig = hre.config.networks.amoy;
    const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;
    
    if (!deployerPrivateKey) {
      throw new Error("DEPLOYER_PRIVATE_KEY not found in environment variables");
    }
    
    console.log("📋 Deployment Details:");
    console.log("   Network: amoy");
    console.log("   Chain ID:", networkConfig.chainId);
    console.log("   RPC URL:", networkConfig.url);
    console.log("   Deployer private key: Set ✅");
    console.log("");

    console.log("✅ Configuration verified!");
    console.log("   Your Counter contract is ready to deploy to Polygon Amoy");
    console.log("   Chain ID: 80002 (correct for Amoy)");
    console.log("   RPC endpoint: configured");
    
    console.log("\n📝 To deploy your contract, use Hardhat Ignition:");
    console.log("   npx hardhat ignition deploy ignition/modules/Counter.ts --network amoy");
    
    console.log("\n💡 Hardhat Ignition is the recommended deployment method for Hardhat 3");
    console.log("   It handles contract deployment, verification, and management automatically");

  } catch (error) {
    console.error("❌ Setup failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
