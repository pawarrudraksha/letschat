import React, { useContext, useEffect } from 'react'
import { UsersContext } from '../context/UsersContext'
import { GroupContext } from '../context/GroupContext'
import { RxCross2 } from "react-icons/rx";
import { IoSearch } from "react-icons/io5";
import styles from '../styles/contactGroupInfo.module.css'
import { ChatContext } from '../context/ChatContext';

const ContactGroupInfo = () => {
    const {rawUsers,getAllUsers}=useContext(UsersContext)
    const {groupId,groupData,groupMembersInfo,getMembersInfo,chatType,toggleContactGroupInfo}=useContext(GroupContext)
    useEffect(()=>{
        groupId && getAllUsers();
        (groupId &&  rawUsers) && getMembersInfo(rawUsers)  
      },[chatType])
    console.log(groupId);
    const {data}=useContext(ChatContext)
   
    return (
        <div className={styles.contactInfoOverlay}>
            <div className={styles.contactInfoMenu}>
                <div className={styles.contactInfoHeader}>
                        <RxCross2 onClick={toggleContactGroupInfo}/>
                        <p>{groupId ? "Group Info" :"Contact  Info"}</p>
                </div>
                {
                groupId 
                ?<div className={styles.groupMembersInfoContainer}>
                    <div className={styles.groupMembersHeader}>
                        <img src={groupId?groupData?.groupImage:data.user?.photoURL} alt="" />
                        <p className={styles.groupMembersHeaderSubject}>{groupData?.groupSubject}</p>
                        <p>Group : {groupData?.groupMembers?.length} members </p>
                    </div>
                    <div className={styles.groupMediaLinksAndDocs}>
                        Media Links
                    </div>
                    <div className={styles.groupMembers}>
                        <div className={styles.groupMembersInfoSearchHeader}>
                            <p>{groupData?.groupMembers?.length} members</p>
                            <IoSearch/>
                        </div>

                        { groupMembersInfo?.map((member)=>(
                            <div className={styles.groupMemberInfo}>
                                <img src={member.data.photoURL}  alt="" />
                                <p>{member.data.displayName}</p>
                            </div>
                        ))}
                    </div>
                </div>
                : <div className={styles.groupMembersInfoContainer}>
                    <div className={styles.groupMembersHeader}>
                        <img src={data.user?.photoURL} alt="" />
                        <p className={styles.groupMembersHeaderSubject}>{data.user?.displayName}</p>
                    </div>
                </div>
                }
            </div>
        </div>  
    )
}

export default ContactGroupInfo