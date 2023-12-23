import React, { useState } from 'react'
import { LuImagePlus } from "react-icons/lu";
import styles from "../styles/register.module.css"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [err,setErr]=useState(false);
  const navigate=useNavigate()
  
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/")
    } catch (error) {
      setErr(true);
      console.error("Error logging in user:", error);
    }
  };
  return (
    <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
            <span className={styles.logo}>Lets Chat</span>
            <span className={styles.title}>Login</span>
            <form action="submit" className={styles.formContent} onSubmit={handleSubmit}>
                <input type="email" placeholder='Email'/>
                <input type="password" placeholder='Password'/>
                
                <button className={styles.btn} type='submit'>Sign In</button>
                {err && (<span>Something went wrong </span>)}
            </form>
            <p >You don`t have an account? <span className={styles.regLoginLink}><Link to="/register">Register</Link></span></p>
        </div>
    </div>
  )
}

export default Login