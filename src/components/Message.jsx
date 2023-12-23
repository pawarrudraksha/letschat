import React, { useContext, useEffect, useRef } from 'react'
import styles from '../styles/message.module.css'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Message = ({message}) => {
  const ref=useRef()
  const {currentUser}=useContext(AuthContext)
  const {data}=useContext(ChatContext)
  useEffect(()=>{
    ref.current?.scrollIntoView({behavior:"smooth"})
  },[message])
  return (
    <div ref={ref} className={`${styles.message} ${message.senderId===currentUser.uid && styles.owner}`}>
        <div className={styles.messageInfo}>
            <img src={message.senderId===currentUser.uid ? currentUser.photoURL :data.user.photoURL} alt="" />
            <span>just now</span>
        </div>
        <div className={styles.messageContent}>
           {message.text && <p>{message.text}</p>}
           {message.img && <img src={message.img} alt="" />}
        </div>
    </div>
  )
}

export default Message