import React, { useContext } from 'react'
import styles from '../styles/navbar.module.css'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { HiUserGroup } from "react-icons/hi2";
import { GroupContext } from '../context/GroupContext'
import { HomeContext } from '../context/HomeContext'
import { RiUser3Fill } from "react-icons/ri";
import { ChatContext } from '../context/ChatContext'

const Navbar = () => {
  const {currentUser}=useContext(AuthContext)
  const {  toggleGroup,clearChatType } = useContext(GroupContext);
  const {dispatch}=useContext(ChatContext)
  const {toggleUpdateProfile}=useContext(HomeContext)
  const handleLogout=()=>{
    signOut(auth)
    dispatch({type:"CLEAR_USER"})
    clearChatType()
  }
  return (
    <div className={styles.navbar}>
        <span className={styles.logo}>
            LetsChat
        </span>
        <HiUserGroup onClick={()=>toggleGroup()}/>
        <div className={styles.user}>
            {currentUser?.photoURL!==null ?<img src={currentUser.photoURL} alt="" onClick={()=>toggleUpdateProfile()}/> :<RiUser3Fill onClick={()=>toggleUpdateProfile()} className={styles.userSvg}/>}
            <button onClick={handleLogout}>logout</button>
        </div>
    </div>
  )
}

export default Navbar