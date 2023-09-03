import React, { useState, useRef } from 'react';
import axios from '@/node_modules/axios/index';
import styles from './todolist.module.css'
import { AiOutlineSend } from "react-icons/ai";
import Image from 'next/image';
import useSpeechState from '../../custom/useSpeechState';

export const TodoList = () => {
  const { list, inputMessage, audioRef, setInputMessage, addItem } = useSpeechState();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  // Check for "Enter" key press
  const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      await addItem(inputMessage);
    }
  };

  const handleClick = async () => {
    await addItem(inputMessage);
  }


  return (
    <>
      <Image
        src="/synergy-stillframe.png" // The path can be relative to the public directory in your Next.js project
        alt="Synergy AI"
        width={300}
        height={400}
      />

      <audio ref={audioRef}></audio>

      {list.length > 0 ? (
        <>
          <div className={styles.tasks}>
            {list.map((item, index) => (
              <div className={styles.wrapper} key={index}>
                {item}
              </div>
            ))}
          </div>
        </>
      ) : (
        <></>
      )}

      <div className={styles.input}>
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleClick}><AiOutlineSend /></button>
      </div>
    </>
  )
}