import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from '../styles/messageModal.module.css'
import ForwardMessageModal from './ForwardMessageModal';
import { HomeContext } from '../context/HomeContext';
import { arrayRemove, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';

const MessageModal = ({isMessageModalOpen,setIsMessageModalOpen,modalPosition,message}) => {
    const {setForwardMsgText,toggleForwardMsg}=useContext(HomeContext)
    const {data,lastMessage,secondLastMessage,setLastMessage,toggleIsEditMessages,toggleListener}=useContext(ChatContext)
    const {currentUser}=useContext(AuthContext)
    const modalRef = useRef();
    const chatId=data?.chatId
    useEffect(() => {
        const handleOutsideClick = (event) => {
          if (modalRef.current && !modalRef.current.contains(event.target)) {
            setIsMessageModalOpen(false)
          }
        };
    
        if (isMessageModalOpen) {
          document.addEventListener('mousedown', handleOutsideClick);
        }
    
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
      }, [isMessageModalOpen, setIsMessageModalOpen])
    
    const handleForwardSelect=()=>{
      if(message.text){
        setForwardMsgText(message.text)
      }
      toggleForwardMsg()
    }
    const handleDeleteMessage=async()=>{
      try {
        const docRef = doc(db, "chats", chatId);
        const docSnap = await getDoc(docRef);

        const messages = docSnap.data().messages || [];
        const index = messages.findIndex(msg => msg.id === message.id);
        messages.splice(index, 1);
        await updateDoc(docRef, { messages });
        
        if(lastMessage===message.text){
          await updateDoc(doc(db, "userChats", data?.user?.uid), {
            [chatId +".lastMessage"]: {
              text:secondLastMessage
            },
            [chatId + ".date"]:serverTimestamp()
          });
          await updateDoc(doc(db, "userChats", currentUser?.uid), {
            [chatId +".lastMessage"]: {
              text:secondLastMessage
            },
            [chatId + ".date"]:serverTimestamp()
          });            
        }    
        setLastMessage('','')
        setIsMessageModalOpen(false)
        toggleListener()
      } catch (error) {
        console.log(error);
      }   
    }
    
    const handleEditMessage=()=>{
      toggleIsEditMessages(message.id)
      setIsMessageModalOpen(false)
    }
    return (
      <div className={`${ modalPosition==="below" && styles.messageModalBelowContainer} ${styles.messageModalContainer}`} ref={modalRef}>
          <ul>
              <li >Message Info</li>
              <li >Reply</li>
              <li onClick={handleEditMessage}>Edit</li>
              <li onClick={handleForwardSelect}>Forward</li>
              <li onClick={handleDeleteMessage}>Delete</li>
          </ul>   
      </div>
    )
  }

export default MessageModal