import React, { useContext, useState } from 'react'
import { BsCameraVideoFill } from "react-icons/bs";
import { MdPersonAddAlt1 } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import { MdMoreHoriz } from "react-icons/md";
import styles from '../styles/chat.module.css'
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../context/ChatContext';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const Chat = () => {
  const [isMenuOpen,setIsMenuOpen]=useState(false)
  const [isContatInfoOpen,setIsContactInfoOpen]=useState(false)
  const {data}=useContext(ChatContext)
  console.log(data.user);
  const deleteChat=async()=>{
    try {
      await deleteDoc(doc(db, "chats", data.chatId));
      setIsMenuOpen(false)
    } catch (error) {
      console.log(error);
    }
  }

  const toggleContactInfo=()=>{
    setIsContactInfoOpen(!isContatInfoOpen)
    setIsMenuOpen(false)
  }
  return (
    <div className={styles.chatContainer} >
    <div className={styles.chat}>
      <div className={styles.chatInfo}>
          <span>{data.user?.displayName}</span>
          <div className={styles.chatIcons}>
          <BsCameraVideoFill />
          <MdPersonAddAlt1 />
          <MdMoreHoriz onClick={()=>setIsMenuOpen(!isMenuOpen)}/>
          </div>
      </div>
      {
        isMenuOpen && (
      <div className={styles.overlay}>
          <ul className={styles.menu}>
            <li onClick={deleteChat}>Delete Chat</li>
            <li onClick={toggleContactInfo}>Contact Info</li>
            <li>Block</li>
          </ul>
      </div>
        )
        }
      <Messages/>
      <Input/>
    </div>
    <div>

        {
          isContatInfoOpen && (
            <div className={styles.contactInfoOverlay}>
                <div className={styles.contactInfoMenu}>
                <div className={styles.backButton}>
                  <IoMdArrowBack onClick={()=>setIsContactInfoOpen(false)}/>
                </div>
                  <img src={data.user?.photoURL} alt="" />
                  <h1>{data.user?.displayName}</h1>
                </div>
            </div>
          )
        }
        </div>
      </div>
  )
}

export default Chat