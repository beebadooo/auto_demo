import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts...");

  const CarRegistry = await ethers.getContractFactory("CarRegistry");
  const carRegistry = await CarRegistry.deploy();
  await carRegistry.deployed();

  console.log("CarRegistry deployed to:", carRegistry.address);

  // print convenience instructions
  console.log(`
Add the following to your .env.local:

CAR_REGISTRY_ADDRESS=${carRegistry.address}
NEXT_PUBLIC_CAR_REGISTRY_ADDRESS=${carRegistry.address}
`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
