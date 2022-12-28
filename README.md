# DrawNFT.io

DrawNFT.io is a platform built with TypeScript that allows users to create their own NFTs by drawing their own images and selling them on the open market.

## Contributing to DrawNFT.io

We welcome all contributions to DrawNFT.io! Whether you're a seasoned developer or just starting out, there's a place for you in this project. Here's how to get started:

### Setting up the development environment

1. Fork the repository and clone it locally
2. Install dependencies with `npm install`
3. Compile and deploy contracts with `npm run test`
4. Start the development server with `npm run dev`

### Submitting changes

1. Create a new branch for your changes
2. Make your changes and test them thoroughly
3. Submit a pull request to the `staging` branch

We use the staging branch to test new changes before they are merged into the main branch. After testing, the staging branch will be merged into the main branch.

### Code of Conduct

We expect all contributors to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

## Project setup

To set up the project locally, follow these steps:

### Installing dependencies

Run `npm install` to install all required dependencies.

### Compiling and deploying contracts

Run `npm run test` to compile and deploy all contracts to a local test network.

### Starting the development server

Run `npm run dev` to start the development server and begin working on the project.

## Running tests

We have both Solidity and JavaScript tests in place to ensure the integrity of the project. To run these tests, follow these steps:

### Running Solidity tests

Run `npx hardhat test` to run all Solidity tests in the `hardhat` directory.

### Running JavaScript tests

Run `make test` to run all JavaScript tests.

## Deployment

To deploy the project to a live network, follow these steps:

### Setting up the deployment environment

Make sure you have a [wallet](https://wallet.ethereum.org/) and some Ether in it for gas fees.

### Deploying to a test network

Run `npm run migrate --network goerli` to deploy the project to the Rinkeby test network.

### Deploying to mainnet

Run `npm run migrate --network mainnet` to deploy the project to the main Ethereum network.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

Thanks to [OpenZeppelin](https://openzeppelin.org/) for their solidity contracts and [OpenSea](https://opensea.io/) for the NFT marketplace platform.

