import { Dispatch, FC, SetStateAction } from "react";

type ModalProps = {
    text: string;
    setShowModal: Dispatch<SetStateAction<boolean>>;
};

const ModalWithText: FC<ModalProps> = ({ text, setShowModal }) => {
    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto mx-auto max-w-7xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="flex items-start justify-between px-5 py-3 border-b border-solid border-slate-200 rounded-t">
                            <h3 className="text-xl font-semibold">Mint Your NFT!</h3>
                            <button
                                className="p-1 text-orange-900 opacity-70 float-right text-xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => setShowModal(false)}
                            >
                                X
                            </button>
                        </div>
                        <div className="flex justify-center items-center p-6">
                            <div className="flex flex-col gap-8 items-center justify-center ">
                                <p>{text}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
};

export default ModalWithText;
