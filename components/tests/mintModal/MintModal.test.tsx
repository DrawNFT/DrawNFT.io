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

const useAccountStoreFn = jest.fn();
const useNftContractStoreFn = jest.fn();

jest.mock('../../../components/utils/useAccountStore', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/utils/useAccountStore'),
  useAccountStore: () => useAccountStoreFn(),
}));

jest.mock('../../../components/utils/useNftContractStore', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/utils/useNftContractStore'),
  useNftContractStore: () => useNftContractStoreFn(),
}));

describe('MintModal Component Test', () => {
  const setShowModal = jest.fn();
  const image: string = 'image';

  it('Renders without image correctly', () => {
    // given
    useAccountStoreFn.mockReturnValue('useNftContractStore');
    useNftContractStoreFn.mockReturnValue('useAccountStore');

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
    useAccountStoreFn.mockReturnValue(undefined);
    useNftContractStoreFn.mockReturnValue('useAccountStore');

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
    useAccountStoreFn.mockReturnValue('useNftContractStore');
    useNftContractStoreFn.mockReturnValue(undefined);

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
    useAccountStoreFn.mockReturnValue('useNftContractStore');
    useNftContractStoreFn.mockReturnValue('useAccountStore');

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
