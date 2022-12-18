import { ethers } from 'ethers';
import { Dispatch, SetStateAction } from 'react';
import fetchPostHelper from '../utils/fetchPostHelper';

export enum MintStatus {
  NotStarted,
  Ongoing,
  Done,
}

const NFT_NAME_MIN_LENGTH = 5;
const NFT_DESC_MIN_LENGTH = 10;

const mintImage = async (
  setMintStatus: Dispatch<SetStateAction<MintStatus>>,
  setCurrentMintText: Dispatch<SetStateAction<string>>,
  nftContract: ethers.Contract,
  account: string,
  nftNameInput: string | undefined,
  nftDescriptionInput: string | undefined,
  image: string
) => {
  const errorHandler = async <T>(
    run: () => T,
    errorText: string
  ): Promise<T | undefined> => {
    try {
      return await run();
    } catch {
      setCurrentMintText(errorText);
      setMintStatus(MintStatus.Done);
      return undefined;
    }
  };

  const nftName = nftNameInput?.trim();
  const nftDescription = nftDescriptionInput?.trim();

  if (!nftName || nftName.length < NFT_NAME_MIN_LENGTH) {
    setMintStatus(MintStatus.Done);
    setCurrentMintText(
      `NFT name should have more than ${NFT_NAME_MIN_LENGTH} characters`
    );
    return;
  }

  if (!nftDescription || nftDescription.length < NFT_DESC_MIN_LENGTH) {
    setMintStatus(MintStatus.Done);
    setCurrentMintText(
      `NFT Description should have more than ${NFT_DESC_MIN_LENGTH} characters`
    );
    return;
  }

  setMintStatus(MintStatus.Ongoing);

  setCurrentMintText('Signing the message...');
  const signature = await errorHandler(async () => {
    const message = `${await nftContract.readNonce(account)}${account}`;
    console.log('message', message);
    const response = await fetchPostHelper<{
      v: string;
      s: string;
      r: string;
    }>('signCreator', JSON.stringify({ message }));
    return response;
  }, 'Process Failed while signing the message! Make sure you are connected to the ETH network with your Wallet!');

  if (!signature) {
    return;
  }

  setCurrentMintText('Image is uploading to IPFS...');
  const imageCid = await errorHandler(async () => {
    const response = await fetchPostHelper<{ cid: string }>(
      'ipfsImageHandler',
      JSON.stringify({ imageData: image })
    );
    return response?.cid;
  }, 'Process Failed while uploading the image! Make sure you are connected to the internet!');

  if (!imageCid) {
    return;
  }

  setCurrentMintText('Metadata is uploading to IPFS...');
  const metadataCid = await errorHandler(async () => {
    const response = await fetchPostHelper<{ cid: string }>(
      'ipfsMetadataHandler',
      JSON.stringify({
        name: nftName,
        description: nftDescription,
        image: `ipfs://${imageCid}`,
      })
    );
    return response?.cid;
  }, 'Process Failed while uploading the metadata! Make sure you are connected to the internet!');

  if (!metadataCid) {
    return;
  }

  setCurrentMintText('Waiting for the MetaMask confirmation...');
  const isSuccess = await errorHandler(async () => {
    const metaDataUri = `ipfs://${metadataCid}`;
    const messageVerifyAttributes = {
      v: signature.v,
      s: signature.s,
      r: signature.r,
    };

    const tx = await nftContract.safeMint(
      metaDataUri,
      messageVerifyAttributes,
      {
        value: ethers.utils.parseEther('0.04'),
      }
    );

    await tx.wait();

    return true;
  }, 'Process Failed while waiting for the MetaMask confirmation! Make sure you are accepted the transaction!');

  if (!isSuccess) {
    return;
  }

  setCurrentMintText(
    'Process Finished! You can check your masterpiece by using OpenSea'
  );
  setMintStatus(MintStatus.Done);
};

export default mintImage;
