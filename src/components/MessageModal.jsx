import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from '../styles/messageModal.module.css'
import ForwardMessageModal from './ForwardMessageModal';
import { HomeContext } from '../context/HomeContext';

const MessageModal = ({isMessageModalOpen,setIsMessageModalOpen,modalPosition,message}) => {
    const {setForwardMsgText,toggleForwardMsg}=useContext(HomeContext)
    const modalRef = useRef();
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
    return (
      <div className={`${ modalPosition==="below" && styles.messageModalBelowContainer} ${styles.messageModalContainer}`} ref={modalRef}>
          <ul>
              <li onClick={()=>console.log("hello")}>Message Info</li>
              <li >Reply</li>
              <li>Edit</li>
              <li onClick={handleForwardSelect}>Forward</li>
              <li>Delete</li>
          </ul>
      </div>
    )
  }

export default MessageModal