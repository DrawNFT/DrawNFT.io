import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';

const signMessage = async (message: string): Promise<ethers.Signature> => {
  const signer = ethers.Wallet.fromMnemonic(process.env.SIGNER_MNEMONIC || '');

  // message to sign
  const messageHash = ethers.utils.id(message);
  const messageHashArray = ethers.utils.arrayify(messageHash);

  // sign hashed message
  const signature = await signer.signMessage(messageHashArray);

  // split signature
  return ethers.utils.splitSignature(signature);
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method == 'POST') {
    try {
      const jsonBody: { message: string } = JSON.parse(req.body);
      const signature = await signMessage(jsonBody.message);

      res.status(200).json({
        data: {
          v: signature.v,
          s: signature.s,
          r: signature.r,
        },
        error: null,
      });
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
