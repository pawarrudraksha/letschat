import React, { useContext } from 'react'
import { RxCross2 } from 'react-icons/rx'
import styles from '../styles/replyMessage.module.css'
import { HomeContext } from '../context/HomeContext'


const ReplyMessage = () => {
  const {replyMsg,setIsReplyMsg}=useContext(HomeContext)
  return (
    <div className={styles.replyMessageContainer}>
        <div className={styles.replyMessageInnerContainer}>
            <p>You</p>
            <p>{replyMsg?.text}</p>
        </div>
        <div className={styles.replyMessageClose}>
            <RxCross2 onClick={()=>setIsReplyMsg(false)}/>
        </div>
    </div>
  )
}

export default ReplyMessage