import React, { useContext, useEffect, useState } from 'react'
import styles from '../styles/searchMessages.module.css'
import { RxCross2 } from "react-icons/rx";
import { IoMdSearch } from "react-icons/io";
import { SearchMessageContext } from '../context/SearchMessageContext';
import { GroupContext } from '../context/GroupContext';
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const SearchMessages = () => {
  const {groupData,chatType}=useContext(GroupContext)
  const {data}=useContext(ChatContext)
  const {toggleSearchBar,setMessageId}=useContext(SearchMessageContext)
  const [searchValue,setSearchValue]=useState("")
  const [searchedMessages,setSearchedMessages]=useState([])
  const [chatMessages,setChatMessages]=useState([])
  const formatDate=(timestamp)=>{
    const jsDate = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
    const day = String(jsDate.getDate()).padStart(2, '0');
    const month = String(jsDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(jsDate.getFullYear()).slice(-2); // Get the last two digits of the year
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate
  }
  useEffect(() => {
    const unsubscribeUserChat = () => {};
    if (chatType === 'user' && data.chatId) {
      const onSub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
        doc.exists() && setChatMessages(doc.data()?.messages || []);
      });
      return () => {
        onSub();
      };
    }

    return unsubscribeUserChat;
  }, [data.chatId, chatType]);  
  const handleSearch=()=>{
    if(chatType==="group"){
      setSearchedMessages([])
      const messages=groupData.messages.filter((msg)=>msg.text.includes(searchValue))
      const formattedMessages=messages.map((msg)=>{
        const formatdate=formatDate(msg?.date)
        return {
          ...msg,
          formattedTimestamp: formatdate
        }
      })
      setSearchedMessages(formattedMessages)
      setSearchValue("")
    }else if(chatType==="user"){
      setSearchedMessages([])
      const messages=chatMessages?.filter((msg)=>msg.text.includes(searchValue))
      const formattedMessages=messages.map((msg)=>{
        const formatdate=formatDate(msg?.date)
        return {
          ...msg,
          formattedTimestamp: formatdate
        }
      })
      setSearchedMessages(formattedMessages)
      setSearchValue("")    
    }
  }
  const handleKey=(e)=>{
    e.code==="Enter" && handleSearch()
  }

  const handleSelect=(id)=>{
    setMessageId(id)
    toggleSearchBar()
  }
  
  return (
    <div className={styles.searchMessagesContainer}>
        <div className={styles.searchMessagesHeader}>
            <RxCross2 onClick={toggleSearchBar}/>
            <p>Search Messages</p>
        </div>
        <div className={styles.searchBar}>
            <IoMdSearch/>
            <input type="text" placeholder='Search...' value={searchValue} onKeyDown={handleKey} onChange={(e)=>setSearchValue(e.target.value)}  />
        </div>
        {
          searchedMessages?.map((msg)=>(
            <div className={styles.searchedMessages} key={msg?.id} onClick={()=>handleSelect(msg.id)}>
              <p>{msg?.formattedTimestamp}</p>
              <p>{msg?.text}</p>
            </div>
          ))
        }
    </div>
  )
}

export default SearchMessages