import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from '../styles/message.module.css'
import { MdFileDownload } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { GroupContext } from '../context/GroupContext';
import MessageModal from './MessageModal';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Message = ({message}) => {
  const ref=useRef()
  const {currentUser}=useContext(AuthContext)
  const {data,isEditMessage,toggleIsEditMessages,lastMessage,toggleListener}=useContext(ChatContext)
  const {groupId,groupMembersInfo}=useContext(GroupContext)
  const [isMessageModalOpen,setIsMessageModalOpen]=useState(false)
  const [modalPosition, setModalPosition] = useState('below'); // Set initial position of modal
  const [editedText,setEditedText]=useState(message?.text)

  const handleModal=(e)=>{
    const messagePosition = e.clientY; // Get the Y coordinate of the clicked message
    const windowHeight = window.innerHeight;
    const midpoint = windowHeight / 2;
    if (messagePosition < midpoint) {
      setModalPosition('below');
    } else {
      setModalPosition('above');
    }

    setIsMessageModalOpen(true);
  };
  useEffect(()=>{
    ref.current?.scrollIntoView({behavior:"smooth"})
  },[message])

  const date = new Date(message.date.seconds * 1000); // Convert seconds to milliseconds
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;
  const chatId=data?.chatId
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
  const handleEditMessage=async()=>{
    try {
      const docRef = doc(db, "chats", chatId);
      const docSnap = await getDoc(docRef);
      const messages = docSnap.data().messages || [];
      console.log(messages);
      const newMessages = messages.map((msg) =>{
        if(msg.id === message.id){
          return  {
            ...msg,
            text:editedText
          }
        }
        return msg
      });
      console.log("newMessages",newMessages);
      await updateDoc(docRef, { messages:newMessages });        
      if(lastMessage===message.text){
        await updateDoc(doc(db, "userChats", data?.user?.uid), {
          [chatId +".lastMessage"]: {
            text:editedText
          },
          [chatId + ".date"]:serverTimestamp()
        });
        await updateDoc(doc(db, "userChats", currentUser?.uid), {
          [chatId +".lastMessage"]: {
            text:editedText
          },
          [chatId + ".date"]:serverTimestamp()
        });            
        console.log("done");
      }    
      toggleIsEditMessages(message.id)
      toggleListener()
    } catch (error) {
      console.log(error);
    }   
  }
  
  return (
    <div>
    {
      groupId?
      <>
        <div ref={ref} className={`${styles.message} ${message.senderId===currentUser.uid && styles.owner}`} data-message-id={message.id}>
            
            <div className={styles.messageInfo}>
                <img src={message.senderId===currentUser.uid ? currentUser.photoURL : (groupMembersInfo?.find((mem)=>mem.id===message.senderId))?.data?.photoURL
                } alt="sender" />
                <span>{formattedTime}</span>
            </div>
            <div className={styles.messageContent}>
            {
                (isMessageModalOpen && modalPosition==='above') && (
                  <MessageModal isMessageModalOpen={isMessageModalOpen} setIsMessageModalOpen={setIsMessageModalOpen}  modalPosition={modalPosition} message={message}/>
                )
               } 
            <div className={`${!message.senderId===currentUser.uid ?styles.messageText:styles.ownerText}`}>
                <p ><p className={styles.ownerTextMessage}>{message.text}</p>{message.senderId===currentUser.uid &&<FaChevronDown onClick={handleModal}/>}</p>
              </div>              
              {(isMessageModalOpen && modalPosition==='below') && (
                <MessageModal isMessageModalOpen={isMessageModalOpen} setIsMessageModalOpen={setIsMessageModalOpen} modalPosition={modalPosition} message={message}/>
                )
              }
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
        <div ref={ref} className={`${styles.message} ${message.senderId===currentUser.uid && styles.owner}`} data-message-id={message.id}>
        
            <div className={styles.messageInfo}>
                <img src={message.senderId===currentUser.uid ? currentUser.photoURL :data.user.photoURL} alt="" />
                <span>{formattedTime}</span>
            </div>
            <div className={styles.messageContent}>
              {
                (isMessageModalOpen && modalPosition==='above') && (
                  <MessageModal isMessageModalOpen={isMessageModalOpen} setIsMessageModalOpen={setIsMessageModalOpen}  modalPosition={modalPosition} message={message}/>
                )
               } 
              {(message.text && !isEditMessage[message.id]) &&
              <div className={`${!message.senderId===currentUser.uid ?styles.messageText:styles.ownerText}`}>
                <p ><p className={styles.ownerTextMessage}>{message.text}</p>{message.senderId===currentUser.uid &&<FaChevronDown onClick={handleModal}/>}</p>
              </div>
               }

               {
                isEditMessage[message.id] && <div className={`${!message.senderId===currentUser.uid ?styles.messageText:styles.ownerText}`}>
              
                <input type="text"  value={editedText} onChange={(e)=>setEditedText(e.target.value)} />
                <FaCheck style={{height:"20px",width:"20px",marginTop:"12px"}} onClick={handleEditMessage}/>
              </div>
               }

               {(isMessageModalOpen && modalPosition==='below') && (
                  <MessageModal isMessageModalOpen={isMessageModalOpen} setIsMessageModalOpen={setIsMessageModalOpen} modalPosition={modalPosition} message={message}/>
                )
               }
              {message.img && <img src={message.img} alt="" />}
              {message.file && 
              <div className={styles.fileDownload}>
                  <MdFileDownload onClick={handleDownload}/>
                  <p>Download</p>
                </div>
                }
            </div>
        </div>
      
    }
    </div>
  )
}

export default Message