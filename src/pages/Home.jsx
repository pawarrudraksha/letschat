import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import styles from "../styles/home.module.css"
import { SearchMessageContext } from '../context/SearchMessageContext'
import SearchMessages from '../components/SearchMessages'
import ContactGroupInfo from '../components/ContactGroupInfo'
import { GroupContext } from '../context/GroupContext'

const Home = () => {
  const {isSearchBarOpen}=useContext(SearchMessageContext)
  const {isContactGroupInfo } = useContext(GroupContext);
  return (
    <div className={`${styles.home} ${isSearchBarOpen && styles.ifSearchOpenHomeStyle}`}>
      <div className={styles.container}>
        <Sidebar/>
        <Chat/>
        {isSearchBarOpen && <SearchMessages/>}
        {isContactGroupInfo && <ContactGroupInfo/>}
      </div>
    </div>
  )
}

export default Home