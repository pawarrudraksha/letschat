import React, { useContext, useEffect, useState } from 'react'
import { BsCameraVideoFill } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import { IoMdMore } from "react-icons/io";
import styles from '../styles/chat.module.css'
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../context/ChatContext';
import { deleteDoc, deleteField, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { GroupContext } from '../context/GroupContext';
import { SearchMessageContext } from '../context/SearchMessageContext';
import { AuthContext } from '../context/AuthContext';

const Chat = () => {
  const [isMenuOpen,setIsMenuOpen]=useState(false)
  const {groupData,getGroupById,groupId,toggleContactGroupInfo}=useContext(GroupContext)
  const {toggleSearchBar}=useContext(SearchMessageContext)
  const {currentUser}=useContext(AuthContext)
  const {data}=useContext(ChatContext)
  console.log(data);
  useEffect(()=>{
    groupId && getGroupById(groupId);
  
  },[groupId])
 
  const deleteChat=async()=>{
    try {
      // Chat with chatId delete doc
      await deleteDoc(doc(db, "chats", data.chatId));
      // data.chatId delete from userChats
      // Get a reference to the user's document
      const userChatsRef = doc(db, "userChats", currentUser.uid);

      // Update the document to remove the chat
      await updateDoc(userChatsRef, {
        [data.chatId]: deleteField()
      });
      const userChatsRef2 = doc(db, "userChats", data.user.uid);

      // Update the document to remove the chat
      await updateDoc(userChatsRef2, {
        [data.chatId]: deleteField()
      });
      setIsMenuOpen(false)
    } catch (error) {
      console.log(error);
    }
  }

  console.log(data);
  const clearChat=async()=>{
    try {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: [],
      });
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]:'',
        [data.chatId + ".date"]:serverTimestamp()
      });
  
      await updateDoc(doc(db,"userChats",data.user.uid),{
        [data.chatId + ".lastMessage"]:'',
        [data.chatId + ".date"]:serverTimestamp()
       })
       console.log("hello");
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
            <li onClick={toggleContactInfo}>{groupId ? "Group Info" :"Chat Info"}</li>
            <li>Block</li>
            <li onClick={clearChat}>Clear Chat</li>
            <li onClick={deleteChat}>Delete Chat</li>
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