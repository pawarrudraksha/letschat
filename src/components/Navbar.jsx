import React, { useContext } from 'react'
import styles from '../styles/navbar.module.css'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { HiUserGroup } from "react-icons/hi2";
import { GroupContext } from '../context/GroupContext'

const Navbar = () => {
  const {currentUser}=useContext(AuthContext)
  const {  toggleGroup } = useContext(GroupContext);
  return (
    <div className={styles.navbar}>
        <span className={styles.logo}>
            LetsChat
        </span>
        <HiUserGroup onClick={()=>toggleGroup()}/>
        <div className={styles.user}>
            <img src={currentUser.photoURL} alt="" />
            <button onClick={()=>signOut(auth)}>logout</button>
        </div>
    </div>
  )
}

export default Navbar