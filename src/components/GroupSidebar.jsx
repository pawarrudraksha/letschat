import React, { useContext, useEffect } from 'react'
import styles from '../styles/chats.module.css'
import { FaCamera } from "react-icons/fa";
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
                {groupData && groupData.messages && groupData.messages.length > 0 && 
                (
                    <>
                    <p>{groupData.messages[groupData.messages.length - 1].text}</p>
                    {groupData.messages[groupData.messages.length - 1].img && 
                    <p className={styles.lastChatIsImage}><FaCamera/><p>Photo</p></p> 
                    }
                    </>
                )
                } 
            </div>
        </div>  
       
    )  
}

export default GroupSidebar