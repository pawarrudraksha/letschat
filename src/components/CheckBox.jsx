import React, { useState } from 'react'
import styles from '../styles/groupModal.module.css'

const CheckBox = ({user,isChecked,handleCheckboxChange}) => {

    return (
    <div>
    <input 
    type="checkbox" 
    id={`checkbox-${user.data.uid}`}
    onChange={() => handleCheckboxChange(user.data.uid)}
    checked={isChecked}
    style={{display:"none"}}/>
      <label htmlFor={`checkbox-${user.data.uid}`}>
    <div className={`${styles.userChat}  ${ isChecked ?styles.checkedChat :""}`} >
        <img src={user.data.photoURL} alt="" />
        <div className={styles.userChatInfo}>
            <span>{user.data.displayName}</span>
        </div>
    </div>
    </label>
    </div>  
)
}

export default CheckBox