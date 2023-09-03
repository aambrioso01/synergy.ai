import axios from "@/node_modules/axios/index";
import { useState, useRef } from 'react';

const useSpeechState = () => {
  // const [speechState, setSpeechState] = useState("");
  // const [itemCount, setItemCount] = useState(0);
  const [list, setList] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakText = async (text: string) => {
    const url = '/api/speak';
    const data = { text: text }

    setList([...list, text]);

    console.log("list-test", list);
    console.log("text:", text);
  
    try {
      // generate speech audio
      const response = await axios.post(url, data, {
        responseType: 'arraybuffer',
      });

      console.log(response.data)
  
      // convert audio for playback
      const audioBlob = new Blob([response.data], { type: 'audio/x-wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
  
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
  
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addItem = async (input: string) => {
    if (input === '') {
      return; // Don't add empty items
    }

    console.log(input);
  
    try {
      const response = await fetch('/api/generateAnswer', {
        method: 'POST',
        body: input
      });
  
      const result = await response.json();
      const assistantResponse = result[0].message.content;
      speakText(assistantResponse);
      setInputMessage(''); // Clear the input field
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return {
    // speechState,
    // itemCount,
    list,
    inputMessage,
    setInputMessage,
    audioRef,
    speakText,
    addItem
  };
};

export default useSpeechState;