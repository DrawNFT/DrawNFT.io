import mintImage, { MintStatus } from '../../mintModal/mintImage';

describe('Mint Image Function Test', () => {
  const setMintStatus = jest.fn();
  const setCurrentMintText = jest.fn();
  const nftContract: any = jest.fn();
  const account = 'account';
  const ipfsClient: any = jest.fn();
  const mBlob: any = jest.fn();

  beforeEach(() => {
    process.env.SIGNER_MNEMONIC = 'SIGNER_MNEMONIC';
    setMintStatus.mockClear();
    setCurrentMintText.mockClear();
  });

  it('mintImage undefined nftNameInput', () => {
    // given
    const nftNameInput = undefined;
    const nftDescriptionInput = 'nftDescriptionInput';

    // when
    mintImage(
      setMintStatus,
      setCurrentMintText,
      nftContract,
      account,
      nftNameInput,
      nftDescriptionInput,
      ipfsClient,
      mBlob
    );

    expect(setMintStatus).toBeCalledWith(MintStatus.Done);
    expect(setMintStatus).toBeCalledTimes(1);

    expect(setCurrentMintText).toBeCalledWith(
      'NFT name should have more than 5 characters'
    );
    expect(setCurrentMintText).toBeCalledTimes(1);
  });

  it('NFT Description should have more than 10 characters', () => {
    // given
    const nftNameInput = 'nftNameInput';
    const nftDescriptionInput = undefined;

    // when
    mintImage(
      setMintStatus,
      setCurrentMintText,
      nftContract,
      account,
      nftNameInput,
      nftDescriptionInput,
      ipfsClient,
      mBlob
    );

    expect(setMintStatus).toBeCalledWith(MintStatus.Done);
    expect(setMintStatus).toBeCalledTimes(1);

    expect(setCurrentMintText).toBeCalledWith(
      'NFT Description should have more than 10 characters'
    );
    expect(setCurrentMintText).toBeCalledTimes(1);
  });
});
