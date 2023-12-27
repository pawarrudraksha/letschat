import React, { useContext, useEffect, useState } from 'react'
import { BsCameraVideoFill } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import { IoMdMore } from "react-icons/io";
import styles from '../styles/chat.module.css'
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../context/ChatContext';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { GroupContext } from '../context/GroupContext';
import { SearchMessageContext } from '../context/SearchMessageContext';

const Chat = () => {
  const [isMenuOpen,setIsMenuOpen]=useState(false)
  const {groupData,getGroupById,groupId,toggleContactGroupInfo}=useContext(GroupContext)
  const {toggleSearchBar}=useContext(SearchMessageContext)
  const {data}=useContext(ChatContext)

  useEffect(()=>{
    groupId && getGroupById(groupId);
  
  },[groupId])
 
  const deleteChat=async()=>{
    try {
      await deleteDoc(doc(db, "chats", data.chatId));
      setIsMenuOpen(false)
    } catch (error) {
      console.log(error);
    }
  }

  const toggleContactInfo=()=>{
    toggleContactGroupInfo()
    setIsMenuOpen(false)
  }

  return (
    <div className={styles.chatContainer} >
    <div className={styles.chat}>
      <div className={styles.chatInfo}>
          <span>{groupId? groupData.groupSubject:data.user?.displayName}</span>
          <div className={styles.chatIcons}>
          <IoSearch  onClick={toggleSearchBar}/>
          <BsCameraVideoFill />
          <IoMdMore onClick={()=>setIsMenuOpen(!isMenuOpen)}/>
          </div>
      </div>
      {
        isMenuOpen && (
      <div className={styles.overlay}>
          <ul className={styles.menu}>
            <li onClick={deleteChat}>Delete Chat</li>
            <li onClick={toggleContactInfo}>{groupId ? "Group Info" :"Chat Info"}</li>
            <li>Block</li>
          </ul> 
      </div>
        )
        }
      <Messages/>
      <Input/>
    </div>
    </div>
  )
}

export default Chat