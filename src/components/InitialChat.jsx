import React from 'react'
import styles from '../styles/initialChat.module.css'
import { FaLock } from "react-icons/fa";

const InitialChat = () => {
  return (
    <div className={styles.initialChatContainer} >
      <div className={styles.initialChatInnerContainer}>
        <div className={styles.initialChatContent}>
          <p>Looking to start a chat? Find your friends by searching and initiate a conversation .</p>
        </div>
        <div className={styles.initialChatFooter} >
          <FaLock/>
          <p>Your personal messages are end-to-end encrypted</p>
        </div>
      </div>
    </div>
  )
}

export default InitialChat