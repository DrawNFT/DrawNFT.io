import { Dispatch, SetStateAction } from 'react';
import { ethers } from 'ethers';
import { Blob } from 'nft.storage';
import MintView from './MintView';
import Modal from './Modal';

type MintModalProps = {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  imageBlob?: Blob;
  nftContract?: ethers.Contract;
  account?: string;
};

const MintModal = ({
  showModal,
  setShowModal,
  imageBlob,
  nftContract,
  account,
}: MintModalProps) => {
  const modalTitle = 'Mint Your NFT!';
  if (!imageBlob) {
    return (
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        title={modalTitle}
      >
        <div className="flex justify-center items-center p-6">
          <div className="flex flex-col gap-8 items-center justify-center">
            <p>Couldn't convert the image to the required format!</p>
          </div>
        </div>
      </Modal>
    );
  }

  if (!nftContract || !account) {
    return (
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        title={modalTitle}
      >
        <div className="flex justify-center items-center p-6">
          <div className="flex flex-col gap-8 items-center justify-center">
            <p>Please make sure that you are connected with your Wallet!</p>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal showModal={showModal} setShowModal={setShowModal} title={modalTitle}>
      <MintView
        imageBlob={imageBlob}
        account={account}
        nftContract={nftContract}
      />
    </Modal>
  );
};

export default MintModal;
