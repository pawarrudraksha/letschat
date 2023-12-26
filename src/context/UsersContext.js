import React, { createContext, useContext, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { AuthContext } from './AuthContext';


export const UsersContext = createContext();

export const UsersContextProvider = ({ children }) => {
  const [users,setUsers]=useState(null)
  const [rawUsers,setRawUsers]=useState(null)
  const {currentUser}=useContext(AuthContext)
  const [checkedUsers, setCheckedUsers] = useState({});

  const toggleCheckedUser = (userId) => {
    setCheckedUsers((prevCheckedUsers) => ({
      ...prevCheckedUsers,
      [userId]: !prevCheckedUsers[userId],
    }));
  };
  const clearCheckedUsers = () => {
    setCheckedUsers({}); // Reset checkedUsers to an empty object
  };
  const getAllUsers = async () => {
    const usersArray = []; 
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
        
      querySnapshot.forEach((doc) => {
        usersArray.push({
          id: doc.id,
          data: doc.data()
        });
      });

      setRawUsers(usersArray)
      const filteredUsers=usersArray.filter((user)=>user.id!==currentUser.uid)
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <UsersContext.Provider value={{ checkedUsers, toggleCheckedUser,clearCheckedUsers ,users,rawUsers,getAllUsers}}>
      {children}
    </UsersContext.Provider>
  );
};
