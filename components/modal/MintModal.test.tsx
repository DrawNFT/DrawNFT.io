import MintModal from './MintModal';
import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import React, { Dispatch, SetStateAction } from 'react';

jest.mock('./Modal', () => ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <h1>Modal COMPONENT</h1>
      {children}
    </>
  );
});

jest.mock('./MintView', () => () => {
  return (
    <>
      <h2>MintView COMPONENT</h2>
    </>
  );
});

describe('MintModal Component Test', () => {
  const setShowModal = jest.fn();
  const mBlob: any = jest.fn();
  const nftContract: any = jest.fn();
  const account = 'account';

  it('Renders without image correctly', () => {
    // given / when
    const { container } = render(
      <MintModal
        showModal={true}
        setShowModal={setShowModal}
        nftContract={nftContract}
        account={account}
      />
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
    // given / when
    const { container } = render(
      <MintModal
        showModal={true}
        setShowModal={setShowModal}
        imageBlob={mBlob}
        nftContract={nftContract}
      />
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
    // given / when
    const { container } = render(
      <MintModal
        showModal={true}
        setShowModal={setShowModal}
        imageBlob={mBlob}
        account={account}
      />
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
    // given / when
    const { container } = render(
      <MintModal
        showModal={true}
        setShowModal={setShowModal}
        imageBlob={mBlob}
        account={account}
        nftContract={nftContract}
      />
    );

    const modalText = container.querySelector('h1');
    const childText = container.querySelector('h2');

    // then
    expect(modalText?.textContent).toBe('Modal COMPONENT');
    expect(childText?.textContent).toBe('MintView COMPONENT');
    expect(container).toMatchSnapshot();
  });
});
