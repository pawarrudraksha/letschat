import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import styles from "../styles/home.module.css"
import { SearchMessageContext } from '../context/SearchMessageContext'
import SearchMessages from '../components/SearchMessages'

const Home = () => {
  const {isSearchBarOpen}=useContext(SearchMessageContext)
  return (
    <div className={`${styles.home} ${isSearchBarOpen && styles.ifSearchOpenHomeStyle}`}>
      <div className={styles.container}>
        <Sidebar/>
        <Chat/>
        {isSearchBarOpen && <SearchMessages/>}
      </div>
    </div>
  )
}

export default Home