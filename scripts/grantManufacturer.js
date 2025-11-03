// scripts/grantManufacturer.js
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const contractAddress = process.env.CAR_REGISTRY_ADDRESS; // set in .env
  const manufacturerAddress = process.argv[2]; // pass target address as arg

  if (!contractAddress || !manufacturerAddress) {
    console.error("Usage: node grantManufacturer.js <manufacturerAddress>");
    process.exit(1);
  }

  const CarRegistry = await ethers.getContractFactory("CarRegistry");
  const carRegistry = CarRegistry.attach(contractAddress);

  // grant role using signer (must be admin)
  const grantTx = await carRegistry.grantRole(ethers.utils.id("MANUFACTURER_ROLE"), manufacturerAddress);
  console.log("Grant tx sent:", grantTx.hash);
  await grantTx.wait();
  console.log("MANUFACTURER_ROLE granted to", manufacturerAddress);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
