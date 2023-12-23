import React, { useContext, useEffect, useState } from 'react'
import Message from './Message'
import styles from '../styles/messages.module.css'
import { ChatContext } from '../context/ChatContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

const Messages = () => {
  const [messages,setMessages]=useState([])
  const {data}=useContext(ChatContext)
  useEffect(()=>{
    const onSub=onSnapshot(doc(db,"chats",data.chatId),(doc)=>{
      doc.exists() && setMessages(doc.data().messages)
    })
    return ()=>{
      onSub()
    }
  },[data.chatId])
  
  return (
    <div className={styles.messages}>
        {messages.map((m)=>(
          <Message message={m} key={m.id}/>
          ))}        
    </div>
  )
}

export default Messages