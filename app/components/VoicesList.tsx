import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Voice = {
  Name: string;
  Locale: string;
  Gender: string;
};

export const VoiceList = () => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await axios.get('/api/voices', {
          headers: {
            'Ocp-Apim-Subscription-Key': process.env.AZURE_API_KEY,
          },
        });
        setVoices(response.data);
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false);
      }
    };

    fetchVoices();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Available Voices</h2>
          <ul>
            {voices.map((voice, index) => (
              <li key={index}>
                Name: {voice.Name}, Language: {voice.Locale}, Gender: {voice.Gender}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
