import { NextApiRequest, NextApiResponse } from 'next';
import axios from '@/node_modules/axios/index';
import { Readable } from 'stream';

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const url = 'https://eastus.tts.speech.microsoft.com/cognitiveservices/v1';
  const applicationName = 'Synergy-Ambrioso';
  const answer = req.body.text;
  const ssml = `
      <speak version='1.0' xml:lang='en-US'>
        <voice xml:lang='en-US' xml:gender='Female' name='en-GB-SoniaNeural'>
          <prosody rate="+35.00%">
            ${answer}
          </prosody>
        </voice>
      </speak>
    `;

  try {
    const response = await axios.post(url, ssml, {
      responseType: 'arraybuffer',
      headers: {
        'X-Microsoft-OutputFormat': 'riff-8khz-8bit-mono-mulaw',
        'Content-Type': 'application/ssml+xml',
        'Ocp-Apim-Subscription-Key': process.env.AZURE_API_KEY,
        'User-Agent': applicationName,
      },
    });

    // Convert ArrayBuffer to Node.js Buffer
    const nodeBuffer = Buffer.from(response.data);

    // Create a readable stream from the Node.js Buffer.
    const readableStream = new Readable({
      read() {
        this.push(nodeBuffer);
        this.push(null); // No more data to read.
      },
    });

    // Set headers for streaming audio.
    res.setHeader('Content-Type', 'audio/x-wav');

    // Pipe the readable stream to the HTTP response.
    readableStream.pipe(res);

  } catch (error) {
    console.error('Error:', error);
  }
};
