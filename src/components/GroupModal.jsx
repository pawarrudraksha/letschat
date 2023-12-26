import React, { useContext, useEffect, useState } from 'react'
import styles from '../styles/groupModal.module.css'
import { IoMdArrowBack } from "react-icons/io";
import { GrLinkNext } from "react-icons/gr";
import { ChatContext } from '../context/ChatContext'
import CheckBox from './CheckBox';
import { GroupContext } from '../context/GroupContext';
import { UsersContext } from '../context/UsersContext';


const GroupModal = ({}) => {
    const {data}=useContext(ChatContext)
    const {users,getAllUsers}=useContext(UsersContext)
    const [username,setUsername]=useState("")
    const [err,setErr]=useState(false)
    const { checkedUsers, toggleCheckedUser } = useContext(UsersContext);
    
    const {  toggleGroupInfo,toggleGroup } = useContext(GroupContext);
    useEffect(()=>{
        
        getAllUsers()
    },[])
    // const handleSearch=async()=>{
    //     const q=query(collection(db,"users"),where("displayName","==",username))
    //     try {
    //       const querySnapshot=await getDocs(q)
    //       querySnapshot.forEach((doc)=>{
    //         setUser(doc.data())
    //       })
    //     } catch (error) {
    //       setErr(true)
    //     }
    //     setUsername("")
    
    // }

    // const handleKey=(e)=>{
    //     e.code==="Enter" && handleSearch()
    // }
    const handleCheckboxChange = (userId) => {
        toggleCheckedUser(userId)
    };

    const handleNextClick=()=>{
        toggleGroup()
        toggleGroupInfo()
    }
    

    return (
    <div className={styles.groupModalOverlay}>
        <div className={styles.groupModalMenu}>

        <div className={styles.title}>
            <h2>Add Members to create a group</h2>
        </div>
        <div className={styles.search} >
            {/* <div className={styles.searchForm}>
                <input type="text" placeholder='Find a user' value={username} onKeyDown={handleKey} onChange={(e)=>setUsername(e.target.value)} />
            </div> */}
            {err && <span>User not found!</span>}
            {users && (
                users.map((user)=>(
                    <CheckBox user={user} key={user.data.uid}
                     isChecked={checkedUsers[user.data.uid] || false
                     }
                     handleCheckboxChange={handleCheckboxChange}
                    />
                ))
            )}
        </div>    
            {Object.values(checkedUsers).includes(true) && (
                    <div className={styles.nextButton}>
                        <GrLinkNext onClick={handleNextClick} />
                    </div>
                )
            }
    </div>
    </div>
    )
}

export default GroupModal