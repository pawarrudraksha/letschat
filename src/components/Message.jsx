import React, { useContext, useEffect, useRef } from 'react'
import styles from '../styles/message.module.css'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { MdFileDownload } from "react-icons/md";
import { GroupContext } from '../context/GroupContext';

const Message = ({message}) => {
  const ref=useRef()
  const {currentUser}=useContext(AuthContext)
  const {data}=useContext(ChatContext)
  const {groupId,groupMembersInfo}=useContext(GroupContext)
  useEffect(()=>{
    ref.current?.scrollIntoView({behavior:"smooth"})
  },[message])

  const date = new Date(message.date.seconds * 1000); // Convert seconds to milliseconds
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;
  const handleDownload = async() => {
    try {
      const link = document.createElement('a');
      link.href =   message.file;
      link.download =    'downloaded_file';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);

      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
    {
      groupId?<>
        <div ref={ref} className={`${styles.message} ${message.senderId===currentUser.uid && styles.owner}`} data-message-id={message.id}>
            <div className={styles.messageInfo}>
                <img src={message.senderId===currentUser.uid ? currentUser.photoURL : (groupMembersInfo?.find((mem)=>mem.id===message.senderId))?.data?.photoURL
                } alt="sender" />
                <span>{formattedTime}</span>
            </div>
            <div className={styles.messageContent}>
              {message.text && <p>{message.text}</p>}
              {message.img && <img src={message.img} alt="" />}
              {message.file && 
              <div className={styles.fileDownload}>
                  <MdFileDownload onClick={handleDownload}/>
                  <p>Download</p>
                </div>
                }
            </div>
        </div>
      </> :
        (<div ref={ref} className={`${styles.message} ${message.senderId===currentUser.uid && styles.owner}`} data-message-id={message.id}>
            <div className={styles.messageInfo}>
                <img src={message.senderId===currentUser.uid ? currentUser.photoURL :data.user.photoURL} alt="" />
                <span>{formattedTime}</span>
            </div>
            <div className={styles.messageContent}>
              {message.text && <p>{message.text}</p>}
              {message.img && <img src={message.img} alt="" />}
              {message.file && 
              <div className={styles.fileDownload}>
                  <MdFileDownload onClick={handleDownload}/>
                  <p>Download</p>
                </div>
                }
            </div>
        </div>)
    }
    </div>
  )
}

export default Message