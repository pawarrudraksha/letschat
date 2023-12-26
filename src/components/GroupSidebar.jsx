import { doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../firebase';
import styles from '../styles/chats.module.css'
import { GroupContext } from '../context/GroupContext';

const GroupSidebar = ({groupId}) => {
    const [groupData,setGroupData]=useState({})
    useEffect(()=>{
        getGroupById()
    },[])
    
    const getGroupById=async()=>{
        const groupDocRef = doc(db, 'groups', groupId);
        const groupSnapshot = await getDoc(groupDocRef);
        setGroupData(groupSnapshot.data())
    }
    return (
        <div className={styles.userChat} >
            <img src={groupData?.groupImage} alt="" />
            <div className={styles.userChatInfo}>
                <span>{groupData?.groupSubject}</span>
                {/* <p>{groupData?.messages[groupData?.messages?.length-1].text}</p> */}
            </div>
        </div>  
       
    )  
}

export default GroupSidebar