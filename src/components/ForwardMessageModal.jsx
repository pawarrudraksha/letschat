import React, { useContext, useEffect, useState } from 'react'
import styles from '../styles/forwardMessageModal.module.css'
import { RxCross2 } from 'react-icons/rx'
import { IoSendSharp } from "react-icons/io5";
import { v4 as uuid} from 'uuid';
import { AuthContext } from '../context/AuthContext'
import { Timestamp, arrayUnion, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'
import { HomeContext } from '../context/HomeContext'
import { UsersContext } from '../context/UsersContext'
import { ChatContext } from '../context/ChatContext';

const ForwardMessageModal = () => {
    const [userChats,setUserChats]=useState([])
    const {currentUser}=useContext(AuthContext)
    const {forwardMsg,toggleForwardMsg}=useContext(HomeContext)
    const {getUserById,checkedUsers, toggleCheckedUser,clearCheckedUsers}=useContext(UsersContext)
    const {toggleListener}=useContext(ChatContext)
    const handleCheckboxChange = (userId) => {
      toggleCheckedUser(userId)
    };
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
      
              setUserChats(modifiedChats); 
            }
          }
        };
      
        currentUser.uid && getChats();
      }, [currentUser.uid]);
    
    
      const handleForwardMessage=async()=>{
        for(const key of Object.keys(checkedUsers)){
          if(userChats[key].userInfo){

            const uid=userChats[key]?.userInfo?.uid
            const chatId=currentUser.uid>uid? currentUser.uid + uid : uid+ currentUser.uid
            await updateDoc(doc(db,"chats",chatId),{
              messages: arrayUnion({
                id:uuid(),
                text:forwardMsg,
                senderId:currentUser.uid,
                date:Timestamp.now()
              })
            })
            await updateDoc(doc(db, "userChats", uid), {
              [chatId +".lastMessage"]: {
                text:forwardMsg
              },
              [chatId + ".date"]:serverTimestamp()
            });
            await updateDoc(doc(db, "userChats", currentUser.uid), {
              [chatId +".lastMessage"]: {
                text:forwardMsg
              },
              [chatId + ".date"]:serverTimestamp()
            });            
            }
          }
        toggleForwardMsg()
        clearCheckedUsers()
        toggleListener()
        }
        return (
          <div className={styles.forwardMessageOverlay}>
              <div className={styles.forwardMessageMenu}>
                  <div className={styles.forwardMessageHeader}>
                      <RxCross2 onClick={toggleForwardMsg}/>
                      <p>Forward Message to</p>
                  </div>
                  <p className={styles.recentChatsTitle}>Recent Chats</p>
                  <div className={styles.forwardMessageChats}>

                      {Object.entries(userChats)?.map((chat)=>(
                        <div className={styles.forwardMessageChat} key={chat[0]}>
                              <input type="checkbox"     id={`checkbox-${chat[0]}`}onChange={() => handleCheckboxChange(chat[0])}
                              checked={checkedUsers[chat[0]]}  
                              />
                              <div>
                              <img src={chat[1]?.groupImage?chat[1]?.groupImage :chat[1]?.userInfo.photoURL   } alt="user" />
                              <p>{chat[1]?.userInfo?.displayName? chat[1]?.userInfo?.displayName :chat[1]?.groupSubject}</p>
                              </div>
                          </div>
                      ))}
                  </div>
                <div className={styles.forwardMessageModalFooter}>
                    <p>Send Message</p>
                    <IoSendSharp onClick={handleForwardMessage}/>
                </div>
              </div>
          </div>
      )
  }

export default ForwardMessageModal