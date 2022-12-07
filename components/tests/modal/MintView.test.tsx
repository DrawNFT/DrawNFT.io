import { act, fireEvent, render, waitFor } from '@testing-library/react';
import MintView from '../../../components/modal/MintView';
import { Dispatch, SetStateAction } from 'react';
import { MintStatus } from '../../../components/modal/mintImage';

let mintStatus: MintStatus;

jest.mock('nft.storage', () => ({
  __esModule: true,
  NFTStorage: class {},
}));

jest.mock('../../../components/modal/mintImage', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/modal/mintImage'),
  // Since the function is exported as default, we have to call defualt here
  default: (
    setMintStatus: Dispatch<SetStateAction<MintStatus>>,
    setCurrentMintText: Dispatch<SetStateAction<string | undefined>>
  ) => {
    act(() => {
      setCurrentMintText('setCurrentMintText');
      setMintStatus(mintStatus);
    });
  },
}));

describe('MintView Component Test', () => {
  const blob: Blob = new Blob(['a'.repeat(10)], { type: 'image/jpeg' });
  const nftContract: any = jest.fn();
  const account = 'account';

  it('Renders initially', () => {
    // given
    global.URL.createObjectURL = jest.fn(() => 'details');

    // when
    const { container } = render(
      <MintView imageBlob={blob} account={account} nftContract={nftContract} />
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('Renders with button click - MintStatus: Ongoing', async () => {
    // given
    global.URL.createObjectURL = jest.fn(() => 'details');
    mintStatus = MintStatus.Ongoing;

    // when
    const { container } = render(
      <MintView imageBlob={blob} account={account} nftContract={nftContract} />
    );

    const button = container.querySelector('button');
    button?.click();

    // then
    expect(button?.textContent).toBe('Mint NFT');
    await waitFor(() => {
      expect(container.querySelectorAll('p')[0].textContent).toBe(
        'It might take couple of minutes. Please be patient.'
      );
    });
  });

  it('Renders with button click - MintStatus: Done', async () => {
    // given
    global.URL.createObjectURL = jest.fn(() => 'details');
    mintStatus = MintStatus.Done;

    // when
    const { container } = render(
      <MintView imageBlob={blob} account={account} nftContract={nftContract} />
    );

    const button = container.querySelector('button');
    button?.click();

    // then
    expect(button?.textContent).toBe('Mint NFT');
    await waitFor(() => {
      expect(container.querySelector('p')?.textContent).toBe(
        'setCurrentMintText'
      );
    });
  });

  it('Renders with textarea/input interaction', async () => {
    // given
    global.URL.createObjectURL = jest.fn(() => 'details');
    mintStatus = MintStatus.Done;

    // when
    const { container } = render(
      <MintView imageBlob={blob} account={account} nftContract={nftContract} />
    );

    const input = container.querySelector('input')!;
    const textArea = container.querySelector('textarea')!;
    act(() => {
      fireEvent.change(input, { target: { value: 'test' } });
      fireEvent.change(textArea, { target: { value: 'testTextArea' } });
    });

    // then
    expect(input.value).toBe('test');
    expect(textArea.value).toBe('testTextArea');
  });
});
