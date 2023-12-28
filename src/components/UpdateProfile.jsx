import React, { useContext, useEffect, useState } from 'react'
import { MdDone } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { BiSolidPencil } from "react-icons/bi";
import styles from "../styles/updateProfile.module.css"
import { IoMdArrowBack } from "react-icons/io";
import { v4 as uuid} from 'uuid';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { UsersContext } from '../context/UsersContext';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { HomeContext } from '../context/HomeContext';
import ViewPhoto from './ViewPhoto';
import { updateProfile } from 'firebase/auth';

const UpdateProfle = () => {
    const [isUpdatePhoto,setIsUpdatePhoto]=useState(false)
    const [isUpdateName,setIsUpdateName]=useState(false)
    const {currentUser}=useContext(AuthContext)
    const {toggleUpdateProfile,toggleViewPhoto}=useContext(HomeContext)
    const [displayName,setDisplayName]=useState(currentUser?.displayName)

    const handleViewPhoto=()=>{
        toggleViewPhoto()
        setIsUpdatePhoto(!isUpdatePhoto)
    }

    const handleRemovePhoto=async()=>{
        try {
            const imageRef = ref(storage,`${currentUser?.displayName}`);
            await deleteObject(imageRef);
            await updateDoc(doc(db, "users", currentUser?.uid), {
                photoURL:'',
            });
            await updateProfile(currentUser, {
                photoURL: ''
            });
            setIsUpdatePhoto(!isUpdatePhoto)
            // TODO remove photoURL from userInfo in chats 
        } catch (error) {
            console.log(error);
        }

    }

    const handleNameUpdate=async(e)=>{
        e.preventDefault();
        const displayName=e.target.value
        setIsUpdateName(!isUpdateName)
        await updateProfile(currentUser, {
          displayName: displayName
        });
    
    
        await updateDoc(doc(db, "users", currentUser?.uid), {
            displayName:displayName,
        });
        // TODO update all occurrences of name
    }

    const handleUploadPhoto=async(e)=>{
        e.preventDefault();
        const image=e.target.files[0]
        setIsUpdatePhoto(!isUpdatePhoto)
        
        const storageRef = ref(storage, displayName);
        const uploadTaskSnapshot = await uploadBytesResumable(storageRef, image);
        const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
        
        await updateProfile(currentUser, {
            photoURL: downloadURL
        });
        
        
        await updateDoc(doc(db, "users", currentUser?.uid), {
            photoURL:downloadURL,
        });
        // TODO update name of the image in storage
    }
     return (
        <div className={styles.profileInfoContainer}>
        <div className={styles.profileInfoContainer}>
            <div className={styles.profileIconHeader}>
                <IoMdArrowBack onClick={()=>toggleUpdateProfile()}/>
                <p>Profile</p>
            </div>
            <div className={styles.profileIconContainer} >
                
                    <div className={styles.profileIconLabel} onClick={()=>setIsUpdatePhoto(!isUpdatePhoto)}>
                        <div className={`${currentUser?.photoURL ? styles.profileImage :styles.profileIcon} `}>
                        {
                            currentUser?.photoURL!==null ?<img src={currentUser?.photoURL} alt="profile" /> :<FaUser/>
                        }   
                        </div>
                        <div className={styles.innerProfileIcon}>
                               <FaCamera/>
                            {currentUser?.photoURL!==null ? <p>UPDATE PROFILE PHOTO</p> :<p>ADD PROFILE PHOTO</p>}
                        </div>
                    </div>
                    {
                        isUpdatePhoto &&(
                            <div className={styles.updatePhotoModal}>
                                <ul >
                                    <li onClick={handleViewPhoto}>View Photo</li>
                                    <input type="file"  id="uploadPhoto" style={{display:"none"}} onChange={handleUploadPhoto} />
                                    <label htmlFor="uploadPhoto">
                                    <li>Upload Photo</li>
                                    </label>
                                    <li onClick={handleRemovePhoto}>Remove Photo</li>
                                </ul>
                            </div>
                        )
                    }
            </div>
            <div className={styles.profileName}>
                <div className={styles.profileNameHeader}>
                    <p>Your Name</p> 
                </div>
                {isUpdateName ?<div className={styles.profileNameActiveInput} > 
                    <input type="text" value={displayName} placeholder='Name...' onChange={(e)=>setDisplayName(e.target.value)} className={styles.profileNameInput} />
                    <MdDone onClick={handleNameUpdate}/>
                </div>
                     : <div className={styles.profileNameActiveInput} > 
                        <p>{displayName}</p>
                     <BiSolidPencil onClick={()=>setIsUpdateName(!isUpdateName)}/>

                     </div>

                     }
                    
            </div>
        </div>
        </div>

    )
}

export default UpdateProfle