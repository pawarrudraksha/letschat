import React, { useContext, useEffect, useState } from 'react'
import styles from '../styles/chats.module.css'
import { FaCamera } from "react-icons/fa";
import { AuthContext } from '../context/AuthContext'
import { onSnapshot,doc } from 'firebase/firestore'
import { db } from '../firebase'
import { ChatContext } from '../context/ChatContext'
import GroupSidebar from './GroupSidebar'
import { GroupContext } from '../context/GroupContext'

const Chats = () => {
  const [chats,setChats]=useState([])
  const {currentUser}=useContext(AuthContext)
  const {setGroupId,setChatType,clearGroupId}=useContext(GroupContext)
  const {dispatch,chatId}=useContext(ChatContext)
  useEffect(()=>{
    const getChats=()=>{
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data())
      });
      return ()=>{
        unsub()
      }
    }
    currentUser.uid && getChats()
  },[currentUser.uid])

 
  const handleSelect=(u)=>{
    dispatch({type:"CHANGE_USER",payload:u})
    clearGroupId()
    setChatType("user")
  }
  const handleGroupSelect=(u)=>{
    clearGroupId()
    setGroupId(u)
    setChatType("group")
  }
  return (
<div className={styles.chats}>
      {Object.entries(chats)?.map((chat) => {
        if (chat[1]?.groupId) {
          // Rendering group chat
          return (
            <div onClick={()=>handleGroupSelect(chat[1]?.groupId)}  key={chat[0]}>
              <GroupSidebar  groupData={chat[1]} />            
            </div>
          );
        } else {
          // Rendering individual chat
          return (
            <div className={styles.userChat} key={chat[0]} onClick={()=>handleSelect(chat[1].userInfo)}>
            <img src={chat[1]?.userInfo.photoURL} alt="" />
                <div className={styles.userChatInfo}>
                    <span>{chat[1]?.userInfo?.displayName}</span>
                    {chat[1]?.lastMessage?.text===''? <p className={styles.lastChatIsImage}><FaCamera/><p>Photo</p></p>   :<p>{chat[1]?.lastMessage?.text}</p>}
                </div>
          </div>
          );
        }
      })}
    
    </div>
  )
}

export default Chats