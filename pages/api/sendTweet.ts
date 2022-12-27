import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';
import DrawNFTGoerli from '../../hardhat/contracts/abi/goerli/DrawNFT.json';
import DrawNFTAddressGoerli from '../../hardhat/contracts/abi/goerli/DrawNFT-address.json';
import DrawNFTMain from '../../hardhat/contracts/abi/main/DrawNFT.json';
import DrawNFTAddressMain from '../../hardhat/contracts/abi/main/DrawNFT-address.json';
import Twitter from 'twitter-lite';
import axios from 'axios';

const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN_KEY,
  TWITTER_ACCESS_TOKEN_SECRET,
  ALCHEMY_MAIN_API_KEY,
  ALCHEMY_GOERLI_API_KEY,
  ALCHEMY_TWEET_APP_ID,
  NFT_CONTRACT_SIGNER,
  ENV,
} = process.env;

const getContract = (): ethers.Contract => {
  if (ENV && ENV == 'production') {
    const provider = new ethers.providers.JsonRpcProvider(
      'https://eth-mainnet.g.alchemy.com/v2/' + ALCHEMY_MAIN_API_KEY
    );
    const wallet = new ethers.Wallet(NFT_CONTRACT_SIGNER || '', provider);
    const signer = provider.getSigner(wallet.address);
    const address = DrawNFTAddressMain.address;
    const abi = DrawNFTMain.abi;
    return new ethers.Contract(address, abi, signer);
  } else {
    const provider = new ethers.providers.JsonRpcProvider(
      'https://eth-goerli.g.alchemy.com/v2/' + ALCHEMY_GOERLI_API_KEY
    );
    const wallet = new ethers.Wallet(NFT_CONTRACT_SIGNER || '', provider);
    const signer = provider.getSigner(wallet.address);
    const address = DrawNFTAddressGoerli.address;
    const abi = DrawNFTGoerli.abi;
    return new ethers.Contract(address, abi, signer);
  }
};

const nftContract = getContract();

const twitterClient = new Twitter({
  consumer_key: TWITTER_CONSUMER_KEY || '',
  consumer_secret: TWITTER_CONSUMER_SECRET || '',
  access_token_key: TWITTER_ACCESS_TOKEN_KEY || '',
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET || '',
});

const uploadTwitterClient = new Twitter({
  consumer_key: TWITTER_CONSUMER_KEY || '',
  consumer_secret: TWITTER_CONSUMER_SECRET || '',
  access_token_key: TWITTER_ACCESS_TOKEN_KEY || '',
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET || '',
  subdomain: 'upload',
});

const nftInfoAndTweet = async (nftId: number, res: NextApiResponse) => {
  try {
    // Get metadata
    const nftMetadataURl = await nftContract.tokenURI(nftId);

    const ipfsUrl = `https://ipfs.io/ipfs/${nftMetadataURl.substring(7)}`;

    // Make a GET request to the website's URL
    const response = await fetch(ipfsUrl);

    // Parse the response body as JSON
    const data = await response.json();

    // Get Account
    const account = await nftContract.ownerOf(nftId);
    const imageUrl = `https://ipfs.io/ipfs/${data?.image.substring(7)}`;

    // Call the tweet
    const text = `An NFT with the ID ${nftId} has been minted by ${account}. It is available for viewing on OpenSea at the following link: https://opensea.io/assets/ethereum/${
      ENV && ENV === 'production'
        ? DrawNFTAddressMain.address
        : DrawNFTAddressGoerli.address
    }/${nftId}`;
    tweet(text, imageUrl, res);
  } catch (e) {
    res.status(500).json({ data: null, error: `Error: ${e}` });
  }
};

const tweet = async (text: string, imageUrl: string, res: NextApiResponse) => {
  // Get the Image
  const axiousGet = async (): Promise<any> => {
    try {
      return await axios.get(imageUrl, { responseType: 'arraybuffer' });
    } catch {
      return undefined;
    }
  };

  const uploadTwitterClientMedia = async (imageData: any): Promise<any> => {
    try {
      return await uploadTwitterClient.post('media/upload', {
        media: imageData.toString('base64'),
      });
    } catch {
      return undefined;
    }
  };

  const uploadTwitterClientTweet = async (mediaId: any): Promise<any> => {
    try {
      return await twitterClient.post('statuses/update', {
        status: text,
        media_ids: [mediaId],
      });
    } catch {
      return undefined;
    }
  };

  const axiosResponse = await axiousGet();

  if (axiosResponse && axiosResponse.status === 200) {
    // Upload the image
    const imageData = axiosResponse.data;
    const media = await uploadTwitterClientMedia(imageData);

    // If image is uploaded send the tweet
    if (media && media?.media_id_string) {
      //send the tweet
      const tweet = await uploadTwitterClientTweet(media.media_id_string);

      if (tweet) {
        res.status(204).end();
      } else {
        res
          .status(500)
          .json({ data: null, error: `Error: Couldn't send tweet` });
      }
    } else {
      res
        .status(500)
        .json({ data: null, error: `Error: No twitter media ID!` });
    }
  } else {
    res.status(500).json({
      data: null,
      error: `Error: the axiosResponse is not successful`,
    });
  }
};

type JsonBody = {
  app_id: string;
  nft_filters: Array<{ contract_address: string; token_id: string }>;
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  if (!req.body) {
    return res.status(400).send('Missing body');
  }

  let jsonBody: JsonBody;
  try {
    jsonBody = JSON.parse(req.body);
  } catch (e) {
    jsonBody = req.body;
  }

  if (jsonBody.app_id !== ALCHEMY_TWEET_APP_ID) {
    res.status(401).json({ data: null, error: 'Not Authorized' });
    return;
  }

  try {
    const nftFilters = jsonBody.nft_filters;
    const nftId = parseInt(nftFilters[nftFilters.length - 1].token_id, 10);
    await nftInfoAndTweet(nftId, res);
  } catch (error) {
    res.status(500).json({
      data: null,
      error: `Error: ${error}`,
    });
  }
}
