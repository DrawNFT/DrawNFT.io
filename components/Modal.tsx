import {
    Dispatch,
    FC,
    RefObject,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import { ethers } from "ethers";
import { NFTStorage, Blob } from "nft.storage";
import ModalWithText from "./ModalWithText";

type ModalProps = {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    imageBlob?: Blob;
    nftContract?: ethers.Contract;
    account?: string;
};

enum MintStatus {
    NotStarted,
    Ongoing,
    Done,
}

const Modal: FC<ModalProps> = ({
    showModal,
    setShowModal,
    imageBlob,
    nftContract,
    account,
}) => {
    if (!showModal) {
        return null;
    }

    if (!imageBlob) {
        return (
            <ModalWithText
                setShowModal={setShowModal}
                text="Couldn't convert the image to the required format!"
            />
        );
    }

    if (!nftContract) {
        return (
            <ModalWithText
                setShowModal={setShowModal}
                text="Please make sure that you are connected with your Wallet!"
            />
        );
    }

    const [nftName, setNftName] = useState<string>();
    const [nftDescription, setNftDescription] = useState<string>();
    const [currentMintText, setCurrentMintText] = useState<string | undefined>();
    const [mintStatus, setMintStatus] = useState<MintStatus>(
        MintStatus.NotStarted
    );

    const ipfsClient = new NFTStorage({
        token: process.env.NFT_STORAGE_KEY || "",
    });

    const handleExport = async () => {
        setMintStatus(MintStatus.Ongoing);
        setCurrentMintText("Process is starting...");

        try {
            const signMessage = async (): Promise<ethers.Signature> => {
                const signer = ethers.Wallet.fromMnemonic(
                    process.env.SIGNER_MNEMONIC || ""
                );

                // message to sign
                const message = `${await nftContract.readNonce(account)}${account}`;
                const messageHash = ethers.utils.id(message);
                const messageHashArray = ethers.utils.arrayify(messageHash);

                // sign hashed message
                const signature = await signer.signMessage(messageHashArray);

                // split signature
                return ethers.utils.splitSignature(signature);
            };
            setCurrentMintText("Signing the message...");
            const signature = await signMessage();

            setCurrentMintText("Image is uploading to IPFS...");
            const imageFile = new File([imageBlob], `image.png`, {
                type: "image/png",
            });
            const cidImage = await ipfsClient.storeDirectory([imageFile]);

            setCurrentMintText("Metadata is uploading to IPFS...");
            const metaData = JSON.stringify({
                name: nftName,
                description: nftDescription,
                image: `https://${cidImage}.ipfs.nftstorage.link/image.png`,
            });
            const cidMetadata = await ipfsClient.storeBlob(new Blob([metaData]));

            setCurrentMintText("Waiting for the MetaMask confirmation...");
            const metaDataUri = `https://${cidMetadata}.ipfs.nftstorage.link/`;

            const messageVerifyAttributes = {
                v: signature.v,
                s: signature.s,
                r: signature.r,
            };
            const tx = await nftContract.safeMint(
                metaDataUri,
                messageVerifyAttributes,
                {
                    value: ethers.utils.parseEther("0.07"),
                }
            );

            setCurrentMintText("Waiting for the confirmation...");
            await tx.wait();
            setCurrentMintText(
                "Process Finished! You can check your masterpiece by using OpenSea"
            );
        } catch (e) {
            setCurrentMintText(
                `Process Failed! Make sure you are connected to the ETH network with your Wallet`
            );
        }
        setMintStatus(MintStatus.Done);
    };

    const getMintStatusText = () => {
        switch (mintStatus) {
            case MintStatus.NotStarted: {
                return (
                    <>
                        <div className="flex justify-center">
                            <img
                                src={URL.createObjectURL(imageBlob)}
                                className="max-w-xs max-h-xs border border-black m-3"
                            />
                        </div>

                        <div className="relative px-6 py-3 flex-auto">
                            <form className="bg-white">
                                <input
                                    id="message"
                                    className="p-2.5 my-2 w-full text-sm rounded-lg border"
                                    minLength={5}
                                    onChange={(e) => {
                                        setNftName(e.target.value);
                                    }}
                                    placeholder="NFT Name"
                                />
                                <textarea
                                    id="message"
                                    rows={6}
                                    className="p-2.5 my-2 w-full text-sm rounded-lg border"
                                    minLength={5}
                                    onChange={(e) => {
                                        setNftDescription(e.target.value);
                                    }}
                                    placeholder="NFT Description..."
                                />
                            </form>
                        </div>
                        <div className="flex items-center justify-end px-6 py-3 border-t border-solid border-slate-200 rounded-b">
                            <button
                                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => handleExport().catch(console.error)}
                            >
                                Mint NFT
                            </button>
                        </div>
                    </>
                );
            }

            case MintStatus.Ongoing: {
                return (
                    <div className="flex justify-center items-center p-6">
                        <div className="flex flex-col gap-8 items-center justify-center ">
                            <p>It might take couple of minutes. Please be patient.</p>
                            <p>{currentMintText}</p>
                            <div className="w-40 h-40 border-t-4 border-b-4 border-green-900 rounded-full animate-spin"></div>
                        </div>
                    </div>
                );
            }

            case MintStatus.Done: {
                return (
                    <div className="flex justify-center items-center p-6">
                        <div className="flex flex-col gap-8 items-center justify-center ">
                            <p>{currentMintText}</p>
                        </div>
                    </div>
                );
            }
        }
    };

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto mx-auto max-w-7xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="flex items-start justify-between px-5 py-3 border-b border-solid border-slate-200 rounded-t">
                            <h3 className="text-xl font-semibold">Mint Your NFT!</h3>
                            <button
                                disabled={mintStatus == MintStatus.Ongoing}
                                className="p-1 text-orange-900 opacity-70 float-right text-xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => setShowModal(false)}
                            >
                                X
                            </button>
                        </div>
                        {getMintStatusText()}
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
};

export default Modal;
