import React from 'react'
import styles from '../styles/chats.module.css'
import { FaCamera } from "react-icons/fa";

const GroupSidebar = ({groupData}) => {
    return (
        <div className={styles.userChat} >
            <img src={groupData?.groupImage} alt="" />
            <div className={styles.userChatInfo}>
                <span>{groupData?.groupSubject}</span>
                    <>
                    <p>{groupData?.lastMessage?.text}</p>
                    {groupData?.lastMessage?.text==='' &&
                    <p className={styles.lastChatIsImage}><FaCamera/><p>Photo</p></p> 
                    }
                    </>
                
            </div>
        </div>  
       
    )  
}

export default GroupSidebar