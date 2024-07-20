
# MyNFT Contract Deployment

## Overview

This project includes the MyNFT smart contract which is an ERC-721 token. The contract uses OpenZeppelin's ERC721 and Ownable contracts to manage unique digital assets on the blockchain.

## Environment Variables

In the `deploy.js` script, environment variables are used to configure the deployment settings. These variables are stored in a `.env` file. It is crucial not to share or reveal the contents of the `.env` file to anyone or publish it online to ensure the security of your deployment credentials.

## Building the Project

Before deploying the MyNFT contract, ensure your project is correctly set up:

1. **Install dependencies:**

   ```bash
   npm install
   ```

   This command installs all necessary dependencies listed in your `package.json` file.

2. **Compile the Contract:**

   ```bash
   npx hardhat compile
   ```

   This command compiles the smart contract and prepares it for deployment.

3. **Run Local Tests:**

   ```bash
   npx hardhat test
   ```

   Execute this command to run your tests and ensure that all functionalities work as expected before deploying to a testnet or mainnet.

## Deployment

To deploy the MyNFT contract on the Holesky testnet, follow these steps:

1. **Deploy the Contract:**

   ```bash
   npx hardhat run scripts/deploy.js --network holesky
   ```

   This command deploys the contract to the Holesky testnet using the account configured in your Hardhat setup.

## Useful Links

- Holesky Testnet: [Holesky URL](https://holesky.beaconcha.in/)
- Alchemy: [Official Site](https://www.alchemy.com/) | [Documentation](https://docs.alchemy.com/alchemy/)

## Contract Features

- **Minting:** Only the owner can mint new NFTs.
- **Ownership:** The contract uses the `Ownable` extension to handle ownership.
