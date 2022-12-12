import { ethers } from 'ethers';
import { useState } from 'react';
import { create as ipfsCreate } from 'ipfs-http-client';
import mintImage, { MintStatus } from './mintImage';

type MintViewProps = {
  imageBlob: Blob;
  account: string;
  nftContract: ethers.Contract;
};

const MintView = ({ imageBlob, account, nftContract }: MintViewProps) => {
  const [nftName, setNftName] = useState<string>('');
  const [nftDescription, setNftDescription] = useState<string>('');
  const [currentMintText, setCurrentMintText] = useState<string>('');
  const [mintStatus, setMintStatus] = useState<MintStatus>(
    MintStatus.NotStarted
  );

  const projectId = process.env.INFURA_IPFS_PROJECT_ID;
  const projectSecret = process.env.INFURA_IPFS_PROJECT_SECRET;
  const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

  const ipfsClient = ipfsCreate({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });

  switch (mintStatus) {
    case MintStatus.NotStarted: {
      return (
        <>
          <div className="flex justify-center">
            <img
              src={URL.createObjectURL(imageBlob)}
              className="max-w-xs max-h-xs border border-black m-3"
            />
          </div>

          <div className="relative px-6 py-3 flex-auto">
            <form className="bg-white">
              <input
                id="message"
                className="p-2.5 my-2 w-full text-sm rounded-lg border"
                value={nftName}
                onChange={(e) => {
                  setNftName(e.target.value);
                }}
                placeholder="NFT Name"
              />
              <textarea
                id="message"
                rows={6}
                className="p-2.5 my-2 w-full text-sm rounded-lg border"
                value={nftDescription}
                onChange={(e) => {
                  setNftDescription(e.target.value);
                }}
                placeholder="NFT Description..."
              />
            </form>
          </div>
          <div className="flex items-center justify-end px-6 py-3 border-t border-solid border-slate-200 rounded-b">
            <button
              className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() =>
                mintImage(
                  setMintStatus,
                  setCurrentMintText,
                  nftContract,
                  account,
                  nftName,
                  nftDescription,
                  ipfsClient,
                  imageBlob
                )
              }
            >
              Mint NFT
            </button>
          </div>
        </>
      );
    }

    case MintStatus.Ongoing: {
      return (
        <div className="flex justify-center items-center p-6">
          <div className="flex flex-col gap-8 items-center justify-center ">
            <p>It might take couple of minutes. Please be patient.</p>
            <div>
              <b>Name:</b>
              <p className="whitespace-normal break-all">{nftName}</p>
            </div>
            <div>
              <b>Description:</b>
              <p className="whitespace-normal break-all">{nftDescription}</p>
            </div>
            <p>{currentMintText}</p>
            <div className="w-40 h-40 border-t-4 border-b-4 border-green-900 rounded-full animate-spin"></div>
          </div>
        </div>
      );
    }

    case MintStatus.Done: {
      return (
        <div className="flex justify-center items-center p-6">
          <div className="flex flex-col gap-8 items-center justify-center ">
            <p>{currentMintText}</p>
          </div>
        </div>
      );
    }
  }
};

export default MintView;
