import { ethers } from 'ethers';
import { NFTStorage } from 'nft.storage';
import { Dispatch, SetStateAction } from 'react';

export enum MintStatus {
  NotStarted,
  Ongoing,
  Done,
}

const NFT_NAME_MIN_LENGTH = 5;
const NFT_DESC_MIN_LENGTH = 10;

const mintImage = async (
  setMintStatus: Dispatch<SetStateAction<MintStatus>>,
  setCurrentMintText: Dispatch<SetStateAction<string | undefined>>,
  nftContract: ethers.Contract,
  account: string,
  nftNameInput: string | undefined,
  nftDescriptionInput: string | undefined,
  ipfsClient: NFTStorage,
  imageBlob: Blob
) => {
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
  setCurrentMintText('Process is starting...');

  try {
    const signMessage = async (): Promise<ethers.Signature> => {
      const signer = ethers.Wallet.fromMnemonic(
        process.env.SIGNER_MNEMONIC || ''
      );

      // message to sign
      const message = `${await nftContract.readNonce(account)}${account}`;
      const messageHash = ethers.utils.id(message);
      const messageHashArray = ethers.utils.arrayify(messageHash);

      // sign hashed message
      const signature = await signer.signMessage(messageHashArray);

      // split signature
      return ethers.utils.splitSignature(signature);
    };
    setCurrentMintText('Signing the message...');
    const signature = await signMessage();

    setCurrentMintText('Image is uploading to IPFS...');
    const imageFile = new File([imageBlob], `image.png`, {
      type: 'image/png',
    });
    const cidImage = await ipfsClient.storeDirectory([imageFile]);

    console.log('cidImage', cidImage);

    setCurrentMintText('Metadata is uploading to IPFS...');
    const metaData = JSON.stringify({
      name: nftName,
      description: nftDescription,
      image: `https://${cidImage}.ipfs.nftstorage.link/image.png`,
    });

    console.log('metaData', metaData);
    const cidMetadata = await ipfsClient.storeBlob(new Blob([metaData]));

    setCurrentMintText('Waiting for the MetaMask confirmation...');
    const metaDataUri = `https://${cidMetadata}.ipfs.nftstorage.link/`;

    const messageVerifyAttributes = {
      v: signature.v,
      s: signature.s,
      r: signature.r,
    };
    const tx = await nftContract.safeMint(
      metaDataUri,
      messageVerifyAttributes,
      {
        value: ethers.utils.parseEther('0.07'),
      }
    );

    setCurrentMintText('Waiting for the confirmation...');
    await tx.wait();
    setCurrentMintText(
      'Process Finished! You can check your masterpiece by using OpenSea'
    );
  } catch (e) {
    setCurrentMintText(
      `Process Failed! Make sure you are connected to the ETH network with your Wallet`
    );
  }
  setMintStatus(MintStatus.Done);
};

export default mintImage;
