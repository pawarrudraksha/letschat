import { doc, getDoc } from "firebase/firestore";
import { createContext, useReducer, useState } from "react";
import { db } from "../firebase";

export const GroupContext = createContext();

export const GroupContextProvider = ({ children }) => {
  const INITIAL_STATE = {
    isGroupOpen: false, // for creat group modal 1
    isGroupInfoOpen:false,// for create group modal 2
    isContactGroupInfo:false,// for contact and group information
    groupId:"",
    chatType:"",
  };

  const [groupData,setGroupData]=useState({})
  const [groupMembersInfo,setGroupMembersInfo]=useState([])

  const getMembersInfo = (users) => {
    const filteredUsers = users?.filter(user => groupData?.groupMembers.includes(user.id));
    setGroupMembersInfo(filteredUsers);
  };
  
  const getGroupById=async(groupId)=>{
    const groupDocRef = doc(db, 'groups', groupId);
    const groupSnapshot = await getDoc(groupDocRef);
    setGroupData(groupSnapshot.data())
  } 

  const groupReducer = (state, action) => {
    switch (action.type) {
      case "TOGGLE":
        return {
          ...state,
          isGroupOpen: !state.isGroupOpen,
        };
      case "TOGGLE_GROUP_INFO":
        return {
          ...state,
          isGroupInfoOpen: !state.isGroupInfoOpen,
        };
      case "TOGGLE_CONTACT_GROUP_INFO":
        return {
          ...state,
          isContactGroupInfo: !state.isContactGroupInfo,
        };
      case "SET_GROUP_ID":
        return {
          ...state,
          groupId:action.payload
        };
      case "CLEAR_GROUP_ID":
        return {
          ...state,
          groupId:""
        };
      case "SET_CHAT_TYPE":
        return {
          ...state,
          chatType:action.payload
        };
      case "CLEAR_CHAT_TYPE":
        return {
          ...state,
          chatType:""
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(groupReducer, INITIAL_STATE);

  
  return (
    <GroupContext.Provider value={{ isGroupOpen: state.isGroupOpen, 
      toggleGroup: () => dispatch({ type: "TOGGLE" }),   
      isGroupInfoOpen: state.isGroupInfoOpen,
      toggleGroupInfo: () => dispatch({ type: "TOGGLE_GROUP_INFO", }),
      isContactGroupInfo: state.isContactGroupInfo,
      toggleContactGroupInfo: () => dispatch({ type: "TOGGLE_CONTACT_GROUP_INFO", }),
      setGroupId: (newGroupId) => dispatch({ type: "SET_GROUP_ID",payload:newGroupId }),
      clearGroupId: () => dispatch({ type: "CLEAR_GROUP_ID" }),
      groupId:state.groupId,
      chatType:state.chatType,
      setChatType: (chatType) => dispatch({ type: "SET_CHAT_TYPE",payload:chatType }),
      clearChatType: () => dispatch({ type: "CLEAR_CHAT_TYPE"}),
      getGroupById,
      groupData,
      groupMembersInfo,
      getMembersInfo
  }}>
      {children}
    </GroupContext.Provider>
  );
};

export default GroupContextProvider;
