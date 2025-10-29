const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // Deploy UniversalWeb3Platform
  const UniversalWeb3Platform = await ethers.getContractFactory("UniversalWeb3Platform");
  const platform = await UniversalWeb3Platform.deploy(deployer.address, 250, deployer.address);
  await platform.waitForDeployment();
  const platformAddress = await platform.getAddress();
  console.log("UniversalWeb3Platform deployed at:", platformAddress);

  // Deploy SocialModule
  const SocialModule = await ethers.getContractFactory("SocialModule");
  const socialModule = await SocialModule.deploy("SocialModule", "1.0", platformAddress);
  await socialModule.waitForDeployment();
  const socialModuleAddress = await socialModule.getAddress();
  console.log("SocialModule deployed at:", socialModuleAddress);
}

main().catch(console.error);
