import React, { useContext, useState } from 'react'
import styles from '../styles/input.module.css'
import { MdAttachFile } from "react-icons/md";
import { RiImageAddFill } from "react-icons/ri";
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid} from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';


const Input = () => {
  const {currentUser}=useContext(AuthContext)
  const {data}=useContext(ChatContext)

  const [text,setText]=useState("")
  const [img,setImg]=useState(null)
  const [file,setFile]=useState(null)

  const handleSend=async()=>{

    try {
      if(img){
        const storageRef=ref(storage,uuid())
        const uploadTaskSnapshot = await uploadBytesResumable(storageRef, img);
        const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
    
        await updateDoc(doc(db,"chats",data.chatId),{
          messages: arrayUnion({
            id:uuid(),
            text,
            senderId:currentUser.uid,
            data:Timestamp.now(),
            img:downloadURL
          })
        })
      }else if(file){
        const storageRef=ref(storage,uuid())
        const uploadTaskSnapshot = await uploadBytesResumable(storageRef,file);
        const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
    
        await updateDoc(doc(db,"chats",data.chatId),{
          messages: arrayUnion({
            id:uuid(),
            text,
            senderId:currentUser.uid,
            data:Timestamp.now(),
            file:downloadURL
          })
        })
      }
      else{
        await updateDoc(doc(db,"chats",data.chatId),{
          messages: arrayUnion({
            id:uuid(),
            text,
            senderId:currentUser.uid,
            data:Timestamp.now()
          })
        })
      }

      await updateDoc(doc(db,"userChats",currentUser.uid),{
        [data.chatId + ".lastMessage"]:{
          text
        },
        [data.chatId + ".date"]:serverTimestamp()
      })
      setText("")
      setImg(null)
      await updateDoc(doc(db,"userChats",data.user.uid),{
        [data.chatId + ".lastMessage"]:{
          text
        },
        [data.chatId + ".date"]:serverTimestamp()
      })
      setText("")
      setImg(null)
      setFile(null)

    } catch (error) {
    console.log(error);
  }
  }
  return (
    <div className={styles.input}>
        <input type="text"  placeholder='Type something...' value={text} onChange={e=>setText(e.target.value)} onKeyDown={ (e)=>e.code==="Enter" && handleSend()}/>
        <div className={styles.send}>
            <input type="file"  id="file1" style={{display:"none"}}   onChange={e=>setFile(e.target.files[0])} />
            <label htmlFor="file1">
              <MdAttachFile/>
            </label>
            <input type="file"  id="file" style={{display:"none"}}   onChange={e=>setImg(e.target.files[0])} />
            <label htmlFor="file">
                <RiImageAddFill/>
            </label>
            <button onClick={handleSend}>Send</button>
        </div>
    </div>
  )
}

export default Input