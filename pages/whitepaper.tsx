import React from 'react';
import Navbar from '../components/Navbar';

const WhitePaper = () => {
  return (
    <>
      <Navbar />
      <div className="px-4 py-8 max-w-xl mx-auto font-sans font-light leading-normal text-gray-800">
        <h1 className="text-2xl font-bold text-gray-700 mb-8">DrawNFT</h1>
        <p className="mb-6">
          DrawNFT is a web3 application that allows users to draw and mint their
          drawings as non-fungible tokens (NFTs). The application is built on
          the Ethereum blockchain using the ERC721 standard for NFTs.
        </p>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Features</h2>
        <ul className="list-disc pl-4 mb-8">
          <li className="mb-2">
            Draw: Create and save your own drawings using the built-in drawing
            tool.
          </li>
          <li className="mb-2">
            Mint: Turn your drawings into unique NFTs that can be owned and
            traded.
          </li>
          <li className="mb-2">
            URI Storage: Each NFT includes a URI that points to the location of
            the drawing file, allowing it to be easily accessed and viewed.
          </li>
          <li>
            Security: The application uses a signature verification process to
            ensure that only the intended user can mint NFTs from the website.
          </li>
        </ul>
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          How to Use DrawNFT
        </h2>
        <ol className="pl-4 mb-8 list-decimal">
          <li className="mb-2">
            Connect your Ethereum wallet to the application. This will allow you
            to interact with the contract and mint NFTs.
          </li>
          <li className="mb-2">
            Use the drawing tool to create your drawing. The website
            automatically saves your progress.
          </li>
          <li className="mb-2">
            Click the "Mint NFT" button and provide a name and description for
            your drawing.
          </li>
          <li className="mb-2">
            Confirm the transaction and pay the minting fee of 0.07 ETH. This
            will mint your NFT and add it to your Ethereum wallet.
          </li>
          <li>
            Once the minting process is complete, you can view and manage your
            NFT on a marketplace such as OpenSea.
          </li>
        </ol>
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Additional Information
        </h2>
        <h3 className="text-lg font-bold text-gray-700 mb-2">Token Supply</h3>
        <p className="mb-2">
          The total supply of NFTs is limited to 5555. Once this limit is
          reached, no further NFTs can be minted.
        </p>
        <h3 className="text-lg font-bold text-gray-700 mb-2">Minting Fees</h3>
        <p className="mb-2">
          The owner of the contract can withdraw any ETH collected from minting
          fees at any time.
        </p>
        <h3 className="text-lg font-bold text-gray-700 mb-2">
          Signing Process
        </h3>
        <p className="mb-2">
          The signing process is currently set up to only allow a specific
          Ethereum address to mint NFTs, but this can be changed by the contract
          owner. This allows users to mint only from this website.
        </p>
      </div>
    </>
  );
};

export default WhitePaper;
