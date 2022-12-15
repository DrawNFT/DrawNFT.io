import type { NextApiRequest, NextApiResponse } from 'next';
import { NFTStorage, Blob } from 'nft.storage';

const ipfsClient = new NFTStorage({
  token: process.env.NFT_STORAGE_KEY || '',
});

const getBlob = (body: string): Blob => {
  const dataURItoBlob = (dataURI: string): Blob => {
    var byteString = Buffer.from(dataURI.split(',')[1], 'base64');

    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    var ab = new ArrayBuffer(byteString.length);

    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString[i];
    }

    var blob = new Blob([ab], { type: mimeString });
    return blob;
  };

  const jsonBody = JSON.parse(body);
  const base64Image = jsonBody?.imageData;
  return dataURItoBlob(base64Image);
};

const answerWithCid = async (res: NextApiResponse, blob: Blob) => {
  const cidMetadata = await ipfsClient.storeBlob(blob);
  res.status(200).json({
    data: { cid: cidMetadata },
    error: null,
  });
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method == 'POST') {
    try {
      const blob = getBlob(req.body);
      await answerWithCid(res, blob);
    } catch (e: any) {
      res.status(200).json({
        data: null,
        error: `Error: ${e}`,
      });
    }
  } else {
    res.status(405).json({ data: null, error: 'Only Post request is allowed' });
  }
}
