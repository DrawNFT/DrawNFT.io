import Modal from './Modal';
import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';

describe('Modal Component Test', () => {
  const setShowModal = jest.fn();
  const content = <p>Emtpy Text</p>;
  const title = 'Title';

  it('Renders correctly with showModal=true', () => {
    // given / when
    const { container } = render(
      <Modal title={title} showModal={true} setShowModal={setShowModal}>
        {content}
      </Modal>
    );

    const contentComponent = container.querySelector('p');

    // then
    expect(container).toMatchSnapshot();
    expect(contentComponent?.textContent).toBe('Emtpy Text');
  });

  it('Renders correctly with showModal=false', () => {
    // given / when
    const { container } = render(
      <Modal title={title} showModal={false} setShowModal={setShowModal}>
        {content}
      </Modal>
    );

    // then
    expect(container).toMatchInlineSnapshot(`<div />`);
  });

  it('Closes the Modal', () => {
    // given / when
    const { container } = render(
      <Modal title={title} showModal={true} setShowModal={setShowModal}>
        {content}
      </Modal>
    );
    const button = container.querySelector('button');
    button?.click();

    // then
    expect(setShowModal).toBeCalledWith(false);
    expect(setShowModal).toHaveBeenCalledTimes(1);
  });
});
