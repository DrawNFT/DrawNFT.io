import { FC } from "react";
import Link from "next/link";
import { ethers } from "ethers";

type NavBarProps = {
    accountId?: string;
    web3Handler?: () => Promise<void>;
    nftContract: ethers.Contract | undefined;
};

const NavBar: FC<NavBarProps> = ({ accountId, web3Handler, nftContract }) => {
    return (
        <nav className="w-full border-b border-gray-200 px-2 sm:px-4 py-2.5 dark:bg-violet-900 sticky top-0 z-40">
            <div className="flex flex-wrap items-center justify-between">
                <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white flex gap-4">
                    <Link href="/">Home</Link>
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
                    {accountId == process.env.WITHDRAW_ACCOUNT && (
                        <button
                            onClick={async () => {
                                await nftContract?.withdrawMintPayments();
                            }}
                        >
                            Withdraw Payments
                        </button>
                    )}

                    {accountId ? (
                        <p>{accountId}</p>
                    ) : (
                        <button onClick={web3Handler}>Connect Wallet</button>
                    )}
                </span>
            </div>
        </nav>
    );
};

export default NavBar;
