import { Dispatch, SetStateAction } from 'react';
import MintView from './MintView';
import Modal from './Modal';
import { useAccountStore } from '../utils/useAccountStore';
import { useNftContractStore } from '../utils/useNftContractStore';

type MintModalProps = {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  imageBlob?: Blob;
};

const MintModal = ({ showModal, setShowModal, imageBlob }: MintModalProps) => {
  const account = useAccountStore((state) => state.account);
  const nftContract = useNftContractStore((state) => state.nftContract);

  const modalTitle = 'Mint Your NFT!';

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
