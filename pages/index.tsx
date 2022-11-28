import { FC, useEffect, useRef, useState } from "react";
import NavBar from "../components/Navbar";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import Modal from "../components/Modal";
import { ethers } from "ethers";
import DrawNFT from "../contracts/abi/DrawNFT.json";
import DrawNFTAddress from "../contracts/abi/DrawNFT-address.json";

const MAX_BRUSH_SIZE = 100;
const BACKGROUND_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/7/70/Graph_paper_scan_1600x1000_%286509259561%29.jpg";

const Home: FC = () => {
  const [account, setAccount] = useState<string | undefined>(undefined);
  const [nftContract, setNftContract] = useState<ethers.Contract | undefined>(
    undefined
  );

  const [canvasBrushColor, setCanvasBrushColor] = useState<string>("#000000");
  const [canvasBrushRadius, setCanvasBrushRadius] = useState<number>(1);

  const [showModal, setShowModal] = useState<boolean>(false);

  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [imageBlob, setImageBlob] = useState<Blob | undefined>();

  const web3Handler = async () => {
    const handleAccount = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      }
    };

    const handleNFTContract = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setNftContract(
          new ethers.Contract(DrawNFTAddress.address, DrawNFT.abi, signer)
        );
      }
    };

    await handleAccount();
    await handleNFTContract();
  };

  useEffect(() => {
    canvasRef?.current?.loadPaths(JSON.parse(localStorage.getItem("canvasPaths") || "[]"));
    web3Handler();
  }, []);

  return (
    <>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        imageBlob={imageBlob}
        nftContract={nftContract}
        account={account}
      />
      <NavBar
        accountId={account}
        web3Handler={web3Handler}
        nftContract={nftContract}
      />

      <div className="w-full h-full md:h-screen md:flex">
        <div className="w-full relative overflow-hidden md:flex md:w-2/3 bg-gradient-to-tr from-blue-800 to-purple-700 justify-around items-center">
          <div className="hidden md:block z-10 absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="hidden md:block z-10 absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="hidden md:block z-10 absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="hidden md:block z-10 absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="z-10 border-2 border-sky-700">
            <ReactSketchCanvas
              ref={canvasRef}
              strokeColor={canvasBrushColor}
              strokeWidth={canvasBrushRadius}
              eraserWidth={canvasBrushRadius}
              backgroundImage={BACKGROUND_IMAGE}
              exportWithBackgroundImage={false}
              width="650px"
              height="650px"
              style={{
                cursor:
                  'url("https://cur.cursors-4u.net/toons/too-10/too935.cur"), auto !important',
              }}
              onChange={
                async () => {
                  const exportPaths = canvasRef.current?.exportPaths;
                  if (exportPaths) {
                    localStorage.setItem("canvasPaths", JSON.stringify(await exportPaths()));
                  }
                }
              }
            />
          </div>
        </div>
        <div className="w-full relative overflow-hidden md:flex justify-around items-center md:w-1/3 p-12">
          <div className="mx-auto w-full bg-white">
            <h1 className="text-xl font-bold capitalize mb-2">
              Canvas Settings
            </h1>
            <hr />
            <div className="mt-4">
              <label>Brush Radius</label>
              <input
                onChange={(e) => {
                  setCanvasBrushRadius(
                    Math.min(MAX_BRUSH_SIZE, Number(e.target.value))
                  );
                }}
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                max={MAX_BRUSH_SIZE}
                defaultValue={canvasBrushRadius}
                className="border border-black w-full py-2 px-2 mt-2 focus:outline-none focus:ring"
              />
            </div>
            <div className="mt-4">
              <label>Brush Color</label>
              <input
                onChange={(e) => {
                  setCanvasBrushColor(e.target.value);
                }}
                defaultValue={canvasBrushColor}
                id="color"
                type="color"
                className="w-full px-2 py-1 mt-2 focus:outline-none focus:ring"
              />
            </div>
            <button
              className="block w-full bg-gray-700 mt-6 py-2 rounded text-white font-semibold mb-2"
              onClick={() => {
                const eraseMode = canvasRef.current?.eraseMode;
                if (eraseMode) {
                  eraseMode(false);
                }
              }}
            >
              Drawing Mode
            </button>
            <button
              className="block w-full bg-gray-700 mt-6 py-2 rounded text-white font-semibold mb-2"
              onClick={() => {
                const eraseMode = canvasRef.current?.eraseMode;
                if (eraseMode) {
                  eraseMode(true);
                }
              }}
            >
              Erasing Mode
            </button>
            <button
              className="block w-full bg-yellow-500 mt-6 py-2 rounded text-white font-semibold mb-2"
              onClick={() => {
                const undo = canvasRef.current?.undo;
                if (undo) {
                  undo();
                }
              }}
            >
              Undo
            </button>
            <button
              className="block w-full bg-yellow-500 mt-6 py-2 rounded text-white font-semibold mb-2"
              onClick={() => {
                const redo = canvasRef.current?.redo;
                if (redo) {
                  redo();
                }
              }}
            >
              Redo
            </button>
            <button
              className="block w-full bg-red-500 mt-6 py-2 rounded text-white font-semibold mb-2"
              onClick={() => {
                const clearCanvas = canvasRef.current?.clearCanvas;
                if (clearCanvas) {
                  clearCanvas();
                }
              }}
            >
              Erase
            </button>
            <button
              className="block w-full bg-green-500 mt-6 py-2 rounded text-white font-semibold mb-2"
              onClick={() => {
                const createImage = async () => {
                  const exportImage = canvasRef.current?.exportImage;

                  if (exportImage) {
                    const dataURItoBlob = (dataURI: string): Blob => {
                      var byteString = Buffer.from(
                        dataURI.split(",")[1],
                        "base64"
                      );

                      var mimeString = dataURI
                        .split(",")[0]
                        .split(":")[1]
                        .split(";")[0];

                      var ab = new ArrayBuffer(byteString.length);

                      var ia = new Uint8Array(ab);

                      for (var i = 0; i < byteString.length; i++) {
                        ia[i] = byteString[i];
                      }

                      var blob = new Blob([ab], { type: mimeString });
                      return blob;
                    };
                    const dataURI = await exportImage("png");
                    setImageBlob(dataURItoBlob(dataURI));
                  }
                };

                createImage().then(() => {
                  setShowModal(true);
                });
              }}
            >
              I am done with my masterpiece!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
