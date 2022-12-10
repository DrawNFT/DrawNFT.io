import { FC } from 'react';
import Link from 'next/link';
import { useWeb3Handler } from './utils/useWeb3Handler';

const NavBar: FC = () => {
  const { account, nftContract } = useWeb3Handler();

  return (
    <nav className="w-full border-b border-gray-200 px-2 sm:px-4 py-2.5 dark:bg-violet-900 sticky top-0 z-40">
      <div className="flex flex-wrap items-center justify-between">
        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/whitepaper">White Paper</Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/DrawNFT/DrawNFT.io"
          >
            Github
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/DrawNFTio"
          >
            Twitter
          </Link>
        </span>

        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white flex gap-10">
          {account &&
            account?.toLowerCase() ===
              process.env.WITHDRAW_ACCOUNT?.toLowerCase() && (
              <button
                onClick={async () => {
                  await nftContract?.withdrawMintPayments();
                }}
              >
                Withdraw Payments
              </button>
            )}

          {account ? (
            <p>{account}</p>
          ) : (
            <button
              onClick={() => {
                alert('You need a web3 wallet to intract with this app!');
              }}
            >
              Connect Wallet
            </button>
          )}
        </span>
      </div>
    </nav>
  );
};

export default NavBar;
