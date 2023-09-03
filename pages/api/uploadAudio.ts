import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import FormData from 'form-data';
import multer from 'multer';

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer();

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const uploadMiddleware = upload.any();

  // openAI metadata
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const endpoint = 'https://api.openai.com/v1/audio/transcriptions';

  uploadMiddleware(req, res, async (err: any) => {
    if (err) {
      return res.status(500).json(err);
    }

    const forwardedFormData = new FormData();

    // Files were stored in req.files by the upload.any() middleware
    req.files.forEach((file: any) => {
      forwardedFormData.append(file.fieldname, file.buffer, file.originalname);
    });
    
    forwardedFormData.append('model', 'whisper-1');

    try {
      const config = {
        headers: {
          ...forwardedFormData.getHeaders(),
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      };

      // upload audio
      const response = await axios.post(endpoint, forwardedFormData, config);

      return res.status(response.status).json(response.data);

    } catch (error: any) {
      if (error.response) {
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
      }
      console.error('Axios error:', error.message);
      return res.status(500).json({ error: 'Failed to upload audio' });
    }
  });

};
