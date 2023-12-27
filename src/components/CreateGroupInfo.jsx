import React, { useContext } from 'react'
import { MdDone } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { FaCamera } from "react-icons/fa";
import styles from "../styles/createGroupInfo.module.css"
import { v4 as uuid} from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { UsersContext } from '../context/UsersContext';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { GroupContext } from '../context/GroupContext';

const CreateGroupInfo = () => {
    const {  toggleGroupInfo } = useContext(GroupContext);
    const {checkedUsers,clearCheckedUsers}=useContext(UsersContext)
    const {currentUser}=useContext(AuthContext)
    const groupMembers=[...Object.keys(checkedUsers),currentUser.uid]
    const handleCreateGroup=async(e)=>{
        e.preventDefault();
        const image = e.target[0].files[0];
        const groupSubject = e.target[1].value;
        const groupId=uuid();
        const timestamp = serverTimestamp();
    
        try {
          const res=await getDoc(doc(db,"groups",groupId))  
          if(!res.exists()){
            // create a group in groups collection
            const storageRef = ref(storage, `group_images/${groupId}`);
            const uploadTaskSnapshot = await uploadBytesResumable(storageRef, image);
            const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
        
            await setDoc(doc(db, 'groups', groupId), {
                messages: [],
                groupMembers:groupMembers,
                groupImage: downloadURL, 
                groupSubject: groupSubject 
              });    
            // create user chats
            for (const memberId of groupMembers) {
                await updateDoc(doc(db, "userChats", memberId), {
                  [groupId]: {
                    groupId: groupId,
                    date: timestamp,
                    groupImage:downloadURL,
                    groupSubject:groupSubject
                  }
                });
            }
         } 
         clearCheckedUsers()
         toggleGroupInfo()
        }
        catch (error) {
          console.log(error);
        }
        

    }

     return (
        <form onSubmit={handleCreateGroup} className={styles.groupInfoContainer}>
        <div className={styles.groupInfoContainer}>
            <div className={styles.groupIconContainer} >
                <input type="file"  id="uploadGroupImage" style={{display:"none"}} />
                <label htmlFor="uploadGroupImage">
                    <div className={styles.groupIconLabel}>
                        <div className={styles.groupIcon}>
                            <FaUserGroup/>
                        </div>
                        <div className={styles.innerGroupIcon}>
                            <FaCamera/>
                            <p>Add Group Icon</p>
                        </div>
                    </div>
                </label>
            </div>
            <div className={styles.groupSubject}>
                <input type="text" placeholder='Group Subject..' />
            </div>
            <button className={styles.createGroupBtn} type='submit'>
                <MdDone />
            </button>
        </div>
        </form>

    )
}

export default CreateGroupInfo