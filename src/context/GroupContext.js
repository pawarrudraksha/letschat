import { createContext, useReducer } from "react";

export const GroupContext = createContext();

export const GroupContextProvider = ({ children }) => {
  const INITIAL_STATE = {
    isGroupOpen: false,
    isGroupInfoOpen:false,
    groupId:"",
    chatType:"",
  };


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
      setGroupId: (newGroupId) => dispatch({ type: "SET_GROUP_ID",payload:newGroupId }),
      clearGroupId: () => dispatch({ type: "CLEAR_GROUP_ID" }),
      groupId:state.groupId,
      chatType:state.chatType,
      setChatType: (chatType) => dispatch({ type: "SET_CHAT_TYPE",payload:chatType })
  }}>
      {children}
    </GroupContext.Provider>
  );
};

export default GroupContextProvider;
