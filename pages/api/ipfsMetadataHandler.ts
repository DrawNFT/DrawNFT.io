import type { NextApiRequest, NextApiResponse } from 'next';
import { NFTStorage, Blob } from 'nft.storage';

const ipfsClient = new NFTStorage({
  token: process.env.NFT_STORAGE_KEY || '',
});

type MetaData = { name: string; description: string; image: string };
const getBlob = (body: string): Blob => {
  const metaDataBody: MetaData = JSON.parse(body);
  const metaData = JSON.stringify({
    name: metaDataBody.name,
    description: metaDataBody.description,
    image: metaDataBody.image,
  });

  return new Blob([metaData]);
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
      res.status(500).json({
        data: null,
        error: `Error: ${e}`,
      });
    }
  } else {
    res.status(405).json({ data: null, error: 'Only Post request is allowed' });
  }
}
