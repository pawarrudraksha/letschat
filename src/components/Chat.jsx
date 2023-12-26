import React, { useContext, useState } from 'react'
import { BsCameraVideoFill } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";
import { MdMoreHoriz } from "react-icons/md";
import styles from '../styles/chat.module.css'
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../context/ChatContext';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import GroupModal from './GroupModal';

const Chat = () => {
  const [isMenuOpen,setIsMenuOpen]=useState(false)
  const [isContactInfoOpen,setIsContactInfoOpen]=useState(false)
  const {data}=useContext(ChatContext)
  const deleteChat=async()=>{
    try {
      await deleteDoc(doc(db, "chats", data.chatId));
      setIsMenuOpen(false)
    } catch (error) {
      console.log(error);
    }
  }

  const toggleContactInfo=()=>{
    setIsContactInfoOpen(!isContactInfoOpen)
    setIsMenuOpen(false)
  }

  return (
    <div className={styles.chatContainer} >
    <div className={styles.chat}>
      <div className={styles.chatInfo}>
          <span>{data.user?.displayName}</span>
          <div className={styles.chatIcons}>
          <IoSearch  />
          <BsCameraVideoFill />
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
          isContactInfoOpen && (
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