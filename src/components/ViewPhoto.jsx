import React, { useContext } from 'react'
import styles from "../styles/viewPhoto.module.css"
import { AuthContext } from '../context/AuthContext'
import { IoMdClose } from "react-icons/io";
import { ChatContext } from '../context/ChatContext';
import { HomeContext } from '../context/HomeContext';
import { GroupContext } from '../context/GroupContext';

const ViewPhoto = () => {
    const {data}=useContext(ChatContext)
    const {currentUser}=useContext(AuthContext)
    const {toggleViewPhoto,isUpdateProfile}=useContext(HomeContext)
    const {chatType,groupData}=useContext(GroupContext)
    const handleViewPhotoClose=()=>{
        toggleViewPhoto()
    }
    console.log(groupData);
    return (
        <div>

        {(chatType!=='' && !isUpdateProfile) ?  <div className={styles.viewPhotoContainer}>
            <div className={styles.viewPhotoHeader}>
                <div>
                    <img src={chatType==='user'? data?.user?.photoURL : groupData?.groupImage } alt="" />
                    <p>{chatType==='user'? data?.user?.displayName : groupData?.groupSubject}</p>
                </div>
                <IoMdClose onClick={handleViewPhotoClose}/>
            </div>
            <div className={styles.viewPhotoImage}>
                <img src={chatType==='user'? data?.user?.photoURL : groupData?.groupImage } alt="" />
            </div>
        </div> :
        <div className={styles.viewPhotoContainer}>
        <div className={styles.viewPhotoHeader}>
            <div>
                <img src={ currentUser?.photoURL } alt="" />
                <p>Personal</p>
            </div>
            <IoMdClose onClick={handleViewPhotoClose}/>
        </div>
        <div className={styles.viewPhotoImage}>
            <img src={currentUser?.photoURL } alt="" />
        </div>
    </div> 
    }
       
    </div>
    )
}

export default ViewPhoto