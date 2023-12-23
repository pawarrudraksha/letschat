import React, { useContext } from 'react'
import { BsCameraVideoFill } from "react-icons/bs";
import { MdPersonAddAlt1 } from "react-icons/md";
import { MdMoreHoriz } from "react-icons/md";
import styles from '../styles/chat.module.css'
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../context/ChatContext';

const Chat = () => {
  const {data}=useContext(ChatContext)
  return (
    <div className={styles.chat}>
      <div className={styles.chatInfo}>
          <span>{data.user?.displayName}</span>
          <div className={styles.chatIcons}>
          <BsCameraVideoFill />
          <MdPersonAddAlt1/>
          <MdMoreHoriz/>
          </div>
      </div>
      <Messages/>
      <Input/>
    </div>
  )
}

export default Chat