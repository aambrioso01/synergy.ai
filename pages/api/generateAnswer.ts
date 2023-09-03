import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  const userMessage: Message = { role: 'user', content: req.body };
  const messages: Message[] = [
    { role: 'system', content: 'You are a smart, helpful, positive, blunt and spunky personal assistant named Synergy. Keep your responses short and conversational. No more than 40 words unless you are specifically asked for a long output.' },
    userMessage
  ];

  const messages2: Message[] = [
    { role: 'system', content: 'You are a smart, helpful, positive, blunt and spunky personal assistant named Synergy. Your primary objective is generating code in reponse to the requirements provided. Please leave comments ands briefly explain your solutions.' },
    userMessage
  ];

  const data = {
    model: 'gpt-3.5-turbo',
    messages: messages
  };

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    };
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    res.status(200).json(result.choices);
  } catch (error) {
    res.status(500).json({ error: 'No valid response from the OpenAI API.' });
  }
};
