// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with", deployer.address);

  const CarRegistry = await hre.ethers.getContractFactory("CarRegistry");
  // pass admin address or deployer as admin
  const carRegistry = await CarRegistry.deploy(deployer.address);
  await carRegistry.deployed();

  console.log("CarRegistry deployed to:", carRegistry.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

