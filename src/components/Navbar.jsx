import React, { useContext } from 'react'
import styles from '../styles/navbar.module.css'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const {currentUser}=useContext(AuthContext)
  console.log(currentUser);
  return (
    <div className={styles.navbar}>
        <span className={styles.logo}>
            LetsChat
        </span>
        <div className={styles.user}>
            <img src={currentUser.photoURL} alt="" />
            <span>{currentUser.displayName}</span>
            <button onClick={()=>signOut(auth)}>logout</button>
        </div>
    </div>
  )
}

export default Navbar