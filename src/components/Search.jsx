import React, { useContext, useState } from 'react'
import styles from '../styles/search.module.css'
import { IoMdSearch } from "react-icons/io";
import { collection, getDocs,getDoc, query, serverTimestamp, setDoc, updateDoc, where, doc } from 'firebase/firestore'
import { db } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext';

const Search = () => {
  const [username,setUsername]=useState("")
  const [user,setUser]=useState(null)
  const [err,setErr]=useState(false)
  const {currentUser}=useContext(AuthContext)
  const {toggleListener}=useContext(ChatContext)
  const handleSearch=async()=>{
    const q=query(collection(db,"users"),where("displayName","==",username))
    try {
      const querySnapshot=await getDocs(q)
      querySnapshot.forEach((doc)=>{
        setUser(doc.data())
      })
    } catch (error) {
      setErr(true)
    }

  }
  const handleKey=(e)=>{
    e.code==="Enter" && handleSearch()
  }
  const handleSelect=async()=>{
    // Check whether the group (chats in firestore) if not create 
    const combinedId=currentUser.uid>user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid

    try {
      const res=await getDoc(doc(db,"chats",combinedId))  
      if(!res.exists()){
        // create a chat in chats collection
        await setDoc(doc(db,"chats",combinedId),{messages:[]})

        // create user chats
        await updateDoc(doc(db,"userChats",currentUser.uid),{
          [combinedId+".userInfo"]:{
            uid:user.uid,
          },
          [combinedId+".date"]:serverTimestamp()
          
        })
        await updateDoc(doc(db,"userChats",user.uid),{
          [combinedId+".userInfo"]:{
            uid:currentUser.uid,
          },
          [combinedId+".date"]:serverTimestamp()

        })
      }
    } catch (error) {
      console.log(error);
    }
    setUser(null)
    setUsername("")
    toggleListener()
  }
  return (
    <div className={styles.search}>
        <div className={styles.searchForm}>
            <IoMdSearch/>
            <input type="text" placeholder='Find a user' value={username} onKeyDown={handleKey} onChange={(e)=>setUsername(e.target.value)} />
        </div>
        {err && <span>User not found!</span>}
        {user && (<div className={styles.userChat} onClick={handleSelect}>
            <img src={user.photoURL} alt="" />
            <div className={styles.userChatInfo}>
                <span>{user.displayName}</span>
            </div>
        </div>)}
    </div>
  )
}

export default Search