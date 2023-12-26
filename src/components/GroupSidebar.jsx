import { doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../firebase';
import styles from '../styles/chats.module.css'
import { GroupContext } from '../context/GroupContext';

const GroupSidebar = ({groupId}) => {
    const {groupData,getGroupById}=useContext(GroupContext)
    useEffect(()=>{
        groupId && getGroupById(groupId)
    },[])
    
   
    return (
        <div className={styles.userChat} >
            <img src={groupData?.groupImage} alt="" />
            <div className={styles.userChatInfo}>
                <span>{groupData?.groupSubject}</span>
                {groupData && groupData.messages && groupData.messages.length > 0 && (
                    <p>{groupData.messages[groupData.messages.length - 1].text}</p>)} 
                    </div>
        </div>  
       
    )  
}

export default GroupSidebar