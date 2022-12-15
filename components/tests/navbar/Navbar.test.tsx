import Navbar from '../../../components/Navbar';
import { render } from '@testing-library/react';

const useWeb3HandlerFn = jest.fn();

jest.mock('../../../components/utils/useWeb3Handler', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/utils/useWeb3Handler'),
  useWeb3Handler: () => useWeb3HandlerFn(),
}));

describe('Navbar Component Test', () => {
  it('Renders correctly without env', () => {
    // given
    useWeb3HandlerFn.mockReturnValue({
      account: 'account',
      nftContract: 'nftContract',
    });

    // when
    const { container, getByText } = render(<Navbar />);

    // then
    expect(container).toMatchSnapshot();
    expect(getByText('account').closest('a')?.getAttribute('href')).toBe(
      'https://opensea.io/account'
    );
  });

  it('Renders correctly with button click without account', () => {
    // given
    useWeb3HandlerFn.mockReturnValue({
      account: undefined,
      nftContract: 'nftContract',
    });
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    // when
    const { container } = render(<Navbar />);

    const button = container.querySelector('button');
    button?.click();

    // then
    expect(container).toMatchSnapshot();
    expect(window.alert).toBeCalledWith(
      'You need a web3 wallet to intract with this app!'
    );
  });

  it('Renders correctly with withdraw payments button', () => {
    // given
    const nftContract = jest.fn();
    useWeb3HandlerFn.mockReturnValue({
      account: 'account',
      nftContract: { withdrawMintPayments: () => nftContract() },
    });
    process.env.WITHDRAW_ACCOUNT = 'account';

    // when
    const { container, getByText } = render(<Navbar />);

    const button = container.querySelector('button');
    button?.click();

    // then
    expect(container).toMatchSnapshot();
    expect(nftContract).toBeCalledTimes(1);
    expect(getByText('Withdraw Payments')).not.toBe(undefined);
  });

  it('render with account does not match with the process', () => {
    // given
    const nftContract = jest.fn();
    useWeb3HandlerFn.mockReturnValue({
      account: 'account',
      nftContract: { withdrawMintPayments: () => nftContract() },
    });
    process.env.WITHDRAW_ACCOUNT = 'not_account';

    // when
    const { container, getByText } = render(<Navbar />);

    // then
    expect(container).toMatchSnapshot();
    expect(() => getByText('Withdraw Payments')).toThrow();
  });
});
