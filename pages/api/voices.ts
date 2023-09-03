import { NextApiRequest, NextApiResponse } from 'next';
import axios from '@/node_modules/axios/index';

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const url = 'https://westus.tts.speech.microsoft.com/cognitiveservices/voices/list';

  try {
    const response = await axios.get(url, {
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_API_KEY,
      },
    });
    res.status(200).json(response.data);

  } catch (err) {
    console.log(err)
  }
};
