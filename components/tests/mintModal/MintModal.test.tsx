import MintModal from '../../../components/mintModal/MintModal';
import { render } from '@testing-library/react';
import React from 'react';

jest.mock(
  '../../../components/modal/Modal',
  () =>
    ({ children }: { children: React.ReactNode }) => {
      return (
        <>
          <h1>Modal COMPONENT</h1>
          {children}
        </>
      );
    }
);

jest.mock('../../../components/mintModal/MintView', () => () => {
  return (
    <>
      <h2>MintView COMPONENT</h2>
    </>
  );
});

const useWeb3HandlerFn = jest.fn();

jest.mock('../../../components/utils/useWeb3Handler', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/utils/useWeb3Handler'),
  useWeb3Handler: () => useWeb3HandlerFn(),
}));

describe('MintModal Component Test', () => {
  const setShowModal = jest.fn();
  const image: string = 'image';

  it('Renders without image correctly', () => {
    // given
    useWeb3HandlerFn.mockReturnValue({
      account: 'account',
      nftContract: 'nftContract',
    });

    // when
    const { container } = render(
      <MintModal showModal={true} setShowModal={setShowModal} />
    );

    const modalText = container.querySelector('h1');
    const childText = container.querySelector('p');

    // then
    expect(modalText?.textContent).toBe('Modal COMPONENT');
    expect(childText?.textContent).toBe(
      "Couldn't convert the image to the required format!"
    );
    expect(container).toMatchSnapshot();
  });

  it('Renders without account correctly', () => {
    // given
    useWeb3HandlerFn.mockReturnValue({
      account: undefined,
      nftContract: 'nftContract',
    });

    // when
    const { container } = render(
      <MintModal showModal={true} setShowModal={setShowModal} />
    );

    const modalText = container.querySelector('h1');
    const childText = container.querySelector('p');

    // then
    expect(modalText?.textContent).toBe('Modal COMPONENT');
    expect(childText?.textContent).toBe(
      'Please make sure that you are connected with your Wallet!'
    );
    expect(container).toMatchSnapshot();
  });

  it('Renders without nftContract correctly', () => {
    // given
    useWeb3HandlerFn.mockReturnValue({
      account: 'account',
      nftContract: undefined,
    });

    // when
    const { container } = render(
      <MintModal showModal={true} setShowModal={setShowModal} />
    );

    const modalText = container.querySelector('h1');
    const childText = container.querySelector('p');

    // then
    expect(modalText?.textContent).toBe('Modal COMPONENT');
    expect(childText?.textContent).toBe(
      'Please make sure that you are connected with your Wallet!'
    );
    expect(container).toMatchSnapshot();
  });

  it('Renders with all variables correctly', () => {
    // given
    useWeb3HandlerFn.mockReturnValue({
      account: 'account',
      nftContract: 'nftContract',
    });

    // when
    const { container } = render(
      <MintModal showModal={true} setShowModal={setShowModal} image={image} />
    );

    const modalText = container.querySelector('h1');
    const childText = container.querySelector('h2');

    // then
    expect(modalText?.textContent).toBe('Modal COMPONENT');
    expect(childText?.textContent).toBe('MintView COMPONENT');
    expect(container).toMatchSnapshot();
  });
});
