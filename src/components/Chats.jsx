import React, { useContext, useEffect, useState } from 'react'
import styles from '../styles/chats.module.css'
import { FaCamera } from "react-icons/fa";
import { AuthContext } from '../context/AuthContext'
import { onSnapshot,doc, collection, getDocs, query, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { ChatContext } from '../context/ChatContext'
import GroupSidebar from './GroupSidebar'
import { GroupContext } from '../context/GroupContext'
import { UsersContext } from '../context/UsersContext';

const Chats = () => {
  const [chats,setChats]=useState([])
  const {currentUser}=useContext(AuthContext)
  const {setGroupId,setChatType,clearGroupId}=useContext(GroupContext)
  const {dispatch,chatId,isListen,toggleListener}=useContext(ChatContext)
  const {getUserById}=useContext(UsersContext)
  useEffect(() => {
    const getChats = async () => {
      if (currentUser && currentUser.uid) {
        const userChatsRef = doc(db, 'userChats', currentUser.uid);
        const docSnapshot = await getDoc(userChatsRef);
  
        if (docSnapshot.exists()) {
          const chatData = docSnapshot.data();
          const modifiedChats = {};
          for (const key in chatData) {
            const chatObject = chatData[key];
            if(!chatObject.groupImage){

              const id=chatObject.userInfo.uid
              const userInfo=await getUserById(id)
              const modifiedChat = { ...chatObject, userInfo: {...userInfo,
                displayName:userInfo.displayName,
                photoURL:userInfo.photoURL,
              } }; 
              modifiedChats[key] = modifiedChat;
            }else{
              const modifiedChat = { ...chatObject }; 
              modifiedChats[key] = modifiedChat;
            }
            
          }
  
          setChats(modifiedChats); 
        }
      }
    };
    currentUser.uid && getChats();
  }, [currentUser.uid,chatId,isListen]);
  
  const handleSelect=(u)=>{
    dispatch({type:"CHANGE_USER",payload:u})
    clearGroupId()
    setChatType("user")
    toggleListener()
  }
  const handleGroupSelect=(u)=>{
    clearGroupId()
    setGroupId(u)
    setChatType("group")
    toggleListener()
  }
  return (
<div className={styles.chats}>
      {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date)?.map((chat) => {
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
            <div className={styles.userChat} key={chat[0]} onClick={()=>handleSelect(chat[1]?.userInfo)}>
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