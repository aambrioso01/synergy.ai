import { useState, useRef } from 'react';
import axios from 'axios';
import styles from "./styles.module.css";
import useSpeechState from '@/app/custom/useSpeechState';

export const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const { audioRef, addItem } = useSpeechState();

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async () => {
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
    
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');
    formData.append('model', 'whisper-1');

    try {
      const response = await axios.post('/api/uploadAudio', formData);
      console.log(response.data); // Handle the response accordingly
      await addItem(response.data.text);
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };

  return (
    <div className={styles.audioRecorder}>
      <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
      <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
      {audioURL && <audio src={audioURL} controls />}
      <button onClick={uploadAudio} disabled={!audioURL}>Upload for Transcription</button>

      <audio ref={audioRef}></audio>
    </div>
  );
}
