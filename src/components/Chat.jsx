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
  const {groupData,getGroupById,groupId,toggleContactGroupInfo,setChatType,chatType}=useContext(GroupContext)
  const {toggleSearchBar}=useContext(SearchMessageContext)
  const {currentUser}=useContext(AuthContext)
  const {data}=useContext(ChatContext)
  useEffect(()=>{
    groupId && getGroupById(groupId);
  
  },[groupId])
  const groupMembers=groupData?.groupMembers
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
      setChatType("")
    } catch (error) {
      console.log(error);
    }
  }
  const clearChat=async()=>{
    try {
    if(chatType==="group"){
      await updateDoc(doc(db, "groups", groupId), {
        messages: [],
      });
      for (const memberId of groupMembers) {
        await updateDoc(doc(db, "userChats", memberId), {
          [groupId +".lastMessage"]: '',
          [groupId + ".date"]:serverTimestamp()
        });
      }
      
    }else{
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
    } 
    setIsMenuOpen(false)
  }catch (error) {
    console.log(error);
  }
}

  const exitGroup=async()=>{
    try {
      // remove group member from group
      // remove all group relevant chats from userChats
      const groupRef = doc(db, "groups", groupId);
      const filteredDocs=groupData.groupMembers.filter((mem)=>mem!==currentUser.uid)
        await updateDoc(groupRef, {
         groupMembers: filteredDocs
       });
    
      const userChatsRef = doc(db, "userChats", currentUser.uid);
      await updateDoc(userChatsRef, {
         [groupId]: deleteField()
      });
    
      setIsMenuOpen(false)
      setChatType("")
    } catch (error) {
      console.log(error);
    }
  }
  const toggleContactInfo=()=>{
    toggleContactGroupInfo()
    setIsMenuOpen(false)
  }
  
  const closeChat=()=>{
    setChatType("")
    setIsMenuOpen(false)
  }
  return (
    <div className={styles.chatContainer} >
   {data && <div className={styles.chat}>
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
         {chatType==="user" ? <ul className={styles.menu}>
            
            <li onClick={toggleContactInfo}>Chat Info </li>
            <li onClick={closeChat}>Close Chat </li>
            <li>Block</li>
            <li onClick={clearChat}>Clear Chat</li>
            <li onClick={deleteChat}>Delete Chat</li>    
            </ul> 
            :
            <ul className={styles.menu}>
            
            <li onClick={toggleContactInfo}>Group Info</li>
            <li onClick={closeChat}>Close Chat </li>
            <li onClick={clearChat}>Clear Chat</li>
            <li onClick={exitGroup}>Exit Group</li>
          </ul> 
            
          }
      </div>
        )
        }
      <Messages/>
      <Input/>
    </div>}
    {
      !data && <>Hello</>
    }
    </div>
  )
}

export default Chat