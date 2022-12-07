# DrawNFT.io

DrawNFT.io is a platform built with TypeScript that allows users to create their own NFTs by drawing their own images and selling them on the open market.

## Contributing to DrawNFT.io

We welcome all contributions to DrawNFT.io! Whether you're a seasoned developer or just starting out, there's a place for you in this project. Here's how to get started:

### Setting up the development environment

1. Fork the repository and clone it locally
2. Install dependencies with `pnpm install`
3. Compile and deploy contracts with `pnpm run test`
4. Start the development server with `pnpm run dev`

### Submitting changes

1. Create a new branch for your changes
2. Make your changes and test them thoroughly
3. Submit a pull request to the `develop` branch

### Code of Conduct

We expect all contributors to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

## Project setup

To set up the project locally, follow these steps:

### Installing dependencies

Run `pnpm install` to install all required dependencies.

### Compiling and deploying contracts

Run `pnpm run test` to compile and deploy all contracts to a local test network.

### Starting the development server

Run `pnpm run dev` to start the development server and begin working on the project.

## Running tests

We have both Solidity and JavaScript tests in place to ensure the integrity of the project. To run these tests, follow these steps:

### Running Solidity tests

Run `pnpm run test` to run all Solidity tests.

### Running JavaScript tests

Run `pnpm run coverage` to run all JavaScript tests.

## Deployment

To deploy the project to a live network, follow these steps:

### Setting up the deployment environment

Make sure you have a [wallet](https://wallet.ethereum.org/) and some Ether in it for gas fees.

### Deploying to a test network

Run `pnpm run migrate --network rinkeby` to deploy the project to the Rinkeby test network.

### Deploying to mainnet

Run `pnpm run migrate --network mainnet` to deploy the project to the main Ethereum network.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

Thanks to [OpenZeppelin](https://openzeppelin.org/) for their solidity contracts and [OpenSea](https://opensea.io/) for the NFT marketplace platform.

