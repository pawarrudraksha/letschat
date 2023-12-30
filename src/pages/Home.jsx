import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import styles from "../styles/home.module.css"
import { SearchMessageContext } from '../context/SearchMessageContext'
import SearchMessages from '../components/SearchMessages'
import ContactGroupInfo from '../components/ContactGroupInfo'
import { GroupContext } from '../context/GroupContext'
import { UsersContext } from '../context/UsersContext'
import InitialChat from '../components/InitialChat'
import { HomeContext } from '../context/HomeContext'
import UpdateProfle from '../components/UpdateProfile'
import ViewPhoto from '../components/ViewPhoto'
import ForwardMessageModal from '../components/ForwardMessageModal'

const Home = () => {
  const {isSearchBarOpen}=useContext(SearchMessageContext)
  const {isContactGroupInfo,chatType } = useContext(GroupContext);
  const {isUpdateProfile,isViewPhoto,isForwardMsg}=useContext(HomeContext)
  
  return (
    <div className={`${styles.home} ${isSearchBarOpen && styles.ifSearchOpenHomeStyle}`}>
      <div className={styles.container}>
        {isUpdateProfile ?<UpdateProfle/>  :<Sidebar/>}
        { chatType && <Chat/>}
        {!chatType && <InitialChat/>}
        {isSearchBarOpen && <SearchMessages/>}
        {isContactGroupInfo && <ContactGroupInfo/>}
        {isViewPhoto && <ViewPhoto/>}
        {isForwardMsg && <ForwardMessageModal/>}
      </div>
    </div>
  )
}

export default Home