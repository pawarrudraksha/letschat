import React, { useContext } from 'react'
import styles from '../styles/sidebar.module.css'
import Navbar from './Navbar'
import Search from './Search'
import Chats from './Chats'
import { GroupContext } from '../context/GroupContext'
import GroupModal from './GroupModal'
import CreateGroupInfo from './CreateGroupInfo'

const Sidebar = () => {
  const { isGroupOpen, isGroupInfoOpen } = useContext(GroupContext);
  return (
    <div className={styles.sidebar}>
      <Navbar/>
      {isGroupOpen && <GroupModal/>}
      {isGroupInfoOpen&&<CreateGroupInfo/>}
      {!isGroupInfoOpen && !isGroupOpen &&( <>
      <Search/>
      <Chats/>
      </>)
      }
    </div>
  )
}

export default Sidebar