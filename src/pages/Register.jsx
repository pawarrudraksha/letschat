import React, { useState } from 'react'
import styles from "../styles/register.module.css"
import {  createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {  ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {  auth,db,storage } from "../firebase";
import { doc, setDoc ,addDoc,getDocs,collection} from "firebase/firestore"; 
import { LuImagePlus } from "react-icons/lu";
import { Link, useNavigate } from 'react-router-dom';


const Register = () => {
  const [err,setErr]=useState(false);
  const navigate=useNavigate()
  
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
  
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
  
      const storageRef = ref(storage, name);
      const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
  
      await updateProfile(res.user, {
        displayName: name,
        photoURL: downloadURL
      });
  
  
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName:name,
        email,
        photoURL: downloadURL
      });

      await setDoc(doc(db,"userChats",res.user.uid),{})
      navigate("/")
    } catch (error) {
      setErr(true);
      console.error("Error creating user:", error);
    }
  };
  
  return (
    <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
            <span className={styles.logo}>Lets Chat</span>
            <span className={styles.title}>Register</span>
            <form action="submit" className={styles.formContent} onSubmit={handleSubmit}>
                <input type="text" placeholder='Name'/>
                <input type="email" placeholder='Email'/>
                <input type="password" placeholder='Password'/>
                <label htmlFor="fileUpload"> 
                    <div  className={styles.customFileUpload}>

                    <LuImagePlus/>
                    <span>Add an avatar</span>
                    </div>
                    <input type="file" id="fileUpload"  style={{display:"none"}}/>
                </label>               
                <button className={styles.btn} type='submit'>Sign Up</button>
                {err && (<span>Something went wrong </span>)}
            </form>
            <p >You do have an account? <span className={styles.regLoginLink}><Link to="/login">Login</Link></span></p>
        </div>
    </div>
  )
}

export default Register