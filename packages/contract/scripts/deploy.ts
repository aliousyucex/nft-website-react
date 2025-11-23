import fs from "node:fs";
import path from "node:path";
import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Starting Ivora contract deployment...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  
  console.log("📍 Deploying from address:", deployerAddress);
  console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployerAddress)), "ETH\n");

  // Deploy contract
  console.log("📝 Deploying Ivora contract...");
  const Ivora = await ethers.getContractFactory("Ivora");
  const contract = await Ivora.deploy();

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("✅ Contract deployed to:", contractAddress);
  console.log("🔗 Transaction hash:", contract.deploymentTransaction()?.hash);
  console.log("👤 Owner:", deployerAddress, "\n");

  // Save deployment info
  const network = await ethers.provider.getNetwork();
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(), // Convert BigInt to string
    contractAddress: contractAddress,
    owner: deployerAddress,
    deployedAt: new Date().toISOString(),
    transactionHash: contract.deploymentTransaction()?.hash,
  };

  // Save to file
  const deploymentDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  const deploymentFile = path.join(
    deploymentDir,
    `deployment-${deploymentInfo.network}-${Date.now()}.json`
  );
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log("📄 Deployment info saved to:", deploymentFile);

  // Save ABI
  const abiDir = path.join(__dirname, "../artifacts/contracts/ivora.sol");
  const abiFile = path.join(abiDir, "Ivora.json");
  
  if (fs.existsSync(abiFile)) {
    const artifact = JSON.parse(fs.readFileSync(abiFile, "utf8"));
    const abiOutputFile = path.join(deploymentDir, "Ivora.abi.json");
    fs.writeFileSync(abiOutputFile, JSON.stringify(artifact.abi, null, 2));
    console.log("📋 ABI saved to:", abiOutputFile);
  }

  console.log("\n✨ Deployment complete!");
  console.log("\n📌 Important: Add this to your .env file:");
  console.log(`CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`OWNER_ADDRESS=${deployerAddress}\n`);

  // If on testnet, instructions for verification
  if (network.name.includes("testnet") || network.chainId === BigInt(10143)) {
    console.log("🔍 To verify contract, run:");
    if (network.chainId === BigInt(10143)) {
      console.log(`npx hardhat verify --network monadTestnet ${contractAddress}\n`);
    } else if (network.name.includes("abstract")) {
      console.log(`npx hardhat verify --network abstractTestnet ${contractAddress}\n`);
    } else {
      console.log(`npx hardhat verify --network ${network.name} ${contractAddress}\n`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

